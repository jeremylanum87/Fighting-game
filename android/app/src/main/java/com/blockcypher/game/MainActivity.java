package com.blockcypher.game;

import android.app.AlertDialog;
import android.os.Bundle;
import android.speech.tts.TextToSpeech;
import android.speech.tts.UtteranceProgressListener;
import android.speech.tts.Voice;
import android.webkit.JavascriptInterface;
import java.util.Locale;
import org.json.JSONArray;
import org.json.JSONObject;
import android.view.View;
import android.view.MotionEvent;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import androidx.activity.ComponentActivity;
import androidx.activity.OnBackPressedCallback;
import androidx.webkit.WebViewAssetLoader;
import androidx.webkit.WebViewClientCompat;
import java.io.ByteArrayInputStream;
import java.nio.charset.StandardCharsets;

public final class MainActivity extends ComponentActivity {
    private static final String HOST = "appassets.androidplatform.net";
    private static final String START = "https://" + HOST + "/assets/www/index.html";
    private WebView game;
    private TextToSpeech djSpeech;
    private volatile boolean djReady;
    private void voiceEvent(String token, String state) {
        runOnUiThread(() -> {
            if (game != null) game.evaluateJavascript("window.dispatchEvent(new CustomEvent('blockcypher-voice',{detail:{token:"
                + JSONObject.quote(token) + ",state:" + JSONObject.quote(state) + "}}));", null);
        });
    }
    private final class DjVoiceBridge {
        @JavascriptInterface public boolean isReady() { return djReady; }
        @JavascriptInterface public String getVoices() {
            JSONArray list = new JSONArray();
            if (djReady && djSpeech != null) try {
                for (Voice voice : djSpeech.getVoices()) {
                    if (!"en".equals(voice.getLocale().getLanguage())) continue;
                    JSONObject entry = new JSONObject();
                    entry.put("name", voice.getName());
                    entry.put("quality", voice.getQuality());
                    entry.put("lang", voice.getLocale().toLanguageTag());
                    entry.put("voiceURI", "android:" + voice.getName());
                    entry.put("localService", !voice.isNetworkConnectionRequired());
                    list.put(entry);
                }
            } catch (Exception ignored) { }
            return list.toString();
        }
        @JavascriptInterface public void stop() {
            runOnUiThread(() -> { if (djSpeech != null) djSpeech.stop(); });
        }
        @JavascriptInterface public void speak(String text, float rate, float pitch, float volume, String voiceKey, String token) {
            if (text == null || text.length() > 240 || !djReady) { voiceEvent(token, "error"); return; }
            runOnUiThread(() -> {
                if (djSpeech == null || !djReady) { voiceEvent(token, "error"); return; }
                try {
                    djSpeech.setLanguage(Locale.US);
                    if (voiceKey != null && voiceKey.startsWith("android:")) {
                        for (Voice voice : djSpeech.getVoices()) if (voice.getName().equals(voiceKey.substring(8))) {
                            djSpeech.setVoice(voice); break;
                        }
                    }
                    djSpeech.setSpeechRate(Math.max(.75f, Math.min(1.3f, rate)));
                    djSpeech.setPitch(Math.max(.7f, Math.min(1.2f, pitch)));
                    Bundle options = new Bundle();
                    options.putFloat(TextToSpeech.Engine.KEY_PARAM_VOLUME, Math.max(0, Math.min(1, volume)));
                    int result = djSpeech.speak(text, TextToSpeech.QUEUE_FLUSH, options, token);
                    if (result == TextToSpeech.ERROR) voiceEvent(token, "error");
                } catch (Exception error) { voiceEvent(token, "error"); }
            });
        }
    }

