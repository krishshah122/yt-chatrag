import os
from dotenv import load_dotenv
from youtube_transcript_api import YouTubeTranscriptApi
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_community.llms import Together
from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate

# Load environment variables
load_dotenv()
together_api_key = os.getenv("TOGETHERAI_API_KEY")

# Components
splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
embeddings = HuggingFaceEmbeddings(model_name="BAAI/bge-small-en-v1.5")
llm = Together(
    model="deepseek-ai/DeepSeek-R1-Distill-Llama-70B-free",
    temperature=0.7,
    together_api_key=together_api_key
)

# # History per video ID
# conversation_history = {}

# def format_conversation_history(history):
#     return "\n\n".join([f"Q: {q}\nA: {a}" for q, a in history])

def get_or_create_vectorstore(video_id, chunks):
    db_path = f"./faiss_dbs/{video_id}"
    if os.path.exists(db_path):
        return FAISS.load_local(db_path, embeddings, allow_dangerous_deserialization=True)
    else:
        os.makedirs("./faiss_dbs", exist_ok=True)
        vectorstore = FAISS.from_documents(chunks, embeddings)
        vectorstore.save_local(db_path)
        return vectorstore

from typing import Dict
# Store history: key = video_id, value = list of (question, answer)
chat_history: Dict[str, list] = {}

def main(video_id: str, question: str) -> str:
    try:
        db_path = f"./faiss_dbs/{video_id}"
        if os.path.exists(db_path):
            vectorstore = FAISS.load_local(db_path, embeddings, allow_dangerous_deserialization=True)
        else:
            transcript = YouTubeTranscriptApi.get_transcript(video_id)
            full_text = " ".join([item["text"] for item in transcript])
            chunks = splitter.create_documents([full_text])
            vectorstore = get_or_create_vectorstore(video_id, chunks)

        prompt = PromptTemplate.from_template("""
You are a helpful assistant. Use only the provided context to answer the user's question directly and clearly.
- Do not include internal thoughts, monologue, or tags like <think>.
- Answer only what is asked: if it's a summary, give a summary; if asked in 3 lines, use 3 lines.
- If the context is not enough, say "Sorry, I couldn't find that in the video."

Context:
{context}

Question:
{question}

Answer:
""")

        retriever = vectorstore.as_retriever(search_kwargs={"k": 4})
        qa_chain = RetrievalQA.from_chain_type(
            llm=llm,
            retriever=retriever,
            chain_type="stuff",
            chain_type_kwargs={"prompt": prompt}
        )

        result = qa_chain.invoke({"query": question})
        answer = result["result"]

        # Store Q&A for chat-style memory
        chat_history.setdefault(video_id, []).append((question, answer))

        return answer

    except Exception as e:
        return f"❌ Error: {str(e)}"

