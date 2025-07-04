# YouTube Video Chat Chrome Extension

A Chrome extension that allows you to chat with any YouTube video using AI. The extension extracts video transcripts and uses RAG (Retrieval-Augmented Generation) to answer questions about the video content.

## Features

- Extract transcripts from YouTube videos
- Ask questions about video content
- AI-powered responses using Together AI's Llama model
- Vector storage for efficient retrieval
- Chrome extension popup interface

## Setup Instructions

### 1. Backend Setup

1. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Set up environment variables:**
   - Create a `.env` file in the root directory
   - Add your Together AI API key:
     ```
     TOGETHER_API_KEY=your_actual_api_key_here
     ```
   - Get your API key from [Together AI](https://together.ai/)

3. **Start the FastAPI server:**
   ```bash
   uvicorn app:app --reload --host 0.0.0.0 --port 8000
   ```

### 2. Chrome Extension Setup

1. **Open Chrome and go to Extensions:**
   - Type `chrome://extensions/` in the address bar
   - Or go to Menu → More Tools → Extensions

2. **Enable Developer Mode:**
   - Toggle the "Developer mode" switch in the top right

3. **Load the Extension:**
   - Click "Load unpacked"
   - Select the folder containing your extension files
   - The extension should now appear in your extensions list

## Testing the Extension

### 1. Test the Backend API

First, test if your backend is working:

```bash
# Test with curl (replace VIDEO_ID with an actual YouTube video ID)
curl -X POST "http://localhost:8000/ask" \
  -H "Content-Type: application/json" \
  -d '{"video_id": "VIDEO_ID", "question": "What is this video about?"}'
```

### 2. Test the Chrome Extension

1. **Navigate to any YouTube video**
2. **Click the extension icon** in your Chrome toolbar
3. **Type a question** about the video in the textarea
4. **Click "Ask"** to get an AI-generated response

### 3. Troubleshooting

**If the extension doesn't work:**

1. **Check the backend:**
   - Ensure the FastAPI server is running on `http://localhost:8000`
   - Check the terminal for any error messages

2. **Check the extension:**
   - Right-click the extension icon → "Inspect popup"
   - Check the browser console for JavaScript errors

3. **Check API key:**
   - Ensure your Together AI API key is correctly set in the `.env` file
   - Verify the API key is valid and has sufficient credits

4. **Check video ID extraction:**
   - The extension should work on any YouTube video page
   - Make sure you're on a video page (URL contains `youtube.com/watch?v=`)

## File Structure

```
ytextension/
├── app.py                 # FastAPI backend server
├── youtube_rag.py         # RAG implementation
├── manifest.json          # Chrome extension manifest
├── popup.html            # Extension popup interface
├── popup.js              # Popup JavaScript logic
├── content.js            # Content script for YouTube pages
├── background.js         # Background service worker
├── requirements.txt      # Python dependencies
├── faiss_dbs/           # Vector database storage
└── README.md            # This file
```

## How It Works

1. **Video Detection:** The content script detects when you're on a YouTube video page and extracts the video ID
2. **Transcript Extraction:** The backend fetches the video transcript using YouTube's API
3. **Vector Storage:** The transcript is split into chunks and stored in a FAISS vector database
4. **Question Processing:** When you ask a question, it's processed through the RAG pipeline
5. **AI Response:** The system retrieves relevant context and generates an answer using the Llama model

## Notes

- The first time you ask a question about a video, it may take longer as the system needs to download and process the transcript
- Subsequent questions about the same video will be faster as the vector database is cached
- Make sure you have a stable internet connection for transcript fetching and AI processing 