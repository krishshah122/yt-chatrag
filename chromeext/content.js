
window.addEventListener('popstate', () => {
  handleYouTubeNavigation();
});
window.addEventListener('pushstate', () => {
  handleYouTubeNavigation();
});
window.addEventListener('replacestate', () => {
  handleYouTubeNavigation();
});
(function() {
  const origPushState = history.pushState;
  const origReplaceState = history.replaceState;
  history.pushState = function() {
    origPushState.apply(this, arguments);
    window.dispatchEvent(new Event('pushstate'));
  };
  history.replaceState = function() {
    origReplaceState.apply(this, arguments);
    window.dispatchEvent(new Event('replacestate'));
  };
})();
function handleYouTubeNavigation() {
  const videoId = getYouTubeVideoId();
  if (videoId) {
    chrome.runtime.sendMessage({ action: "setVideoId", videoId }, (response) => {
      console.log('Video ID sent to background:', response);
    });
  } else {
    console.log('No video ID to send to background');
  }
}

// Initial run
handleYouTubeNavigation();
function getYouTubeVideoId() {
  const url = window.location.href;
  
  // Try multiple patterns for YouTube video URLs
  const patterns = [
    /v=([^&]+)/,           // Standard: youtube.com/watch?v=VIDEO_ID
    /youtu\.be\/([^?]+)/,  // Short: youtu.be/VIDEO_ID
    /embed\/([^?]+)/        // Embed: youtube.com/embed/VIDEO_ID
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      console.log('YouTube Video ID detected:', match[1]);
      return match[1];
    }
  }
  
  console.log('No YouTube video ID found in URL:', url);
  return null;
}

// Send to background for storage
const videoId = getYouTubeVideoId();
if (videoId) {
  chrome.runtime.sendMessage({ action: "setVideoId", videoId }, (response) => {
    console.log('Video ID sent to background:', response);
  });
} else {
  console.log('No video ID to send to background');
}
