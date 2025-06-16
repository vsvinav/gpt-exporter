document.getElementById("export").addEventListener("click", async () => {
    const rawName = document.getElementById("username")?.value || "";
    const userName = rawName.replace(/[^\w \-]/g, "").trim() || "User";

    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: exportChatAsMarkdownWithAllImages,
        args: [userName]
    });
});

async function exportChatAsMarkdownWithAllImages(userName) {
    function sanitizeFilename(name) {
        return name
            .replace(/[^a-z0-9_\-]/gi, "_")
            .toLowerCase()
            .slice(0, 50);
    }

    const textBlocks = [...document.querySelectorAll("main [data-message-author-role]")];
    const md = [];
    const downloadedImages = new Set();
    const seenTexts = new Set();
    let imageCount = 1;

    for (let textBlock of textBlocks) {
        const el = textBlock.closest(".text-base");
        if (!el) continue;

        const role = textBlock.getAttribute("data-message-author-role");
        const name = role === "user" ? userName : "ChatGPT";
        const cleanText = textBlock.innerText.trim();
        const key = `${role}:${cleanText}`;

        if (!cleanText || seenTexts.has(key)) continue;
        seenTexts.add(key);

        // escape any markdown-sensitive chars in name
        const safeName = name.replace(/([_*[\]`>])/g, "\\$1");
        md.push(`**${safeName}:**\n${cleanText}`);

        const imgs = el.querySelectorAll("img");
        for (let img of imgs) {
            const src = img.src;
            if (
                src &&
                src.includes("files.oaiusercontent.com") &&
                !downloadedImages.has(src)
            ) {
                downloadedImages.add(src);

                // extract raw filename or fallback
                const rawFile = decodeURIComponent(
                    src.split("filename%3D")[1]?.split("&")[0] ||
                    `image_${imageCount}.png`
                );
                // split off extension (default to .png)
                const extMatch = rawFile.match(/\.[^.]+$/);
                const ext = extMatch ? extMatch[0] : ".png";
                const base = extMatch
                    ? rawFile.slice(0, rawFile.length - ext.length)
                    : rawFile.replace(/\.[^.]*$/, "");
                const safeBase = sanitizeFilename(base);
                const filename = `${safeBase}${ext}`;

                md.push(`![image ${imageCount}](${filename})`);

                setTimeout(() => {
                    const a = document.createElement("a");
                    a.href = src;
                    a.download = filename;
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                }, imageCount * 300);

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
