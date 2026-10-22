#include "../Source/BlockCypher/CombatCore.h"
#include <cassert>
#include <iostream>
using namespace Cypher;
void Close(Match& m){m.fighters[0].x=-40;m.fighters[1].x=40;}
int main(){
    Match m;m.Start(0);Close(m);
    Input punch;punch.light=true;
    for(int n=0;n<3;++n)m.Step({punch,{}});
    assert(m.fighters[1].hp==100);
    m.Step({punch,{}});assert(m.fighters[1].hp==93);
    for(int n=0;n<100;++n)m.Step({punch,{}});
    assert(m.fighters[1].hp==93); // Holding does not repeat.
    m.Start(0);Close(m);m.fighters[0].action=Action::Light;m.fighters[0].frame=3;
    Input guard;guard.block=true;m.Step({Input{},guard});
    assert(m.fighters[1].hp==100&&m.fighters[1].meter==15);
    assert(m.fighters[1].cue==Cue::Perfect);
    m.hitstop=0;m.fighters[0].action=Action::Light;m.fighters[0].connected=false;m.fighters[0].frame=3;
    m.Step({Input{},guard});assert(m.fighters[1].hp==99&&m.fighters[1].meter==22);
    m.Start(0);Close(m);for(int n=0;n<12;++n)m.Step({Input{},guard});
    assert(m.Hit(0,Action::Heavy));assert(m.fighters[1].hp==98&&m.fighters[1].meter==7);
    m.Start(0);Close(m);m.fighters[1].guard=true;m.fighters[1].guardStun=12;m.fighters[1].meter=49;
    assert(!m.Breakaway(1));m.fighters[1].meter=65;
    m.projectiles.push_back({0,70,0,1,40});m.projectiles.push_back({500,70,0,1,40});
    assert(m.Breakaway(1));assert(m.fighters[1].meter==15&&m.projectiles.size()==1&&m.fighters[1].lock>0);
    m.Start(0);Close(m);m.fighters[1].tech=9;
    assert(m.Hit(0,Action::Throw));assert(m.fighters[1].hp==100&&m.fighters[1].cue==Cue::Tech);
    m.Start(0);Close(m);m.fighters[1].tech=0;
    assert(m.Hit(0,Action::Throw)&&m.fighters[1].hp==84);
    m.Start(0);Input dash;dash.left=dash.block=true;
    const float old=m.fighters[0].x;m.Step({dash,{}});
    assert(m.fighters[0].x<old&&m.fighters[0].invincible>0&&m.fighters[0].lock>0);
    for(int n=0;n<18;++n)m.Step({dash,{}});
    assert(m.fighters[0].invincible==0&&m.fighters[0].lock==0&&m.fighters[0].dashCooldown>0);
    m.Start(1);Close(m);m.fighters[1].hp=1;m.Hit(0,Action::Heavy);for(int n=0;n<8;++n)m.Step({Input{},Input{}});
    assert(m.wins[0]==1&&!m.finished);
    for(int n=0;n<100;++n)m.Step({Input{},Input{}});
    assert(m.round==2&&m.fighters[0].character==1&&m.fighters[1].hp==100);
    Close(m);m.fighters[1].hp=1;m.Hit(0,Action::Light);
    for(int n=0;n<8;++n)m.Step({Input{},Input{}});
    assert(m.finished&&m.wins[0]==2);
    m.Start(0);Close(m);m.fighters[0].action=m.fighters[1].action=Action::Light;
    m.fighters[0].frame=3;m.fighters[1].frame=4;m.Step({Input{},Input{}});
    assert(m.fighters[0].hp==93&&m.fighters[1].hp==93); // Same-frame trade.
    m.Start(0);m.fighters[0].meter=100;Input special;special.special=true;
    for(int n=0;n<20;++n)m.Step({special,{}});
    assert(m.fighters[0].meter==75&&m.projectiles.size()==1);
    for(int n=0;n<180;++n)m.Step({Input{},Input{}});
    assert(m.projectiles.empty());
    Match a,b;a.Start(0);b.Start(0);
    for(int n=0;n<18000;++n){
        if(a.finished){a.Start(n%2);b.Start(n%2);}
        Input x,y;x.right=n%160<70;x.left=n%160>100;x.light=n%31==0;x.heavy=n%73==0;
        x.block=n%41<12;x.grab=n%89==0;x.jump=n%173==0;x.special=n%127==0;
        y.left=n%170<70;y.block=n%53<17;y.light=n%37==0;y.grab=n%101==0;
        a.Step({x,y});b.Step({x,y});
        for(int i=0;i<2;++i){
            const auto& f=a.fighters[i];assert(f.hp>=0&&f.hp<=100&&f.meter>=0&&f.meter<=100);
            assert(std::isfinite(f.x)&&std::abs(f.x)<=650&&f.z>=0);
            assert(f.hp==b.fighters[i].hp&&f.x==b.fighters[i].x);
        }
        assert(a.projectiles.size()<=8);
    }
    std::cout<<"PASS startup, held inputs, perfect/normal guard, paid breakaway, tech, dash, rounds, trades, projectiles and 18000 deterministic frames\n";
}
