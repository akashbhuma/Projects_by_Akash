# Shield – Content Warning

Shield is a Chrome extension that helps users identify content containing common misinformation or manipulation patterns. It does not block websites or decide what is true or false. Instead, it highlights passages that may deserve a closer look and explains why they were flagged.

The extension works entirely inside the browser and is designed to encourage users to verify information before accepting or sharing it.

## Features

- Detects common misinformation language patterns
- Highlights suspicious passages directly on web pages
- Assigns Low, Medium, or High severity levels
- Explains why content was flagged
- Provides a quick fact-check link through Snopes
- Optional blur for high-severity content
- Badge showing the number of flagged passages
- Adjustable detection sensitivity
- Website whitelist support
- Works on many social media platforms and websites

## Supported Websites

- Instagram
- Facebook
- X (Twitter)
- Reddit
- YouTube
- LinkedIn
- News websites
- Blogs
- General web pages

## Detection Categories

Shield currently looks for language patterns such as:

- Urgency manipulation
- Emotional manipulation
- Unverified claims
- Obscured sources
- Statistical distortion
- Conspiracy framing

These detections are based on predefined language patterns and should not be interpreted as proof that content is false.

## Project Structure

```
Shield/
│
├── background/
│   └── service-worker.js
│
├── content/
│   ├── scanner.js
│   ├── overlay.js
│   └── content.css
│
├── popup/
│   ├── popup.html
│   ├── popup.css
│   └── popup.js
│
├── rules/
│   └── signals.json
│
├── icons/
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
│
├── manifest.json
└── README.md
```

## Installation

1. Download or clone the repository.

```bash
git clone https://github.com/yourusername/shield.git
```

2. Open Chrome and go to:

```
chrome://extensions
```

3. Enable **Developer mode**.

4. Click **Load unpacked**.

5. Select the project folder.

The extension will now appear in Chrome.

## How It Works

When a page loads, Shield scans visible text for patterns defined in `signals.json`. If matching patterns are found, the extension groups them by passage, calculates a severity level, and highlights the content.

Clicking the warning reveals an explanation of the matched signals and provides a link to search the claim on Snopes.

All scanning happens locally in the browser.

## Settings

The popup allows you to:

- Enable or disable the extension
- Change detection sensitivity
- Blur high-severity content
- Enable or disable notifications
- Whitelist the current website

## Privacy

Shield does not send webpage content to external servers.

The extension:

- Processes content locally
- Does not collect personal information
- Does not require an account
- Stores only user preferences using Chrome Storage

## Built With

- JavaScript
- HTML
- CSS
- Chrome Extension Manifest V3

## Limitations

Shield relies on pattern matching rather than fact-checking. It cannot determine whether a claim is true or false, and some content may be flagged incorrectly or missed entirely.

Users should verify important information using reliable sources.
