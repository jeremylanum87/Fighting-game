"""Run from Unreal Editor Python after compiling the C++ project.
Creates the cooked map; runtime C++ supplies the arena and actors.
"""
import unreal

MAP = "/Game/Maps/ClevelandPrototype"
if unreal.EditorAssetLibrary.does_asset_exist(MAP):
    unreal.log("Existing map kept: " + MAP)
else:
    unreal.EditorAssetLibrary.make_directory("/Game/Maps")
    levels = unreal.get_editor_subsystem(unreal.LevelEditorSubsystem)
    if not levels.new_level(MAP):
        raise RuntimeError("Could not create " + MAP)
    if not levels.save_current_level():
        raise RuntimeError("Could not save " + MAP)
    unreal.log("Created " + MAP + ". Press Play to run the prototype.")
