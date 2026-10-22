package com.blockcypher.game;

import android.app.AlertDialog;
import android.os.Bundle;
import android.view.View;
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

    @Override public void onCreate(Bundle state) {
        super.onCreate(state);
        getWindow().getDecorView().setSystemUiVisibility(
            View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY | View.SYSTEM_UI_FLAG_FULLSCREEN
            | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION | View.SYSTEM_UI_FLAG_LAYOUT_STABLE);
        game = new WebView(this);
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
                        if (choice == 1) game.evaluateJavascript("if(typeof showTitleScreen==='function')showTitleScreen();", null);
                        if (choice == 2) finish();
                    }).show();
            }
        });
        game.loadUrl(START);
    }
    private void pauseGame() {
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
        if (game != null) { game.destroy(); game = null; }
        super.onDestroy();
    }
}
