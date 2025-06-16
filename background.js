chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.url && message.filename) {
    chrome.downloads.download({
      url: message.url,
      filename: message.filename,
      saveAs: false
    });
  }
});