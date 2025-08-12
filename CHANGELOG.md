# Change Log

## [0.1.0] - August 2025

New emotions added with expanded mood classification system.

### New Mood Categories
- 😍 Euphoric (98-100 points) - Absolutely flawless code - a masterpiece!
- 🥳 Ecstatic (90-97 points) - Exceptional code quality - celebration time!
- 😌 Proud (80-89 points) - Really solid code - you should be proud
- 😊 Happy (70-79 points) - Good code quality - things are going well
- 😌 Content (60-69 points) - Decent code with minor room for improvement
- 😐 Neutral (50-59 points) - Average code quality - could use some attention
- 🤔 Thoughtful (40-49 points) - Code needs some thinking and refactoring
- 😟 Concerned (30-39 points) - Several issues detected - needs attention
- 😰 Anxious (20-29 points) - Multiple problems causing anxiety - time to debug
- 😢 Sad (15-19 points) - Many issues detected - code needs serious help
- 😤 Frustrated (10-14 points) - Frustrating errors everywhere - deep debugging needed
- 😭 Devastated (5-9 points) - Critical issues everywhere - major refactoring required
- 😱 Panicked (0-4 points) - Code is in complete chaos - emergency intervention needed!

### Technical Improvements
- Enhanced mood calculation algorithm with finer granularity
- More precise emotional feedback based on code quality
- Better user experience with detailed mood descriptions

## [0.0.2] - August 2025

Image logo updated.

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