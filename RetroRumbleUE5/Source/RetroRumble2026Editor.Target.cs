using UnrealBuildTool;
using System.Collections.Generic;
public class RetroRumble2026EditorTarget : TargetRules
{
    public RetroRumble2026EditorTarget(TargetInfo Target) : base(Target)
    {
        Type = TargetType.Editor;
        DefaultBuildSettings = BuildSettingsVersion.V5;
        ExtraModuleNames.Add("RetroRumble2026");
    }
}