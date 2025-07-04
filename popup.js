document.getElementById("submit").addEventListener("click", async () => {
  const question = document.getElementById("input").value;
  const outputElement = document.getElementById("output");
  
  if (!question.trim()) {
    outputElement.textContent = "Please enter a question!";
    return;
  }

  outputElement.textContent = "Getting video ID...";

  chrome.runtime.sendMessage({ action: "getVideoId" }, async (res) => {
    console.log("Response from background:", res);
    
    const videoId = res?.videoId;
    if (!videoId) {
      outputElement.textContent = "No YouTube video detected! Make sure you're on a YouTube video page (URL should contain 'youtube.com/watch?v=')";
      return;
    }

    outputElement.textContent = "Processing your question...";

    try {
      const apiRes = await fetch("http://localhost:8000/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ video_id: videoId, question })
      });

      if (!apiRes.ok) {
        throw new Error(`API error: ${apiRes.status}`);
      }

      const data = await apiRes.json();
      outputElement.textContent = data.answer;
    } catch (error) {
      console.error("Error:", error);
      outputElement.textContent = `Error: ${error.message}. Make sure your backend server is running on localhost:8000`;
    }
  });
});
