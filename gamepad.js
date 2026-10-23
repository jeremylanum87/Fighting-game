'use strict';
const PAD_KEYS={0:'w',1:'g',2:'j',3:'k',4:'l',5:'f',6:'u',10:'i',11:'o'};
let padIndex=null,padButtons=[],padOwned=new Set(),padKeyboard=new Set(),padNeedsNeutral=true,padClock=0,padRepeatAt=0,padDirection='';
function padPressed(p,n){const b=p.buttons?.[n];return !!(b&&(b.pressed||b.value>.55))}
function releasePadKeys(){
 for(const key of padOwned)if(!padKeyboard.has(key)&&![...touchPointers.values()].some(v=>v.key===key))keys.delete(key);
 padOwned.clear();
}
function padStatus(text){const el=$('#physicalControllerStatus');if(el&&el.textContent!==text)el.textContent=text}
function padVisible(el){return !!el&&!el.hidden&&!el.disabled&&(typeof el.getClientRects!=='function'||el.getClientRects().length>0)}
function padMenuRoot(){
 for(const el of document.querySelectorAll('[role="dialog"],.modal-shade'))if(padVisible(el))return el;
 return mode==='title'?$('#titleScreen'):mode==='selecting'?$('#characterSelect'):mode==='stage-select'?$('#stageSelection'):mode==='intro'?$('#fightOpening'):$('#overlay');
}
function padFocusItems(){return [...padMenuRoot().querySelectorAll('button,select,summary,input')].filter(padVisible)}
function padNavigate(direction){
 const items=padFocusItems();if(!items.length)return;
 const current=document.activeElement;
 if(current?.tagName==='SELECT'&&['left','right'].includes(direction)){
 const delta=direction==='left'?-1:1;
 current.selectedIndex=Math.max(0,Math.min(current.options.length-1,current.selectedIndex+delta));
 current.dispatchEvent(new Event('change',{bubbles:true}));return;
 }
 const i=items.indexOf(current),step=['left','up'].includes(direction)?-1:1;
 items[i<0?0:(i+step+items.length)%items.length].focus();
}
function padConfirm(){
 const items=padFocusItems(),focus=items.includes(document.activeElement)?document.activeElement:items[0];
 if(!focus)return;
 if(focus.tagName==='SELECT'){padNavigate('right');return}
 focus.click();
}
function padBack(){
 if(mode==='stage-select'){backFromStageSelection();return}
 if(mode==='selecting'){showTitleScreen();return}
 const root=padMenuRoot();
 const close=[...root.querySelectorAll('button')].find(b=>padVisible(b)&&/^(close|.*Back$|.*Exit$)/i.test(b.id));
 if(close){close.click();return}
 if(mode==='playing'||mode==='paused')pause();
}
function pollPhysicalController(dt){
 padClock+=dt;
 if(document.hidden){releasePadKeys();padNeedsNeutral=true;return}
 let pads=[];try{pads=typeof navigator!=='undefined'&&navigator.getGamepads?Array.from(navigator.getGamepads()):[]}catch{}
 const pad=pads.find(p=>p&&p.connected&&p.mapping==='standard');
 if(!pad){
 if(padIndex!==null){releasePadKeys();padNeedsNeutral=true;padButtons=[];padIndex=null;if(mode==='playing')pause()}
 padStatus('CONTROLLER · Press a button on an Xbox controller to connect.');return;
 }
 if(padIndex!==pad.index){releasePadKeys();padIndex=pad.index;padButtons=[];padNeedsNeutral=true}
 padStatus('XBOX CONTROLLER CONNECTED · A Jump · B Throw · X Light · Y Heavy · LB Block · RB Projectile · LT Special · RT Super · Start Pause');
 const now=Array.from({length:17},(_,i)=>padPressed(pad,i)),edge=i=>now[i]&&!padButtons[i];
 const x=Number.isFinite(pad.axes?.[0])?pad.axes[0]:0,y=Number.isFinite(pad.axes?.[1])?pad.axes[1]:0;
 const left=now[14]||x<-.35,right=now[15]||x>.35,up=now[12]||y<-.55,down=now[13]||y>.35;
 const neutral=!now.some(Boolean)&&Math.abs(x)<.22&&Math.abs(y)<.22;
 if(neutral)padNeedsNeutral=false;
 // Copy edges before navigation can clear inputs or change screens.
 const start=edge(9),back=edge(8)||edge(1),confirm=edge(0),superPress=edge(7),assistPress=edge(8);
 padButtons=now;
 const modal=[...document.querySelectorAll('[role="dialog"],.modal-shade')].some(padVisible);
 if(typeof roundImpact!=='undefined'&&roundImpact){releasePadKeys();return}
 if(typeof cinematicFinisher!=='undefined'&&cinematicFinisher){releasePadKeys();return}
 if(start){
 releasePadKeys();padNeedsNeutral=true;
 if(!modal&&(mode==='playing'||mode==='paused'))pause();
 else if(!modal&&mode==='title')startMode('quick');
 else if(!modal&&mode==='selecting')$('#confirmFighter').click();
 else if(!modal&&mode==='stage-select')$('#stageFightStart').click();
 return;
 }
 if(mode!=='playing'||modal){
 releasePadKeys();
 if(back){padBack();return}
 if(confirm){if(mode==='intro'&&typeof skipRivalIntro==='function')skipRivalIntro();else padConfirm();return}
 const direction=left?'left':right?'right':up?'up':down?'down':'';
 if(direction&&(direction!==padDirection||padClock>=padRepeatAt)){padNavigate(direction);padRepeatAt=padClock+(direction!==padDirection?.3:.13)}
 padDirection=direction;return;
 }
 padDirection='';
 releasePadKeys();
 if(padNeedsNeutral||superCinema)return;
 for(const [button,key]of Object.entries(PAD_KEYS))if(now[Number(button)])padOwned.add(key);
 if(left&&!right)padOwned.add('a');if(right&&!left)padOwned.add('d');if(down)padOwned.add('s');if(up)padOwned.add('w');
 for(const key of padOwned)keys.add(key);
 if(superPress)attack(player,'super');
 if(assistPress&&typeof storyRivalAssist==='function')storyRivalAssist();
}
window.addEventListener('keydown',e=>{if(!e.target||!['INPUT','SELECT','TEXTAREA'].includes(e.target.tagName))padKeyboard.add(e.key.toLowerCase())});
window.addEventListener('keyup',e=>padKeyboard.delete(e.key.toLowerCase()));
window.addEventListener('blur',()=>{padKeyboard.clear();releasePadKeys();padNeedsNeutral=true});
window.addEventListener('gamepaddisconnected',()=>{releasePadKeys();padNeedsNeutral=true;if(mode==='playing')pause()});
const clearBeforeGamepad=clearInput;
clearInput=function(){releasePadKeys();padKeyboard.clear();padNeedsNeutral=true;clearBeforeGamepad()};
const updateBeforeGamepad=update;
update=function(dt){pollPhysicalController(dt);updateBeforeGamepad(dt)};
padStatus('CONTROLLER · Press a button on an Xbox controller to connect.');
