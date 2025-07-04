from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from youtube_rag import main  

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AskInput(BaseModel):
    video_id: str
    question: str

@app.get("/")
def root():
    return {"message": "YouTube Video Chat API is running! Use POST /ask to ask questions about videos."}

@app.post("/ask")
def ask(input: AskInput):
    try:
        answer = main(input.video_id, input.question)
        return {"answer": answer}
    except Exception as e:
        error_message = str(e)
        if "rate limit" in error_message.lower():
            return {"answer": "Sorry, the AI service is currently busy. Please try again in a few minutes."}
        elif "NoTranscriptFound" in error_message:
            return {"answer": "Sorry, this video doesn't have English transcripts available."}
        else:
            return {"answer": f"Sorry, an error occurred: {error_message}"}
