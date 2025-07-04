// content.js
console.log('=== CONTENT SCRIPT LOADED ===');
console.log('Current URL:', window.location.href);

// Simple function to get video ID
function getVideoId() {
  const url = window.location.href;
  const videoIdMatch = url.match(/[?&]v=([^&]+)/);
  if (videoIdMatch) {
    return videoIdMatch[1];
  }
  return null;
}

// Function to send video ID to background
function sendVideoId(videoId) {
  console.log('Sending video ID:', videoId);
  chrome.runtime.sendMessage({ action: "setVideoId", videoId }, (response) => {
    console.log('Background response:', response);
  });
}

// Check for video ID immediately
const videoId = getVideoId();
if (videoId) {
  console.log('Found video ID:', videoId);
  sendVideoId(videoId);
  
  // Add visual indicator
  const indicator = document.createElement('div');
  indicator.style.cssText = `
    position: fixed;
    top: 10px;
    right: 10px;
    background: red;
    color: white;
    padding: 10px;
    z-index: 9999;
    font-family: Arial;
  `;
  indicator.textContent = 'Extension Active: ' + videoId;
  document.body.appendChild(indicator);
  
  setTimeout(() => {
    if (indicator.parentNode) {
      indicator.parentNode.removeChild(indicator);
    }
  }, 3000);
} else {
  console.log('No video ID found in URL:', window.location.href);
}

console.log('Content script finished');
