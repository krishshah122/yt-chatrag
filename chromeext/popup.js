document.getElementById("submit").addEventListener("click", async () => {
  const question = document.getElementById("input").value;
  const outputElement = document.getElementById("output");

  if (!question.trim()) {
    outputElement.textContent = "Please enter a question!";
    return;
  }

  outputElement.textContent = "Getting video ID...";

  // Step 1: Get the active tab
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tabId = tabs[0].id;

    // Step 2: Inject content.js into the tab (to update video ID again)
    chrome.scripting.executeScript(
      {
        target: { tabId: tabId },
        files: ["content.js"]
      },
      () => {
        // Step 3: Now ask background for videoId again (after it's updated)
        chrome.runtime.sendMessage({ action: "getVideoId" }, async (res) => {
          const videoId = res?.videoId;

          if (!videoId) {
            outputElement.textContent =
              "No YouTube video detected! Make sure you're on a YouTube video page.";
            return;
          }

          outputElement.textContent = "Processing your question...";

          try {
            const apiRes = await fetch("http://localhost:8000/ask", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ video_id: videoId, question }),
            });

            if (!apiRes.ok) {
              throw new Error(`API error: ${apiRes.status}`);
            }

            const data = await apiRes.json();
            outputElement.textContent = data.answer;
          } catch (error) {
            console.error("Error:", error);
            outputElement.textContent = `Error: ${error.message}`;
          }
        });
      }
    );
  });
});
