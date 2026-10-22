#pragma once
#include <algorithm>
#include <array>
#include <cmath>
#include <vector>

namespace Cypher
{
enum class Action { None, Light, Heavy, Special, Throw };
enum class Cue { None, Hit, Block, Perfect, Dash, Breakaway, Tech, KO };
struct Input { bool left=false,right=false,jump=false,duck=false,block=false,light=false,heavy=false,special=false,grab=false; };
struct Move { int startup=0,active=0,recovery=0,damage=0,chip=0,stun=0,range=0; };
inline Move Stats(Action a,int character)
{
    switch(a) {
    case Action::Light:return {character==0?4:5,3,12,7,1,15,112};
    case Action::Heavy:return {9,4,23,13,2,22,150};
    case Action::Special:return {16,1,30,12,2,20,0};
    case Action::Throw:return {8,2,28,16,0,28,96};
    default:return {};
    }
}
struct Fighter {
    float x=0,z=0,vz=0;
    int character=0,face=1,hp=100,meter=0,stun=0,guardStun=0,invincible=0;
    int frame=0,guardWindow=0,guardCooldown=0,dash=0,dashCooldown=0,lock=0,tech=0,techCooldown=0;
    int combo=0,comboTimer=0;
    Action action=Action::None;
    bool connected=false,guard=false,duck=false;
    Cue cue=Cue::None;int cueFrames=0;
};
struct Projectile { float x=0,z=0;int owner=0,dir=1,life=0; };
struct Match {
    std::array<Fighter,2> fighters{};
    std::array<Input,2> previous{};
    std::array<int,2> wins{0,0};
    std::vector<Projectile> projectiles;
    int round=1,remaining=3600,hitstop=0,roundWait=0,tick=0;
    bool finished=false;
    Match(){ResetRound();}
    static void Show(Fighter& f,Cue c){f.cue=c;f.cueFrames=38;}
    void ResetRound(){
        const int a=fighters[0].character,b=fighters[1].character;
        fighters={};fighters[0].character=a;fighters[1].character=b;
        fighters[0].x=-220;fighters[1].x=220;fighters[1].face=-1;
        previous={};projectiles.clear();remaining=3600;hitstop=roundWait=0;
    }
    void Start(int character){wins={0,0};round=1;finished=false;tick=0;fighters[0].character=character;fighters[1].character=1-character;ResetRound();}
    static bool Free(const Fighter& f){return f.hp>0&&!f.stun&&!f.guardStun&&!f.lock&&f.action==Action::None;}
    bool Begin(int i,Action a){
        Fighter& f=fighters[i];
        if(!Free(f)||f.guard||(a==Action::Throw&&f.z>0))return false;
        if(a==Action::Special&&(f.meter<25||projectiles.size()>=8))return false;
        if(a==Action::Special)f.meter-=25;
        f.action=a;f.frame=0;f.connected=false;return true;
    }
    bool Hit(int owner,Action action,bool projectile=false,int direction=0){
        Fighter& a=fighters[owner];Fighter& t=fighters[1-owner];
        if(t.hp<=0||t.invincible)return false;
        const Move m=Stats(action,a.character);
        if(action==Action::Throw){
            if(t.z>0||t.stun||t.guardStun)return false;
            if(t.tech>0&&!t.lock&&(t.action==Action::None||t.action==Action::Throw)){
                t.tech=0;t.action=a.action=Action::None;t.lock=a.lock=10;
                t.invincible=a.invincible=6;
                t.x+=a.face*35;a.x-=a.face*35;Show(t,Cue::Tech);return true;
            }
        }
        const bool blocked=action!=Action::Throw&&t.guard&&t.z==0;
        if(blocked){
            const bool perfect=t.guardWindow>0;
            t.guardWindow=0;t.hp=std::max(0,t.hp-(perfect?0:m.chip));
            t.guardStun=perfect?5:12;t.meter=std::min(100,t.meter+(perfect?15:7));
            Show(t,perfect?Cue::Perfect:Cue::Block);a.combo=0;
        }else{
            a.combo=t.stun>0&&a.comboTimer>0?a.combo+1:1;a.comboTimer=70;
            const int damage=std::max(1,m.damage*std::max(40,110-a.combo*10)/100);
            t.hp=std::max(0,t.hp-damage);t.stun=m.stun;t.action=Action::None;t.guard=false;t.guardWindow=0;
            a.meter=std::min(100,a.meter+damage);Show(t,t.hp==0?Cue::KO:Cue::Hit);
        }
        t.x=std::clamp(t.x+(direction?direction:a.face)*(blocked?8.f:24.f),-650.f,650.f);
        hitstop=blocked?3:5;
        (void)projectile;return true;
    }
    bool Breakaway(int i){
        Fighter& f=fighters[i];Fighter& other=fighters[1-i];
        if(f.hp<=0||f.z>0||f.stun||f.lock||!f.guardStun||f.meter<50)return false;
        f.meter-=50;f.guardStun=0;f.guard=false;f.lock=15;f.invincible=6;
        if(std::abs(f.x-other.x)<210){other.x=std::clamp(other.x+f.face*80,-650.f,650.f);other.stun=11;other.action=Action::None;}
        projectiles.erase(std::remove_if(projectiles.begin(),projectiles.end(),[&](const Projectile& p){return p.owner!=i&&std::abs(p.x-f.x)<210;}),projectiles.end());
        Show(f,Cue::Breakaway);return true;
    }
    void Control(int i,const Input& in){
        Fighter& f=fighters[i];const Input& old=previous[i];
        const bool back=f.face==1?in.left:in.right,oldBack=f.face==1?old.left:old.right;
        if(in.grab&&!old.grab&&Free(f)&&f.techCooldown==0){f.tech=9;f.techCooldown=36;}
        if(in.block&&in.heavy&&!old.heavy&&Breakaway(i))return;
        if(in.block&&back&&!oldBack&&Free(f)&&f.z==0&&!f.dashCooldown){
            f.dash=f.lock=14;f.dashCooldown=42;f.invincible=4;Show(f,Cue::Dash);
        }
        f.duck=in.duck&&f.z==0;
        f.guard=in.block&&!f.stun&&!f.lock&&f.action==Action::None&&f.z==0;
        if(in.block&&!old.block&&f.guard&&!f.guardStun&&f.guardCooldown==0){f.guardWindow=7;f.guardCooldown=27;}
        if(!in.block)f.guardWindow=0;
        if(Free(f)&&!f.guard){
            if(in.jump&&!old.jump&&f.z==0){f.vz=650;}
            f.x=std::clamp(f.x+((in.right?1:0)-(in.left?1:0))*(f.duck?0.f:4.8f),-650.f,650.f);
            if(in.grab&&!old.grab)Begin(i,Action::Throw);
            else if(in.special&&!old.special)Begin(i,Action::Special);
            else if(in.heavy&&!old.heavy)Begin(i,Action::Heavy);
            else if(in.light&&!old.light)Begin(i,Action::Light);
        }
    }
    static void Dec(int& n){n=std::max(0,n-1);}
    void Step(const std::array<Input,2>& inputs){
        if(finished)return;
        if(roundWait>0){if(--roundWait==0){++round;ResetRound();}return;}
        if(hitstop>0){--hitstop;return;}
        ++tick;--remaining;
        // Both fighters decide before either attack resolves.
        for(int i=0;i<2;++i){auto& f=fighters[i];if(f.action==Action::None)f.face=fighters[1-i].x>=f.x?1:-1;Control(i,inputs[i]);}
        std::array<Action,2> Pending{Action::None,Action::None};
        for(int i=0;i<2;++i){
            auto& f=fighters[i];
            if(f.dash>6&&!f.stun)f.x=std::clamp(f.x-f.face*8.f,-650.f,650.f);
            if(f.z>0||f.vz>0){f.z=std::max(0.f,f.z+f.vz/60.f);f.vz-=1500.f/60.f;if(f.z==0)f.vz=0;}
            if(f.action!=Action::None){
                const Move m=Stats(f.action,f.character);++f.frame;
                if(f.action==Action::Special&&f.frame==m.startup)projectiles.push_back({f.x+f.face*55,70.f+f.z,i,f.face,120});
                if(f.action!=Action::Special&&!f.connected&&f.frame>=m.startup&&f.frame<m.startup+m.active&&std::abs(f.x-fighters[1-i].x)<m.range&&std::abs(f.z-fighters[1-i].z)<100)Pending[i]=f.action;
                if(f.frame>=m.startup+m.active+m.recovery)f.action=Action::None;
            }
        }
        for(int i=0;i<2;++i)if(Pending[i]!=Action::None)fighters[i].connected=Hit(i,Pending[i]);
        for(auto& p:projectiles){
            const float before=p.x;p.x+=p.dir*9.f;--p.life;
            const auto& t=fighters[1-p.owner];
            if(std::min(before,p.x)-35<t.x&&std::max(before,p.x)+35>t.x&&std::abs(p.z-(t.z+70))<65&&Hit(p.owner,Action::Special,true,p.dir))p.life=0;
        }
        projectiles.erase(std::remove_if(projectiles.begin(),projectiles.end(),[](const Projectile& p){return p.life<=0;}),projectiles.end());
        auto& a=fighters[0];auto& b=fighters[1];
        if(std::abs(a.x-b.x)<65&&std::abs(a.z-b.z)<110){const float mid=std::clamp((a.x+b.x)/2,-617.f,617.f),d=a.x<=b.x?1.f:-1.f;a.x=mid-32.5f*d;b.x=mid+32.5f*d;}
        for(auto& f:fighters){
            Dec(f.stun);Dec(f.guardStun);Dec(f.invincible);Dec(f.guardWindow);Dec(f.guardCooldown);Dec(f.dash);Dec(f.dashCooldown);Dec(f.lock);Dec(f.tech);Dec(f.techCooldown);Dec(f.comboTimer);Dec(f.cueFrames);
        }
        previous=inputs;
        if(a.hp==0||b.hp==0||remaining<=0){
            if(a.hp!=b.hp)++wins[a.hp>b.hp?0:1];
            finished=wins[0]>=2||wins[1]>=2;roundWait=finished?0:100;
            a.action=b.action=Action::None;projectiles.clear();
        }
    }
};
}
