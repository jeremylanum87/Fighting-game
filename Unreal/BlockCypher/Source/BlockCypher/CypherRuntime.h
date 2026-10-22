#pragma once
#include "CoreMinimal.h"
#include "GameFramework/GameModeBase.h"
#include "GameFramework/PlayerController.h"
#include "GameFramework/HUD.h"
#include "GameFramework/Actor.h"
#include "CombatCore.h"
#include "CypherRuntime.generated.h"

class UStaticMeshComponent;
UCLASS()
class BLOCKCYPHER_API ACypherFighter : public AActor
{
    GENERATED_BODY()
public:
    ACypherFighter();
    void Present(const Cypher::Fighter& Fighter,float Time);
    void SetColor(FLinearColor Color);
private:
    UPROPERTY() TArray<TObjectPtr<UStaticMeshComponent>> Parts;
};
UCLASS()
class BLOCKCYPHER_API ACypherController : public APlayerController
{
    GENERATED_BODY()
public:
    ACypherController();
    virtual void PlayerTick(float DeltaTime) override;
    Cypher::Input Controls;
    bool TouchWasDown[10]={};
};
UCLASS()
class BLOCKCYPHER_API ACypherHUD : public AHUD
{
    GENERATED_BODY()
public:
    virtual void DrawHUD() override;
    static FBox2D ButtonRect(int32 Index,float W,float H);
};
UCLASS()
class BLOCKCYPHER_API ACypherGameMode : public AGameModeBase
{
    GENERATED_BODY()
public:
    ACypherGameMode();
    virtual void StartPlay() override;
    virtual void Tick(float DeltaTime) override;
    virtual void EndPlay(const EEndPlayReason::Type Reason) override;
    void ActivateMenu(int32 Choice);
    void Background();
    Cypher::Match Match;
    int32 Screen=0; // title, fighter choice, match
    bool Paused=false;
    float Accumulator=0;
private:
    UPROPERTY() TArray<TObjectPtr<ACypherFighter>> Fighters;
    UPROPERTY() TArray<TObjectPtr<UStaticMeshComponent>> ProjectileMeshes;
    std::array<std::array<Cypher::Fighter,2>,12> Observations{};
    void BuildArena();
};
