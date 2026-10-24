# Clean arcade title menu

The title screen has three main actions: Fight, Watch / CPU vs CPU, and Training. Arcade, Story, Survival, Rival Set, Cleveland Crew, Featured Fight and Continue Arcade are grouped under More Modes. The shop, records, lore, challenges, mastery, endings, tutorial, install, Phone Check and instructions are in Extras. All existing action IDs and handlers are preserved.

A single animated fighter remains beside the actions. The background is dimmer; the ticker and repeated slogans are hidden. Sound and Settings sit in the upper corner. Each expanded menu has a close button, only one opens at a time, and controller navigation stays in the open menu. Settings returns focus to its title-screen button.

Browser checks passed at desktop 1280 × 800, Android-style landscape 844 × 390 and 667 × 375, and portrait 390 × 844. All three main actions fit in the viewport with at least 44-pixel touch height and no horizontal overflow. Checks exercised More Modes, Extras, Settings focus return, and navigation into Fight, CPU showcase and Training. Offline and combat regression checks passed. Physical-device ergonomics remain unmeasured.
