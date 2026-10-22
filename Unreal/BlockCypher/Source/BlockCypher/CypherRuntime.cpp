#include "CypherRuntime.h"
#include "Modules/ModuleManager.h"
#include "Components/StaticMeshComponent.h"
#include "Components/SceneComponent.h"
#include "Materials/MaterialInstanceDynamic.h"
#include "Camera/CameraActor.h"
#include "Camera/CameraComponent.h"
#include "Engine/Canvas.h"
#include "Engine/DirectionalLight.h"
#include "Engine/PointLight.h"
#include "Engine/StaticMesh.h"
#include "Engine/World.h"
#include "Engine/Engine.h"
#include "InputCoreTypes.h"
#include "Misc/CoreDelegates.h"
#include "UObject/ConstructorHelpers.h"

IMPLEMENT_PRIMARY_GAME_MODULE(FDefaultGameModuleImpl,BlockCypher,"BlockCypher");

namespace {
FLinearColor FighterColor(int Id){return Id==0?FLinearColor(.12f,.75f,1):FLinearColor(1,.24f,.08f);}
FString Name(int Id){return Id==0?TEXT("VOLT"):TEXT("EMBER");}
const TCHAR* CueText(Cypher::Cue C){
    switch(C){
    case Cypher::Cue::Hit:return TEXT("HIT");
    case Cypher::Cue::Block:return TEXT("BLOCK +7");
    case Cypher::Cue::Perfect:return TEXT("PERFECT BLOCK +15");
    case Cypher::Cue::Dash:return TEXT("BACKDASH");
    case Cypher::Cue::Breakaway:return TEXT("BREAKAWAY -50");
    case Cypher::Cue::Tech:return TEXT("THROW ESCAPE");
    case Cypher::Cue::KO:return TEXT("KNOCKOUT");
    default:return TEXT("");
    }
}
void Tint(UStaticMeshComponent* Mesh,FLinearColor Color){
    auto* Material=LoadObject<UMaterialInterface>(nullptr,TEXT("/Engine/BasicShapes/BasicShapeMaterial.BasicShapeMaterial"));
    if(Material){auto* Dynamic=UMaterialInstanceDynamic::Create(Material,Mesh);Dynamic->SetVectorParameterValue(TEXT("Color"),Color);Mesh->SetMaterial(0,Dynamic);}
}
}
ACypherFighter::ACypherFighter(){
    RootComponent=CreateDefaultSubobject<USceneComponent>(TEXT("Root"));
    auto* Cube=LoadObject<UStaticMesh>(nullptr,TEXT("/Engine/BasicShapes/Cube.Cube"));
    auto* Sphere=LoadObject<UStaticMesh>(nullptr,TEXT("/Engine/BasicShapes/Sphere.Sphere"));
    const FVector Positions[]={FVector(0,0,105),FVector(0,0,165),FVector(-36,0,112),FVector(36,0,112),FVector(-18,0,43),FVector(18,0,43)};
    const FVector Sizes[]={FVector(.55,.38,.65),FVector(.32),FVector(.22,.24,.6),FVector(.22,.24,.6),FVector(.25,.3,.8),FVector(.25,.3,.8)};
    for(int I=0;I<6;++I){
        auto* P=CreateDefaultSubobject<UStaticMeshComponent>(*FString::Printf(TEXT("Body%d"),I));
        P->SetupAttachment(RootComponent);P->SetStaticMesh(I==1?Sphere:Cube);P->SetRelativeLocation(Positions[I]);P->SetRelativeScale3D(Sizes[I]);P->SetCollisionEnabled(ECollisionEnabled::NoCollision);Parts.Add(P);
    }
}
void ACypherFighter::SetColor(FLinearColor Color){for(const auto& P:Parts)Tint(P.Get(),Color);}
void ACypherFighter::Present(const Cypher::Fighter& F,float Time){
    SetActorLocation(FVector(F.x,0,F.z));
    const float Walk=(F.action==Cypher::Action::None&&!F.guard&&!F.stun)?FMath::Sin(Time*9)*8:0;
    Parts[0]->SetRelativeRotation(FRotator(F.stun?-F.face*18.f:0,0,0));
    for(int I=2;I<6;++I)Parts[I]->SetRelativeRotation(FRotator((I%2?1:-1)*Walk,0,0));
    if(F.guard){Parts[2]->SetRelativeRotation(FRotator(-60,0,0));Parts[3]->SetRelativeRotation(FRotator(60,0,0));}
    if(F.action!=Cypher::Action::None){
        const auto M=Cypher::Stats(F.action,F.character);
        const float P=FMath::Clamp(float(F.frame)/FMath::Max(1,M.startup),0.f,1.f);
        Parts[F.face==1?3:2]->SetRelativeRotation(FRotator(-F.face*P*85.f,0,0));
        if(F.action==Cypher::Action::Heavy)Parts[F.face==1?5:4]->SetRelativeRotation(FRotator(-F.face*P*75.f,0,0));
    }
    SetActorScale3D(F.hp==0?FVector(1,1,.45):F.duck?FVector(1,1,.7):FVector(1));
}
ACypherController::ACypherController(){bShowMouseCursor=true;bEnableTouchEvents=true;}
FBox2D ACypherHUD::ButtonRect(int32 I,float W,float H){
    const float S=FMath::Clamp(FMath::Min(W/12.f,H/6.f),44.f,82.f),G=8.f;
    const bool Left=I<3;const int J=Left?I:I-3;
    const float X=Left?18+J*(S+G):W-18-3*S-2*G+(J%3)*(S+G);
    const float Y=Left?H-S-20:H-20-S-(J/3)*(S+G);
    return FBox2D(FVector2D(X,Y),FVector2D(X+S,Y+S));
}
void ACypherController::PlayerTick(float Dt){
    Super::PlayerTick(Dt);
    auto* GM=GetWorld()->GetAuthGameMode<ACypherGameMode>();if(!GM)return;
    int32 W,H;GetViewportSize(W,H);
    bool Buttons[9]={};bool MenuActionTaken=false;
    for(int I=0;I<10;++I){
        float X=0,Y=0;bool Down=false;GetInputTouchState(static_cast<ETouchIndex::Type>(I),X,Y,Down);
        if(Down){
            if(!TouchWasDown[I]&&GM->Screen<2&&!MenuActionTaken){GM->ActivateMenu(X<W*.5?0:1);MenuActionTaken=true;}
            else if(GM->Screen==2){
                if(!TouchWasDown[I]&&Y<60&&X>W-100)GM->Paused=!GM->Paused;
                if(!TouchWasDown[I]&&(GM->Paused||GM->Match.finished)&&Y>H*.35&&Y<H*.6){if(GM->Match.finished)GM->ActivateMenu(0);else GM->Paused=false;}
                for(int B=0;B<9;++B)if(ACypherHUD::ButtonRect(B,W,H).IsInside(FVector2D(X,Y)))Buttons[B]=true;
            }
        }
        TouchWasDown[I]=Down;
    }
    if(GM->Screen<2){
        if(WasInputKeyJustPressed(EKeys::Enter)||WasInputKeyJustPressed(EKeys::One))GM->ActivateMenu(0);
        else if(WasInputKeyJustPressed(EKeys::Two))GM->ActivateMenu(1);
        else if(WasInputKeyJustPressed(EKeys::LeftMouseButton)){float X,Y;GetMousePosition(X,Y);GM->ActivateMenu(X<W*.5?0:1);}
        Controls={};return;
    }
    if(WasInputKeyJustPressed(EKeys::P)||WasInputKeyJustPressed(EKeys::Gamepad_Special_Right))GM->Paused=!GM->Paused;
    if(WasInputKeyJustPressed(EKeys::Escape)){GM->Screen=0;GM->Paused=false;Controls={};return;}
    if(GM->Match.finished&&(WasInputKeyJustPressed(EKeys::R)||WasInputKeyJustPressed(EKeys::Enter)))GM->ActivateMenu(0);
    Controls.left=Buttons[0]||IsInputKeyDown(EKeys::A)||IsInputKeyDown(EKeys::Gamepad_DPad_Left);
    Controls.right=Buttons[1]||IsInputKeyDown(EKeys::D)||IsInputKeyDown(EKeys::Gamepad_DPad_Right);
    Controls.duck=Buttons[2]||IsInputKeyDown(EKeys::S)||IsInputKeyDown(EKeys::Gamepad_DPad_Down);
    Controls.light=Buttons[3]||IsInputKeyDown(EKeys::J)||IsInputKeyDown(EKeys::Gamepad_FaceButton_Left);
    Controls.heavy=Buttons[4]||IsInputKeyDown(EKeys::K)||IsInputKeyDown(EKeys::Gamepad_FaceButton_Top);
    Controls.grab=Buttons[5]||IsInputKeyDown(EKeys::G)||IsInputKeyDown(EKeys::Gamepad_FaceButton_Right);
    Controls.jump=Buttons[6]||IsInputKeyDown(EKeys::W)||IsInputKeyDown(EKeys::Gamepad_FaceButton_Bottom);
    Controls.block=Buttons[7]||IsInputKeyDown(EKeys::L)||IsInputKeyDown(EKeys::Gamepad_LeftShoulder);
    Controls.special=Buttons[8]||IsInputKeyDown(EKeys::U)||IsInputKeyDown(EKeys::Gamepad_RightShoulder);
    if(GM->Paused)Controls={};
}
ACypherGameMode::ACypherGameMode(){
    PrimaryActorTick.bCanEverTick=true;DefaultPawnClass=nullptr;PlayerControllerClass=ACypherController::StaticClass();HUDClass=ACypherHUD::StaticClass();
}
void ACypherGameMode::StartPlay(){
    Super::StartPlay();BuildArena();
    auto* PC=GetWorld()->GetFirstPlayerController();
    if(PC){
        auto* Camera=GetWorld()->SpawnActor<ACameraActor>(FVector(0,-1550,380),FRotator(-9,90,0));
        Camera->GetCameraComponent()->SetFieldOfView(60);PC->SetViewTarget(Camera);
        AddTickPrerequisiteActor(PC);
    }
    for(int I=0;I<2;++I)Fighters.Add(GetWorld()->SpawnActor<ACypherFighter>());
    Match.Start(0);for(int I=0;I<2;++I)Fighters[I]->SetColor(FighterColor(I));
    FCoreDelegates::ApplicationWillEnterBackgroundDelegate.AddUObject(this,&ACypherGameMode::Background);
}
void ACypherGameMode::Background(){Paused=true;Accumulator=0;}
void ACypherGameMode::EndPlay(const EEndPlayReason::Type Reason){
    FCoreDelegates::ApplicationWillEnterBackgroundDelegate.RemoveAll(this);Super::EndPlay(Reason);
}
void ACypherGameMode::ActivateMenu(int32 Choice){
    if(Screen==0){Screen=1;return;}
    if(Screen==1){Match.Start(Choice==1?1:0);Screen=2;}
    else if(Match.finished){Match.Start(Match.fighters[0].character);}
    else return;
    Paused=false;Accumulator=0;Observations.fill(Match.fighters);
    for(int I=0;I<2;++I)Fighters[I]->SetColor(FighterColor(Match.fighters[I].character));
}
void ACypherGameMode::BuildArena(){
    auto* Cube=LoadObject<UStaticMesh>(nullptr,TEXT("/Engine/BasicShapes/Cube.Cube"));
    auto Add=[&](FVector Position,FVector Scale,FLinearColor Color){
        auto* A=GetWorld()->SpawnActor<AActor>();auto* M=NewObject<UStaticMeshComponent>(A);
        A->SetRootComponent(M);A->AddInstanceComponent(M);M->SetStaticMesh(Cube);M->SetCollisionEnabled(ECollisionEnabled::NoCollision);M->RegisterComponent();A->SetActorLocation(Position);M->SetWorldScale3D(Scale);Tint(M,Color);return M;
    };
    Add(FVector(0,0,-22),FVector(16,8,.4),FLinearColor(.08,.1,.12));
    for(int I=-3;I<=3;++I){
        Add(FVector(I*240,500,180),FVector(1.8,1.5,3.6),FLinearColor(.16,.19,.24));
        Add(FVector(I*240,410,260),FVector(.9,.05,.16),FLinearColor(.75,.3,.08));
    }
    Add(FVector(0,335,280),FVector(15,.25,.2),FLinearColor(.36,.23,.1));
    for(int I=-4;I<=4;++I)Add(FVector(I*180,335,130),FVector(.1,.18,2.8),FLinearColor(.3,.2,.12));
    Add(FVector(0,335,400),FVector(15,.2,.12),FLinearColor(.38,.26,.13));
    GetWorld()->SpawnActor<ADirectionalLight>(FVector(0,-500,600),FRotator(-50,-35,0));
    for(int I=0;I<8;++I){
        auto* Mesh=Add(FVector(0,0,-1000),FVector(.3),FighterColor(I%2));Mesh->SetVisibility(false);ProjectileMeshes.Add(Mesh);
    }
}
void ACypherGameMode::Tick(float Dt){
    Super::Tick(Dt);auto* PC=Cast<ACypherController>(GetWorld()->GetFirstPlayerController());
    if(Screen==2&&!Paused&&PC){
        Accumulator=FMath::Min(Accumulator+Dt,.1f);
        int Steps=0;
        while(Accumulator>=1.f/60.f&&Steps++<6){
            const auto Seen=Observations[Match.tick%12];
            Cypher::Input CPU;const auto& F=Seen[1];const auto& T=Seen[0];const float Distance=std::abs(F.x-T.x);
            if(Match.tick%40==0){CPU.light=Distance<140;CPU.heavy=Distance<175&&!CPU.light;CPU.special=Distance>220;}
            CPU.block=T.action!=Cypher::Action::None&&Distance<190;CPU.grab=Match.tick%113==0&&Distance<90&&T.guard;
            if(!CPU.block&&F.action==Cypher::Action::None){CPU.left=F.x>T.x&&Distance>130;CPU.right=F.x<T.x&&Distance>130;}
            Observations[Match.tick%12]=Match.fighters;
            Match.Step({PC->Controls,CPU});Accumulator-=1.f/60.f;
        }
    }else Accumulator=0;
    for(int I=0;I<Fighters.Num();++I)Fighters[I]->Present(Match.fighters[I],Match.tick/60.f);
    for(int I=0;I<ProjectileMeshes.Num();++I){
        UStaticMeshComponent* Mesh=ProjectileMeshes[I];const bool Visible=I<static_cast<int>(Match.projectiles.size());Mesh->SetVisibility(Visible);
        if(Visible){const auto& P=Match.projectiles[I];Mesh->SetWorldLocation(FVector(P.x,0,P.z));}
    }
}
void ACypherHUD::DrawHUD(){
    Super::DrawHUD();if(!Canvas)return;
    auto* GM=GetWorld()->GetAuthGameMode<ACypherGameMode>();if(!GM)return;
    const float W=Canvas->SizeX,H=Canvas->SizeY,Scale=FMath::Clamp(W/1000.f,.75f,1.4f);
    auto Text=[&](const FString& S,float X,float Y,FLinearColor C=FLinearColor::White,float Size=1.f){DrawText(S,C,X,Y,GEngine->GetMediumFont(),Scale*Size);};
    auto Panel=[&](float X,float Y,float Width,float Height){DrawRect(FLinearColor(.025,.04,.07,.9),X,Y,Width,Height);};
    if(GM->Screen<2){
        Panel(W*.1,H*.12,W*.8,H*.7);Text(TEXT("BLOCK CYPHER"),W*.15,H*.18,FLinearColor(1,.75,.3),2);
        Text(TEXT("CLEVELAND / 2.5D PROTOTYPE"),W*.15,H*.3);
        Text(GM->Screen==0?TEXT("TAP TO ENTER / ENTER"):TEXT("CHOOSE YOUR FIGHTER"),W*.15,H*.43);
        if(GM->Screen==1){Text(TEXT("1 / VOLT"),W*.2,H*.58,FighterColor(0),1.5);Text(TEXT("2 / EMBER"),W*.6,H*.58,FighterColor(1),1.5);}
        return;
    }
    const auto& Match=GM->Match;
    for(int I=0;I<2;++I){
        const auto& F=Match.fighters[I];const float X=I==0?20:W*.6;
        Panel(X,15,W*.36,88);Text(Name(F.character),X+8,19,FighterColor(F.character));
        DrawRect(FLinearColor(.15,.12,.12),X+8,49,W*.34,12);
        DrawRect(FighterColor(F.character),X+8,49,W*.34*F.hp/100.f,12);
        DrawRect(FLinearColor(.9,.7,.25),X+8,68,W*.34*F.meter/100.f,5);
        Text(FString::Printf(TEXT("WINS %d / 2     METER %d"),Match.wins[I],F.meter),X+8,77);
        if(F.cueFrames>0)Text(CueText(F.cue),X+8,110,FLinearColor(.65,1,1));
        if(F.combo>1&&F.comboTimer>0)Text(FString::Printf(TEXT("%d HIT COMBO"),F.combo),X+8,135);
    }
    Text(FString::Printf(TEXT("%02d"),FMath::Max(0,(Match.remaining+59)/60)),W*.47,20,FLinearColor(1,.9,.65),1.5);
    Text(TEXT("PAUSE / P"),W-105,2,FLinearColor::White,.75);
    const TCHAR* Labels[]={TEXT("LEFT"),TEXT("RIGHT"),TEXT("DUCK"),TEXT("X LIGHT"),TEXT("Y HEAVY"),TEXT("B THROW"),TEXT("A JUMP"),TEXT("LB BLOCK"),TEXT("RB POWER")};
    for(int I=0;I<9;++I){const FBox2D R=ButtonRect(I,W,H);Panel(R.Min.X,R.Min.Y,R.GetSize().X,R.GetSize().Y);Text(Labels[I],R.Min.X+4,R.Min.Y+R.GetSize().Y*.35,FLinearColor::White,.7);}
    if(GM->Paused||Match.finished||Match.roundWait>0){
        Panel(W*.18,H*.32,W*.64,H*.25);
        Text(GM->Paused?TEXT("PAUSED / TAP HERE TO RESUME"):Match.finished?TEXT("MATCH COMPLETE / TAP HERE OR R TO REMATCH"):TEXT("ROUND COMPLETE"),W*.22,H*.37,FLinearColor(1,.8,.4));
        Text(TEXT("ESC: TITLE   |   FIRST TO TWO ROUNDS"),W*.22,H*.46,FLinearColor::White,.8);
    }
}
