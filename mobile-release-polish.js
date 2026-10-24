'use strict';
function coarseGameDevice(){return typeof window.matchMedia==='function'&&window.matchMedia('(pointer: coarse)').matches}
const autoWidthBeforeMobileRelease=autoVisualWidth;
autoVisualWidth=function(){const width=autoWidthBeforeMobileRelease();return coarseGameDevice()?Math.min(1650,width):width};
function trimReleaseVisualCaches(){highDetailStages.clear();stageGraphicsCache.clear();locationDetailCache.clear();stagePreviewKey=''}
const locationBeforeMobileRelease=locationStageDetails;
locationStageDetails=function(id){const image=locationBeforeMobileRelease(id);if(coarseGameDevice())while(locationDetailCache.size>2)locationDetailCache.delete(locationDetailCache.keys().next().value);return image};
const graphicsBeforeMobileRelease=stageGraphicsLayer;
stageGraphicsLayer=function(id){const image=graphicsBeforeMobileRelease(id);if(coarseGameDevice())while(stageGraphicsCache.size>2)stageGraphicsCache.delete(stageGraphicsCache.keys().next().value);return image};
// Returning from Android or another tab must not replay accumulated input or elapsed frames.
window.addEventListener('blur',()=>clearInput());
document.addEventListener('visibilitychange',()=>{clearInput();simulationAccumulator=0;flowAccumulator=0;last=performance.now();if(document.hidden)trimReleaseVisualCaches()});
window.addEventListener('pagehide',()=>{clearInput();trimReleaseVisualCaches()});
if(visualQualityMode==='auto'&&coarseGameDevice())applyVisualQuality();
const reportBeforeMobileRelease=updateDeviceReport;
updateDeviceReport=function(){reportBeforeMobileRelease();if(deviceTimes.length>=20){const times=deviceTimes.slice().sort((a,b)=>a-b),p95=times[Math.min(times.length-1,Math.floor(times.length*.95))];$('#deviceFps').textContent+=` · 95th-percentile frame ${p95.toFixed(1)} ms`;if(p95>25)$('#deviceFit').textContent+=' For steadier play, try Auto / Performance resolution and Low effects.'}};
