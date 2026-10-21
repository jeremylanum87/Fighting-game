'use strict';
function showTitleScreen(){mode='title';clearInput();resultReveal=null;document.body.classList.remove('selecting');document.body.classList.add('title-open');$('#characterSelect').hidden=true;$('#titleScreen').hidden=false;$('#titleStart').focus()}
$('#titleStart').onclick=openCharacterSelection;$('#homeButton').onclick=showTitleScreen;
$('#titleHelp').onclick=()=>{const box=$('#titleInstructions');box.hidden=!box.hidden;$('#titleHelp').setAttribute('aria-expanded',String(!box.hidden))};
function syncTitleSound(){$('#titleSound').textContent=sound?'BEAT ON':'BEAT OFF';$('#titleSound').setAttribute('aria-pressed',String(sound))}
$('#titleSound').onclick=()=>{$('#sound').onclick();syncTitleSound()};const soundBeforeTitle=$('#sound').onclick;$('#sound').onclick=()=>{soundBeforeTitle();syncTitleSound()};
function drawTitleArt(t){if(!$('#titleScreen').hidden){const g=$('#titleArt').getContext('2d');g.drawImage(court,0,0);if(typeof renderStreetFighter==='function')for(const [id,x,face] of [['brick',800,-1],['goldie',945,1]])renderStreetFighter(g,{character:id,x,y:430,face,animState:'idle',animTime:t/1000},2.9)}requestAnimationFrame(drawTitleArt)}

showTitleScreen();requestAnimationFrame(drawTitleArt);
