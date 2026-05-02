import os
import json
import wave
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import vosk
from pydub import AudioSegment

app = FastAPI()

# Allow CORS for the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load Vosk Model
MODEL_PATH = "model"
if not os.path.exists(MODEL_PATH):
    print("Please download the model from https://alphacephei.com/vosk/models and unpack as 'model' in the current folder.")
    model = None
else:
    model = vosk.Model(MODEL_PATH)

class TextPayload(BaseModel):
    text: str

@app.post("/upload-audio")
async def upload_audio(file: UploadFile = File(...)):
    if not model:
        raise HTTPException(status_code=500, detail="Vosk model not loaded on server.")
    
    # Save the uploaded file temporarily
    file_location = f"temp_{file.filename}"
    with open(file_location, "wb+") as file_object:
        file_object.write(file.file.read())

    # Convert to standard WAV (16kHz, mono) required by Vosk
    try:
        audio = AudioSegment.from_file(file_location)
        audio = audio.set_channels(1).set_frame_rate(16000)
        wav_location = f"converted_{file.filename}.wav"
        audio.export(wav_location, format="wav")
    except Exception as e:
        os.remove(file_location)
        raise HTTPException(status_code=400, detail=f"Audio conversion failed: {str(e)}")

    # Process with Vosk
    transcript = ""
    try:
        wf = wave.open(wav_location, "rb")
        rec = vosk.KaldiRecognizer(model, wf.getframerate())
        rec.SetWords(True)

        while True:
            data = wf.readframes(4000)
            if len(data) == 0:
                break
            if rec.AcceptWaveform(data):
                res = json.loads(rec.Result())
                transcript += res.get("text", "") + " "
        
        # Get final part
        res = json.loads(rec.FinalResult())
        transcript += res.get("text", "")

        wf.close()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Transcription failed: {str(e)}")
    finally:
        # Cleanup
        if os.path.exists(file_location):
            os.remove(file_location)
        if os.path.exists(wav_location):
            os.remove(wav_location)

    return {"speech_id": file.filename, "transcript": transcript.strip()}

# ---- Mock LLM Endpoints ----

@app.post("/summarize")
async def summarize(payload: TextPayload):
    text = payload.text
    # Simple mock summary
    words = text.split()
    summary = " ".join(words[:20]) + "..." if len(words) > 20 else text
    return {"summary": f"This is an AI generated summary of the speech: {summary}"}

@app.post("/topics")
async def topics(payload: TextPayload):
    # Mock topics
    return {
        "topics": [
            {"name": "Economy", "score": 0.85},
            {"name": "Healthcare", "score": 0.72},
            {"name": "Education", "score": 0.65},
            {"name": "Infrastructure", "score": 0.45}
        ]
    }

@app.post("/keywords")
async def keywords(payload: TextPayload):
    # Mock keywords (extracting some words blindly or returning a static list)
    return {
        "keywords": [
            {"word": "future", "count": 12},
            {"word": "growth", "count": 9},
            {"word": "community", "count": 8},
            {"word": "development", "count": 6},
            {"word": "opportunities", "count": 5}
        ]
    }

@app.post("/promises")
async def promises(payload: TextPayload):
    # Mock promises
    return {
        "promises": [
            {"text": "We will build a new hospital within 2 years.", "category": "Healthcare", "status": "pending"},
            {"text": "I promise to lower taxes for the middle class.", "category": "Economy", "status": "pending"}
        ],
        "achievements": [
            {"text": "Successfully reduced unemployment by 2%.", "category": "Economy"},
            {"text": "Opened 5 new schools last year.", "category": "Education"}
        ]
    }

@app.post("/sentiment")
async def sentiment(payload: TextPayload):
    # Mock sentiment
    return {
        "overall": "Positive",
        "score": 0.78,
        "segments": [
            {"index": 1, "label": "Neutral", "score": 0.5, "text": "I am here today to speak to you... "},
            {"index": 2, "label": "Positive", "score": 0.8, "text": "We have achieved great things together."},
            {"index": 3, "label": "Positive", "score": 0.9, "text": "And the future looks brighter than ever before."}
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
