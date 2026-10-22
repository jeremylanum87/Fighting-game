using UnrealBuildTool;
public class BlockCypher : ModuleRules
{
    public BlockCypher(ReadOnlyTargetRules Target) : base(Target)
    {
        PCHUsage = PCHUsageMode.UseExplicitOrSharedPCHs;
        PublicDependencyModuleNames.AddRange(new string[] {"Core","CoreUObject","Engine","InputCore"});
    }
}
