document.getElementById("export").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: exportChatAsMarkdownWithAllImages,
  });
});

async function exportChatAsMarkdownWithAllImages() {
  function sanitizeFilename(name) {
    return name.replace(/[^a-z0-9_\\-]/gi, "_").toLowerCase().slice(0, 50);
  }

  const messages = [...document.querySelectorAll("main .text-base")];
  const md = [];
  const downloadedImages = new Set(); // Track unique image URLs
  let imageCount = 1;

  for (let el of messages) {
    const textBlock = el.querySelector('[data-message-author-role]');
    const role = textBlock?.getAttribute("data-message-author-role");
    const name = role === "user" ? "Vinav" : "ChatGPT";

    const text = textBlock?.innerText.trim() || el.innerText.trim();
    if (text) {
      md.push(`**${name || "Unknown"}:**\n${text}`);
    }

    const imgs = el.querySelectorAll("img");

    for (let img of imgs) {
      const src = img.src;
      if (
        src &&
        src.includes("files.oaiusercontent.com") &&
        !downloadedImages.has(src)
      ) {
        downloadedImages.add(src);

        // Extract original filename from the URL (if possible)
        const originalFilename = decodeURIComponent(
          src.split("filename%3D")[1]?.split("&")[0] || `image_${imageCount}.png`
        );

        const filename = `${originalFilename}`;
        md.push(`![image ${imageCount}](${filename})`);

        setTimeout(() => {
          const a = document.createElement("a");
          a.href = src;
          a.download = originalFilename; // No assetsDir here since it's handled by user's system
          document.body.appendChild(a);
          a.click();
          a.remove();
        }, imageCount * 500);

        imageCount++;
      }
    }

    md.push("\n---\n");
  }

  const blob = new Blob([md.join("\n")], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const title = document.title || "chat";
  const filename = sanitizeFilename(title) + ".md";

  chrome.runtime.sendMessage({ url, filename });
}
