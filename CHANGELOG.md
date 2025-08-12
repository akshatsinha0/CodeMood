# Change Log

## [0.0.1] - August 2025

Initial release of CodeMood extension.

### Features Added
- Real-time code mood analysis based on errors and warnings
- Support for 15 programming languages including JavaScript, TypeScript, Python, Java, C#, Rust, Go, and more
- Emoji-based visual feedback showing code quality status
- Smart scoring algorithm that considers error severity, file size, and language-specific factors
- Performance optimized with intelligent caching and debouncing
- Command palette integration with keyboard shortcuts

### Mood Categories
- 🤩 Ecstatic (90-100 points) - Perfect code quality
- 😊 Happy (70-89 points) - Good code quality  
- 😐 Neutral (50-69 points) - Average code quality
- 😟 Concerned (30-49 points) - Some issues detected
- 😢 Sad (10-29 points) - Many problems found
- 😭 Devastated (0-9 points) - Critical issues need attention

### Commands
- `CodeMood: Show Mood Panel` - Display the mood panel
- `CodeMood: Hide Mood Panel` - Hide the mood panel
- `CodeMood: Toggle Mood Panel` - Toggle panel visibility (Ctrl+Shift+M)
- `CodeMood: Refresh Current Mood` - Force refresh current analysis

### Technical Details
- Built with TypeScript and webpack
- Uses VS Code's diagnostic API for error detection
- Online emoji loading with offline fallbacks
- Comprehensive error handling and logging
- Memory efficient with automatic cache cleanup