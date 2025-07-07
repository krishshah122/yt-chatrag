let currentVideoId = null;

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "setVideoId") {
    chrome.storage.local.set({ videoId: msg.videoId }, () => {
      sendResponse({ success: true });
    });
    return true; // Keep async channel open
  }

  if (msg.action === "getVideoId") {
    chrome.storage.local.get("videoId", (result) => {
      sendResponse({ videoId: result.videoId || null });
    });
    return true; // Keep async channel open
  }
});

