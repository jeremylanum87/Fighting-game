#include "RRFighter.h"
#include "GameFramework/CharacterMovementComponent.h"
#include "Kismet/KismetMathLibrary.h"

ARRFighter::ARRFighter()
{
    PrimaryActorTick.bCanEverTick = true;
    GetCharacterMovement()->bConstrainToPlane = true;
    GetCharacterMovement()->SetPlaneConstraintNormal(FVector(1, 0, 0));
    GetCharacterMovement()->MaxWalkSpeed = 560.f;
    GetCharacterMovement()->JumpZVelocity = 780.f;
    GetCharacterMovement()->AirControl = .55f;
}
void ARRFighter::BeginPlay() { Super::BeginPlay(); ResetRound(); }
void ARRFighter::Tick(float Dt)
{
    Super::Tick(Dt);
    bAirborne = GetCharacterMovement()->IsFalling();
    if (ComboWindow > 0.f) { ComboWindow -= Dt; if (ComboWindow <= 0.f) ComboCount = 0; }
    if (RecoveryAt >= 0.f)
    {
        AttackClock += Dt;
        if (!bHitResolved && AttackClock >= ActiveAt)
        {
            bHitResolved = true;
            if (IsValid(Opponent) && !Opponent->bKnockedOut)
            {
                const float Distance = FVector::Dist2D(GetActorLocation(), Opponent->GetActorLocation());
                if (Distance <= PendingMove.Range && FMath::Abs(GetActorLocation().Z - Opponent->GetActorLocation().Z) < 155.f)
                {
                    Opponent->ReceiveHit(PendingMove.Damage, PendingMove.LaunchForce, this);
                }
            }
        }
        if (AttackClock >= RecoveryAt) { RecoveryAt = -1.f; ActiveAt = -1.f; }
    }
    if (IsValid(Opponent))
    {
        const FVector Direction = Opponent->GetActorLocation() - GetActorLocation();
        if (!Direction.IsNearlyZero()) SetActorRotation(FRotator(0.f, Direction.Y >= 0.f ? 90.f : -90.f, 0.f));
    }
}
void ARRFighter::MoveHorizontal(float Value)
{
    if (!bKnockedOut && !bBlocking && RecoveryAt < 0.f) AddMovementInput(FVector(0, 1, 0), FMath::Clamp(Value, -1.f, 1.f));
}
void ARRFighter::JumpFighter() { if (!bKnockedOut && !bBlocking && RecoveryAt < 0.f) Jump(); }
void ARRFighter::SetBlocking(bool bNewBlocking) { if (!bKnockedOut) bBlocking = bNewBlocking && RecoveryAt < 0.f; }
FRRMove ARRFighter::MoveFor(ERRAttack Attack) const
{
    FRRMove M;
    switch (Attack)
    {
    case ERRAttack::LightPunch: M = { }; M.Damage=30; M.Startup=.07f; M.Recovery=.19f; M.Range=120; break;
    case ERRAttack::MediumPunch: M.Damage=55; M.Startup=.11f; M.Recovery=.29f; M.Range=145; break;
    case ERRAttack::HeavyPunch: M.Damage=90; M.Startup=.18f; M.Recovery=.43f; M.Range=170; M.LaunchForce=210; break;
    case ERRAttack::LightKick: M.Damage=35; M.Startup=.09f; M.Recovery=.23f; M.Range=150; break;
    case ERRAttack::MediumKick: M.Damage=60; M.Startup=.13f; M.Recovery=.33f; M.Range=190; break;
    case ERRAttack::HeavyKick: M.Damage=95; M.Startup=.21f; M.Recovery=.49f; M.Range=220; M.LaunchForce=360; break;
    case ERRAttack::Special:
        M.Damage=FighterId==ERRFighterId::King ? 125 : 105;
        M.Range=FighterId==ERRFighterId::King ? 190 : 260;
        M.Startup=.17f; M.Recovery=.55f; M.LaunchForce=400; M.MeterGain=14; break;
    case ERRAttack::Super:
        M.Damage=FighterId==ERRFighterId::King ? 290 : 265;
        M.Range=290; M.Startup=.16f; M.Recovery=.8f; M.LaunchForce=600; M.MeterCost=100; M.MeterGain=0; break;
    }
    if (FighterId==ERRFighterId::Voltage && Attack!=ERRAttack::Super) { M.Startup*=.85f; M.Damage*=.90f; }
    return M;
}
bool ARRFighter::PerformAttack(ERRAttack Attack)
{
    if (bKnockedOut || RecoveryAt >= 0.f || bBlocking) return false;
    FRRMove M = MoveFor(Attack);
    if (Meter < M.MeterCost) return false;
    Meter = FMath::Clamp(Meter-M.MeterCost+M.MeterGain,0.f,100.f);
    PendingMove=M; AttackClock=0.f; ActiveAt=M.Startup; RecoveryAt=M.Startup+M.Recovery; bHitResolved=false;
    OnAttackStarted(Attack);
    return true;
}
void ARRFighter::ReceiveHit(float Damage, float LaunchForce, ARRFighter* Attacker)
{
    if (bKnockedOut) return;
    const bool bGuarded = bBlocking && !bAirborne;
    const float Applied = bGuarded ? Damage*.15f : Damage;
    Health=FMath::Max(0.f,Health-Applied);
    Meter=FMath::Clamp(Meter+(bGuarded?3.f:7.f),0.f,100.f);
    if (!bGuarded && LaunchForce>0.f) LaunchCharacter(FVector(0,0,LaunchForce),false,true);
    if (IsValid(Attacker) && !bGuarded)
    {
        if (Attacker->ComboWindow>0.f) Attacker->ComboCount++; else Attacker->ComboCount=1;
        Attacker->ComboWindow=1.25f;
    }
    OnHitReceived(Applied,bGuarded);
    if (Health<=0.f) { bKnockedOut=true; OnKnockout(); }
}
void ARRFighter::ResetRound()
{
    Health=1000.f; Meter=0.f; ComboCount=0; ComboWindow=0.f; bKnockedOut=false; bBlocking=false;
    AttackClock=0.f; ActiveAt=-1.f; RecoveryAt=-1.f; bHitResolved=false;
}