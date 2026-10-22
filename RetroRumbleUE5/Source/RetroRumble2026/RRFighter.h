#pragma once
#include "CoreMinimal.h"
#include "GameFramework/Character.h"
#include "RRFighter.generated.h"

UENUM(BlueprintType)
enum class ERRFighterId : uint8 { King, Voltage };
UENUM(BlueprintType)
enum class ERRAttack : uint8 { LightPunch, MediumPunch, HeavyPunch, LightKick, MediumKick, HeavyKick, Special, Super };

USTRUCT(BlueprintType)
struct FRRMove
{
    GENERATED_BODY()
    UPROPERTY(EditAnywhere, BlueprintReadWrite) float Damage = 40.f;
    UPROPERTY(EditAnywhere, BlueprintReadWrite) float Range = 135.f;
    UPROPERTY(EditAnywhere, BlueprintReadWrite) float Startup = .10f;
    UPROPERTY(EditAnywhere, BlueprintReadWrite) float Recovery = .25f;
    UPROPERTY(EditAnywhere, BlueprintReadWrite) float MeterGain = 8.f;
    UPROPERTY(EditAnywhere, BlueprintReadWrite) float MeterCost = 0.f;
    UPROPERTY(EditAnywhere, BlueprintReadWrite) float LaunchForce = 0.f;
};

UCLASS(Blueprintable)
class ARRFighter : public ACharacter
{
    GENERATED_BODY()
public:
    ARRFighter();
    virtual void Tick(float DeltaSeconds) override;
    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category="Retro Rumble") ERRFighterId FighterId = ERRFighterId::King;
    UPROPERTY(BlueprintReadOnly, Category="Retro Rumble") float Health = 1000.f;
    UPROPERTY(BlueprintReadOnly, Category="Retro Rumble") float Meter = 0.f;
    UPROPERTY(BlueprintReadOnly, Category="Retro Rumble") int32 ComboCount = 0;
    UPROPERTY(BlueprintReadOnly, Category="Retro Rumble") bool bKnockedOut = false;
    UPROPERTY(BlueprintReadOnly, Category="Retro Rumble") bool bBlocking = false;
    UPROPERTY(BlueprintReadOnly, Category="Retro Rumble") bool bAirborne = false;
    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category="Retro Rumble") ARRFighter* Opponent = nullptr;
    UFUNCTION(BlueprintCallable) void MoveHorizontal(float Value);
    UFUNCTION(BlueprintCallable) void JumpFighter();
    UFUNCTION(BlueprintCallable) void SetBlocking(bool bNewBlocking);
    UFUNCTION(BlueprintCallable) bool PerformAttack(ERRAttack Attack);
    UFUNCTION(BlueprintCallable) void ReceiveHit(float Damage, float LaunchForce, ARRFighter* Attacker);
    UFUNCTION(BlueprintCallable) void ResetRound();
    UFUNCTION(BlueprintPure) float HealthPercent() const { return Health / 1000.f; }
    UFUNCTION(BlueprintPure) float MeterPercent() const { return Meter / 100.f; }
    UFUNCTION(BlueprintImplementableEvent) void OnAttackStarted(ERRAttack Attack);
    UFUNCTION(BlueprintImplementableEvent) void OnHitReceived(float AppliedDamage, bool bWasBlocked);
    UFUNCTION(BlueprintImplementableEvent) void OnKnockout();
protected:
    virtual void BeginPlay() override;
private:
    float AttackClock = 0.f;
    float ActiveAt = -1.f;
    float RecoveryAt = -1.f;
    float ComboWindow = 0.f;
    FRRMove PendingMove;
    bool bHitResolved = false;
    FRRMove MoveFor(ERRAttack Attack) const;
};