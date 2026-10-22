#include "RRPlayerController.h"
#include "Blueprint/UserWidget.h"
#include "Components/InputComponent.h"
void ARRPlayerController::BeginPlay()
{
    Super::BeginPlay();
    bShowMouseCursor = true;
    if (MobileHUDClass)
    {
        UUserWidget* HUD = CreateWidget<UUserWidget>(this, MobileHUDClass);
        if (HUD) HUD->AddToViewport();
    }
}
ARRFighter* ARRPlayerController::ControlledFighter() const { return Cast<ARRFighter>(GetPawn()); }
void ARRPlayerController::MobileMove(float Axis)
{
    MovementAxis = FMath::Clamp(Axis,-1.f,1.f);
    if (ARRFighter* F=ControlledFighter()) F->MoveHorizontal(MovementAxis);
}
void ARRPlayerController::MobileJump() { if (ARRFighter* F=ControlledFighter()) F->JumpFighter(); }
void ARRPlayerController::MobileBlock(bool bHeld) { if (ARRFighter* F=ControlledFighter()) F->SetBlocking(bHeld); }
void ARRPlayerController::MobileAttack(ERRAttack Attack) { if (ARRFighter* F=ControlledFighter()) F->PerformAttack(Attack); }
void ARRPlayerController::LeftPressed(){MobileMove(-1);}
void ARRPlayerController::RightPressed(){MobileMove(1);}
void ARRPlayerController::StopMoving(){MobileMove(0);}
void ARRPlayerController::LightPunch(){MobileAttack(ERRAttack::LightPunch);}
void ARRPlayerController::MediumPunch(){MobileAttack(ERRAttack::MediumPunch);}
void ARRPlayerController::HeavyPunch(){MobileAttack(ERRAttack::HeavyPunch);}
void ARRPlayerController::LightKick(){MobileAttack(ERRAttack::LightKick);}
void ARRPlayerController::MediumKick(){MobileAttack(ERRAttack::MediumKick);}
void ARRPlayerController::HeavyKick(){MobileAttack(ERRAttack::HeavyKick);}
void ARRPlayerController::Special(){MobileAttack(ERRAttack::Special);}
void ARRPlayerController::SuperMove(){MobileAttack(ERRAttack::Super);}
void ARRPlayerController::BlockPressed(){MobileBlock(true);}
void ARRPlayerController::BlockReleased(){MobileBlock(false);}
void ARRPlayerController::SetupInputComponent()
{
    Super::SetupInputComponent();
    InputComponent->BindAction("Left",IE_Pressed,this,&ARRPlayerController::LeftPressed);
    InputComponent->BindAction("Right",IE_Pressed,this,&ARRPlayerController::RightPressed);
    InputComponent->BindAction("Left",IE_Released,this,&ARRPlayerController::StopMoving);
    InputComponent->BindAction("Right",IE_Released,this,&ARRPlayerController::StopMoving);
    InputComponent->BindAction("Jump",IE_Pressed,this,&ARRPlayerController::MobileJump);
    InputComponent->BindAction("Block",IE_Pressed,this,&ARRPlayerController::BlockPressed);
    InputComponent->BindAction("Block",IE_Released,this,&ARRPlayerController::BlockReleased);
    InputComponent->BindAction("LP",IE_Pressed,this,&ARRPlayerController::LightPunch);
    InputComponent->BindAction("MP",IE_Pressed,this,&ARRPlayerController::MediumPunch);
    InputComponent->BindAction("HP",IE_Pressed,this,&ARRPlayerController::HeavyPunch);
    InputComponent->BindAction("LK",IE_Pressed,this,&ARRPlayerController::LightKick);
    InputComponent->BindAction("MK",IE_Pressed,this,&ARRPlayerController::MediumKick);
    InputComponent->BindAction("HK",IE_Pressed,this,&ARRPlayerController::HeavyKick);
    InputComponent->BindAction("Special",IE_Pressed,this,&ARRPlayerController::Special);
    InputComponent->BindAction("Super",IE_Pressed,this,&ARRPlayerController::SuperMove);
}