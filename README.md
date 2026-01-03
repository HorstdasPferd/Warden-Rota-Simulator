# Warden Rota Planner — Guide & Legend

A visual tool for planning and testing Warden skill rotations in LOTRO. Build your rotation, test gambit sequences, and simulate playback with real-time cooldown tracking.

## Overview

The planner provides:
- Palette of basic skills and masteries
- Drag-and-drop timeline builder
- Playback with cooldown tracking and visual feedback
- Gambit tester with live recognition and duration display
- Character configuration (traits and traceries)
- Import/Export and presets

## Basic Skills

- 1 — Spear (0.5s cast)
- 2 — Shield (0.5s cast)
- 3 — Fist (0.5s cast)
- 4 — Execute (0.8s cast, triggers the gambit)

## Timeline Builder

How to use:
- Drag skills or masteries from the palette onto timeline slots
- Build gambits with 1/2/3, then trigger using 4 (Execute)
- Use masteries as shortcuts (e.g., “12” = Spear + Shield)
- Timeline auto-expands as you fill it (up to 200 slots, let me know if you need more)

Controls:
- Play — Start execution from the beginning
- Pause — Pause execution at current position
- Stop — Stop and reset to the beginning
- Clear — Delete the entire timeline
- Undo — Remove the last added item
- Reverse — Restore the previous timeline state

## Gambit Tester

Features:
- Live preview of the resulting gambit as you build
- Duration display for buffs/DoTs/HoTs
- Wiki link for quick reference
- Back/Clear controls to refine inputs

Limitations:
- Basic skills: max 5 inputs (e.g., 1-2-3-1-2)
- Masteries: max 3 inputs (e.g., 12-23-31)
- Combined: respects the rules above

## Playback System

Visual feedback:

| Status | Meaning |
|---|---|
| ✓ Green | Skill/Gambit executed successfully |
| ✗ Red | Failed — mastery on cooldown |
| Timer | Shows total rotation time (MM:SS.s) |

Mastery cooldowns:
- Adjustable via slider (default cooldown time)
- Overlay shows remaining cooldown on palette items
- Countdown updates in real-time during playback
- Timeline slot shows a red border if used during cooldown

## Character Configuration

Traits (examples):
- Blue Line: +10s Shield buffs
- Yellow Line: +10s Fist buffs
- Red Line: +5s Bleed DoTs

Traceries (examples):
- Shield Buff: +11s
- Shield Tactics: +11s
- Gambit Debuff: +11s
- Fist DoT: +8s
- Spear DoT: +8s

Note:
- Settings are saved automatically and affect both the Gambit Tester and Active Effects.

## Import/Export & Presets

Save your work:
- Export: Save the timeline as a `.txt` file
- Import: Load a previously saved timeline
- Presets: Quick-load common rotations

Default presets:
- Blue (Tank): Defensive rotation with War-cry opener and Restoration chain
- Red (DPS): Offensive rotation with Offensive Strike and Brink of Victory

Custom presets:
- Save Preset: Store the current timeline with a custom name
- Load Preset: Select and load any saved preset
- Delete Preset: Remove custom presets (defaults protected)

Warning:
- Custom presets are stored in browser localStorage; clearing browser data will delete them.

## Mobile Support

- Toggle buttons show/hide sections on smaller screens
- Timeline Toggle — show/hide timeline builder
- Tester Toggle — show/hide gambit tester
- Tip: Use portrait for palette access and landscape for timeline view

## Known Limitations

- Maximum 200 timeline slots
- Gambit tester input caps as described above
- No validation for actual in-game availability
- Cooldowns are visual approximations only
- Does not account for haste, lag, animation or reaction time (let me know how you would fix this)

## FAQ

Q: Why did my mastery turn red?  
A: It’s still on cooldown. Check the palette overlay or increase cooldown via the slider.

Q: How do I know which gambit I built?  
A: Timeline Preview shows current build and executed gambits with icons during playback.

Q: Can I reorder skills in the timeline?  
A: Not directly. Use Undo/Reverse or export, edit, and re-import.

Q: Why isn’t my custom preset showing?  
A: Ensure you saved it with a unique name and localStorage is enabled.

Q: What’s the difference between Undo and Reverse?  
A: Undo removes the last item, Reverse restores the entire previous state.

## Best Practices

- Use masteries to speed up gambit creation
- Save presets for common rotations to iterate faster
- Monitor cooldown overlays to avoid failed masteries
- Use the tester for quick duration checks before adding to the timeline

## ToDO

- Add DE-Language Support
- Maybe add other Languages (need volunteers for that)
- maybe add Base-DPS-Calculation
- make a proper Trait-Tree selectable/save-able/Preset etc

