# CodeMood - Visual Code Quality Feedback

CodeMood is a VS Code extension that provides real-time visual feedback about your code quality through emoji-based facial expressions. Get instant insights into your code's "mood" based on errors, warnings, and other quality indicators.

## Features

- **Real-time Mood Analysis**: See your code's mood update as you type
- **Emoji-based Feedback**: Intuitive facial expressions from 😭 (critical issues) to 🤩 (perfect code)
- **Multi-language Support**: Works with JavaScript, TypeScript, Python, Java, C#, Rust, Go, YAML, and more
- **Smart Scoring**: Advanced algorithm considers error severity, file size, and language-specific factors
- **Performance Optimized**: Intelligent caching and debouncing for smooth experience
- **Command Palette Integration**: Easy access through VS Code commands

## How It Works

CodeMood analyzes your code using VS Code's diagnostic system and calculates a mood score based on:

- **Errors**: Heavy penalty (-15 points each)
- **Warnings**: Medium penalty (-5 points each)  
- **Info messages**: Light penalty (-1 point each)
- **File size**: Slight penalty for very large files
- **Language bonuses**: Extra points for clean code in strict languages like TypeScript and Rust

## Mood Categories

- 🤩 **Ecstatic** (90-100): Perfect code quality
- 😊 **Happy** (70-89): Good code quality
- 😐 **Neutral** (50-69): Average code quality
- 😟 **Concerned** (30-49): Some issues detected
- 😢 **Sad** (10-29): Many problems found
- 😭 **Devastated** (0-9): Critical issues need attention

## Usage

1. Install the extension
2. Open a supported code file
3. Use `Ctrl+Shift+M` (or `Cmd+Shift+M` on Mac) to toggle the mood panel
4. Or use Command Palette: `CodeMood: Show Mood Panel`

The mood panel will display:
- Current file's mood emoji
- Numerical score (0-100)
- Breakdown of errors, warnings, and info messages
- Helpful description of the current mood

## Supported Languages

- JavaScript (.js, .mjs, .cjs)
- TypeScript (.ts, .mts, .cts)
- React (.jsx, .tsx)
- Python (.py, .pyw, .pyi)
- Java (.java)
- C# (.cs, .csx)
- C/C++ (.c, .cpp, .h, .hpp)
- Rust (.rs)
- Go (.go)
- PHP (.php)
- Ruby (.rb)
- Swift (.swift)
- Kotlin (.kt, .kts)
- YAML (.yaml, .yml)

## Commands

- `CodeMood: Show Mood Panel` - Display the mood panel
- `CodeMood: Hide Mood Panel` - Hide the mood panel
- `CodeMood: Toggle Mood Panel` - Toggle panel visibility
- `CodeMood: Refresh Current Mood` - Force refresh the current analysis

## Keyboard Shortcuts

- `Ctrl+Shift+M` (Windows/Linux) / `Cmd+Shift+M` (Mac) - Toggle mood panel

## Requirements

- VS Code 1.102.0 or higher
- Internet connection for emoji images (fallback text available offline)

## Extension Settings

This extension contributes no additional settings. It works out of the box with VS Code's built-in diagnostic system.

## Known Issues

- Emoji images require internet connection for first load (cached afterwards)
- Very large files (>1000 lines) may have slight performance impact

## Release Notes

### 0.0.1

Initial release of CodeMood:
- Real-time code mood analysis
- Support for 17+ programming and configuration languages
- Emoji-based visual feedback
- Performance optimized with caching
- Command palette integration

## Contributing

Found a bug or have a feature request? Please open an issue on our [GitHub repository](https://github.com/akshatsinha0/CodeMood.git).