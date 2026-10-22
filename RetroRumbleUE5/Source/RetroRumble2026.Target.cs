using UnrealBuildTool;
using System.Collections.Generic;
public class RetroRumble2026Target : TargetRules
{
    public RetroRumble2026Target(TargetInfo Target) : base(Target)
    {
        Type = TargetType.Game;
        DefaultBuildSettings = BuildSettingsVersion.V5;
        ExtraModuleNames.Add("RetroRumble2026");
    }
}