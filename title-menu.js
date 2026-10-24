'use strict';
function cleanTitleLabels(){$('#titleStart').textContent='FIGHT';$('#titleShowcase').textContent='WATCH / CPU VS CPU';$('#titleTraining').textContent='TRAINING';$('#titleControls').textContent='SETTINGS';$('#titleHelp').textContent='HOW TO PLAY';$('#menuFeaturedPrevious').textContent='<';$('#menuFeaturedNext').textContent='>'; $('#menuTickerNext').tabIndex=-1}
for(const [current,other] of [['#menuMoreModes','#menuMoreExtras'],['#menuMoreExtras','#menuMoreModes']])$(current).addEventListener('toggle',()=>{if($(current).open)$(other).open=false});
const closeSettingsBeforeCleanTitle=$('#closeSettings').onclick;$('#closeSettings').onclick=()=>{closeSettingsBeforeCleanTitle();if(mode==='title')$('#titleControls').focus()};
const titleBeforeCleanMenu=showTitleScreen;showTitleScreen=function(){titleBeforeCleanMenu();cleanTitleLabels()};
cleanTitleLabels();

$('#closeMenuModes').onclick=()=>{$('#menuMoreModes').open=false;$('#moreModesToggle').focus()};
$('#closeMenuExtras').onclick=()=>{$('#menuMoreExtras').open=false;$('#moreExtrasToggle').focus()};
window.addEventListener('keydown',e=>{if(mode!=='title'||e.key!=='Escape'||!$('#controlSettings').hidden)return;for(const [drawer,toggle] of [['#menuMoreModes','#moreModesToggle'],['#menuMoreExtras','#moreExtrasToggle']])if($(drawer).open){$(drawer).open=false;$(toggle).focus();e.preventDefault();break}});
// Keep controller navigation inside the expanded menu, while preserving modal priority.
const padRootBeforeCleanTitle=padMenuRoot;
padMenuRoot=function(){const root=padRootBeforeCleanTitle();if(mode==='title'&&root===$('#titleScreen')){if($('#menuMoreModes').open)return $('#menuMoreModes');if($('#menuMoreExtras').open)return $('#menuMoreExtras')}return root};
