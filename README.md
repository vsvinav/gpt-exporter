# ChatGPT Markdown Exporter (with Local Image Downloads)

A Chrome extension that lets you export full ChatGPT conversations into a markdown file, with all images (uploaded or generated) downloaded locally and embedded with proper references.

---

## Features

* Export both user and assistant messages from ChatGPT
* Automatically download images locally and reference them in the markdown
* Preserves message order and formatting for clean readability
* Uses original image filenames (if available) for clarity and organization
* Simple UI: One-click export from the Chrome toolbar

---

## Installation

### 1. Download or Clone the Extension

Download the ZIP from this repository or clone it:

##### HTTPS:

```bash
git clone https://github.com/vsvinav/gpt-exporter.git
```

##### SSH:
```bash
git clone git@github.com:vsvinav/gpt-exporter.git
```


### 2. Load Extension in Chrome

1. Open Chrome and navigate to: `chrome://extensions`
2. Enable **Developer Mode** (toggle in top right)
3. Click **Load unpacked**
4. Select the `gpt-exporter/` directory
5. (Optional) Pin the extension for easy access

---

## Usage

1. Open any conversation on [https://chat.openai.com](https://chat.openai.com)
2. Click the extension icon in the toolbar
3. Enter your name and click the **"Export Chat"** button
4. A `.md` file with the conversation will download
5. Each image used in the chat will also be downloaded using its original filename

**Note:** Image downloads are staggered to avoid triggering browser throttling.

---

## Markdown Output Format

The exported markdown file will follow this format:

```markdown
**Username:**
What if we exported the conversation and kept the images?

**ChatGPT:**
Absolutely, here's a tool that does that.

![image 1](my_uploaded_image.png)

---
```

---

## Limitations

* Only works with open chat on the page
* Downloaded images will appear in your browser's Downloads folder
* Browser download prompts must be allowed for image saving to function

---

## Known Issues

* Some filenames may still contain special characters if not sanitized
* Browser permissions or settings might block image downloads in rare cases
* If the uploaded images have the same name, it might cause an issue.

---

## Development Notes

* Written using JavaScript and the Chrome Extensions API (Manifest V3)
* Script is injected into the current ChatGPT tab and scrapes content from the DOM
* Uses `<a download>` method to initiate file saving

---

## Contributions

Contributions and feature requests are welcome. Please open an issue or submit a pull request via GitHub.

---
