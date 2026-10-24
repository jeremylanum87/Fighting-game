#pragma once
#include "CoreMinimal.h"
#include "GameFramework/PlayerController.h"
#include "RRFighter.h"
#include "RRPlayerController.generated.h"

UCLASS()
class ARRPlayerController : public APlayerController
{
    GENERATED_BODY()
public:
    virtual void SetupInputComponent() override;
    UFUNCTION(BlueprintCallable) void MobileMove(float Axis);
    UFUNCTION(BlueprintCallable) void MobileJump();
    UFUNCTION(BlueprintCallable) void MobileBlock(bool bHeld);
    UFUNCTION(BlueprintCallable) void MobileAttack(ERRAttack Attack);
    UFUNCTION(BlueprintPure) ARRFighter* ControlledFighter() const;
    UPROPERTY(EditAnywhere, BlueprintReadWrite) TSubclassOf<class UUserWidget> MobileHUDClass;
protected:
    virtual void BeginPlay() override;
private:
    void LeftPressed(); void RightPressed(); void StopMoving();
    void LightPunch(); void MediumPunch(); void HeavyPunch();
    void LightKick(); void MediumKick(); void HeavyKick();
    void Special(); void SuperMove(); void BlockPressed(); void BlockReleased();
    float MovementAxis = 0.f;
};