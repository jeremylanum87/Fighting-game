'use strict';
function showTitleScreen(){mode='title';clearInput();resultReveal=null;document.body.classList.remove('selecting');document.body.classList.add('title-open');$('#characterSelect').hidden=true;$('#titleScreen').hidden=false;$('#titleStart').focus()}
$('#titleStart').onclick=openCharacterSelection;$('#homeButton').onclick=showTitleScreen;
$('#titleHelp').onclick=()=>{const box=$('#titleInstructions');box.hidden=!box.hidden;$('#titleHelp').setAttribute('aria-expanded',String(!box.hidden))};
function syncTitleSound(){$('#titleSound').textContent=sound?'BEAT ON':'BEAT OFF';$('#titleSound').setAttribute('aria-pressed',String(sound))}
$('#titleSound').onclick=()=>{$('#sound').onclick();syncTitleSound()};const soundBeforeTitle=$('#sound').onclick;$('#sound').onclick=()=>{soundBeforeTitle();syncTitleSound()};
function drawTitleArt(t){if(!$('#titleScreen').hidden){const c=$('#titleArt'),g=c.getContext('2d');g.drawImage(court,0,0);for(const [id,x,flip] of [['brick',800,-1],['goldie',945,1]]){const cfg=fighterRoster[id],s=spriteSets[cfg.base].idle;if(!s.image.complete||!s.image.naturalWidth)continue;g.save();g.translate(x,430);g.scale(flip*(cfg.base==='ember'?-1:1),1);g.filter=cfg.filter;g.imageSmoothingEnabled=false;g.shadowColor=cfg.color;g.shadowBlur=9;g.drawImage(s.image,(Math.floor(t/125)%s.frames)*200,0,200,200,-360,-(cfg.base==='volt'?122:128)*3.6,720,720);g.restore()}}requestAnimationFrame(drawTitleArt)}
showTitleScreen();requestAnimationFrame(drawTitleArt);
