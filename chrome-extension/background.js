let currentVideoId = null;

console.log('=== BACKGROUND SCRIPT LOADED ===');

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  console.log('📨 Background received message:', msg);
  console.log('📨 From sender:', sender);
  
  try {
    if (msg.action === "setVideoId") {
      currentVideoId = msg.videoId;
      console.log('✅ Video ID set to:', currentVideoId);
      sendResponse({ success: true, videoId: currentVideoId });
    } else if (msg.action === "getVideoId") {
      console.log('🔍 Returning video ID:', currentVideoId);
      sendResponse({ videoId: currentVideoId });
    } else {
      console.log('❌ Unknown action:', msg.action);
      sendResponse({ error: 'Unknown action' });
    }
  } catch (error) {
    console.error('❌ Error in background script:', error);
    sendResponse({ error: error.message });
  }
  
  return true; // Keep the message channel open for async response
});

// Log when the service worker starts
console.log('=== BACKGROUND SCRIPT READY ===');
