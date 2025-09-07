from fastapi import FastAPI, File, UploadFile
from pydantic import BaseModel
import requests
import os

app = FastAPI()

HF_API_KEY = os.getenv("HF_API_KEY")
DINO_MODEL = os.getenv("DINO_MODEL")
BLIP_MODEL = os.getenv("BLIP_MODEL")

class ImageAnalysisRequest(BaseModel):
    image: UploadFile

@app.post("/analyze-image/")
async def analyze_image(file: UploadFile = File(...)):
    image_bytes = await file.read()

    # 1. Grounding DINO for object detection
    dino_headers = {"Authorization": f"Bearer {HF_API_KEY}"}
    dino_response = requests.post(f"https://api-inference.huggingface.co/models/{DINO_MODEL}", headers=dino_headers, data=image_bytes)
    dino_results = dino_response.json()

    # 2. BLIP-2 for captioning
    blip_headers = {"Authorization": f"Bearer {HF_API_KEY}"}
    blip_response = requests.post(f"https://api-inference.huggingface.co/models/{BLIP_MODEL}", headers=blip_headers, data=image_bytes)
    blip_results = blip_response.json()

    return {"dino": dino_results, "blip": blip_results}