    @Override public void onCreate(Bundle state) {
        super.onCreate(state);
        getWindow().getDecorView().setSystemUiVisibility(
            View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY | View.SYSTEM_UI_FLAG_FULLSCREEN
            | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION | View.SYSTEM_UI_FLAG_LAYOUT_STABLE);
        game = new WebView(this) {
            @Override public boolean onTouchEvent(MotionEvent event) {
                if (event.getActionMasked() == MotionEvent.ACTION_DOWN) requestUnbufferedDispatch(event);
                return super.onTouchEvent(event);
            }
        };
        game.setKeepScreenOn(true);
        setContentView(game);
        WebSettings settings = game.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setAllowFileAccess(false);
        settings.setAllowContentAccess(false);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        settings.setMediaPlaybackRequiresUserGesture(true);
        settings.setSupportMultipleWindows(false);
        WebView.setWebContentsDebuggingEnabled(BuildConfig.DEBUG);
        final WebViewAssetLoader assets = new WebViewAssetLoader.Builder()
            .addPathHandler("/assets/", new WebViewAssetLoader.AssetsPathHandler(this)).build();
        game.setWebChromeClient(new WebChromeClient());
        game.setWebViewClient(new WebViewClientCompat() {
            @Override public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                WebResourceResponse local = assets.shouldInterceptRequest(request.getUrl());
                if (local != null) return local;
                return new WebResourceResponse("text/plain", "UTF-8", 403, "Offline app", null,
                    new ByteArrayInputStream("External requests disabled".getBytes(StandardCharsets.UTF_8)));
            }
            @Override public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                return !"https".equals(request.getUrl().getScheme()) || !HOST.equals(request.getUrl().getHost());
            }
        });
        getOnBackPressedDispatcher().addCallback(this, new OnBackPressedCallback(true) {
            @Override public void handleOnBackPressed() {
                pauseGame();
                new AlertDialog.Builder(MainActivity.this).setTitle("Block Cypher")
                    .setItems(new String[]{"Resume", "Main menu", "Exit"}, (dialog, choice) -> {
                        if (choice == 0) game.evaluateJavascript("if(typeof mode!=='undefined'&&mode==='paused'&&typeof pause==='function')pause();", null);
                        if (choice == 1) game.evaluateJavascript("if(typeof showTitleScreen==='function')showTitleScreen();", null);
                        if (choice == 2) finish();
                    }).show();
            }
        });
        game.addJavascriptInterface(new DjVoiceBridge(), "BlockCypherVoice");
        djSpeech = new TextToSpeech(this, status -> {
            if (status == TextToSpeech.SUCCESS && djSpeech != null) {
                int language = djSpeech.setLanguage(Locale.US);
                djReady = language != TextToSpeech.LANG_MISSING_DATA && language != TextToSpeech.LANG_NOT_SUPPORTED;
                djSpeech.setOnUtteranceProgressListener(new UtteranceProgressListener() {
                    @Override public void onStart(String id) { voiceEvent(id, "start"); }
                    @Override public void onDone(String id) { voiceEvent(id, "end"); }
                    @Override public void onError(String id) { voiceEvent(id, "error"); }
                });
                runOnUiThread(() -> { if (game != null) game.evaluateJavascript("window.dispatchEvent(new Event('blockcypher-voices-ready'));", null); });
            }
        });
        game.loadUrl(START);
    }
    private void pauseGame() {
        if (djSpeech != null) djSpeech.stop();
        if (game != null) game.evaluateJavascript(
            "if(typeof clearInput==='function')clearInput();if(typeof mode!=='undefined'&&mode==='playing'&&typeof pause==='function')pause();", null);
    }
    @Override protected void onPause() {
        pauseGame();
        if (game != null) { game.onPause(); game.pauseTimers(); }
        super.onPause();
    }
    @Override protected void onResume() {
        super.onResume();
        if (game != null) { game.onResume(); game.resumeTimers(); }
    }
    @Override protected void onDestroy() {
        djReady = false;
        if (djSpeech != null) { djSpeech.stop(); djSpeech.shutdown(); djSpeech = null; }
        if (game != null) { game.removeJavascriptInterface("BlockCypherVoice"); game.destroy(); game = null; }
        super.onDestroy();
    }
}
