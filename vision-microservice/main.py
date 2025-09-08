from fastapi import FastAPI, File, UploadFile, HTTPException
from PIL import Image
import io
from transformers import pipeline

app = FastAPI()

# Load the image captioning pipeline
# This will download the model weights if not already present
try:
    image_captioner = pipeline("image-to-text", model="nlpconnect/vit-gpt2-image-captioning")
except Exception as e:
    raise RuntimeError(f"Failed to load image captioning model: {e}")

@app.post("/analyze-image/")
async def analyze_image(file: UploadFile = File(...)):
    try:
        # Read the image file
        image_data = await file.read()
        image = Image.open(io.BytesIO(image_data)).convert("RGB")

        # Generate caption
        # The pipeline returns a list of dictionaries, e.g., [{'generated_text': 'a dog running in the grass'}]
        caption_results = image_captioner(image)
        
        if not caption_results or 'generated_text' not in caption_results[0]:
            raise HTTPException(status_code=500, detail="Failed to generate caption from image.")
        
        caption = caption_results[0]['generated_text']

        # For now, we'll just return the caption.
        # In a full implementation, you'd parse this caption for keywords,
        # or use a more advanced model for structured feedback (e.g., BLIP-2 for detailed descriptions,
        # then another LLM to parse that into accessibility, visual hierarchy, etc., as per assignment).
        # This is a placeholder to get the AI integration working.
        
        # Example of a more structured (but still simplified) response
        # based on the assignment's requirements for coordinate-anchored feedback.
        # This part would need significant expansion for a complete solution.
        feedback = {
            "analysis": {
                "accessibility": "No specific accessibility issues detected from caption.",
                "visual_hierarchy": "Visual hierarchy seems balanced based on caption.",
                "content_copy": f"Image content: {caption}",
                "ui_ux_patterns": "No specific UI/UX patterns identified from caption."
            },
            "feedback_items": [
                {
                    "description": caption,
                    "coordinates": {"x": 0, "y": 0, "width": image.width, "height": image.height},
                    "severity": "medium",
                    "recommendations": "Consider more detailed AI analysis for specific design feedback.",
                    "roles": ["designer", "reviewer"]
                }
            ]
        }

        return feedback

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Image analysis failed: {str(e)}")