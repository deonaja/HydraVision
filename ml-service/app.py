import io
import os
import torch
import timm
from torchvision import transforms
from PIL import Image
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="HydraVision ML Service - MobileNetV4")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DEVICE = torch.device("cpu")
MODEL_PATH = os.path.join(os.path.dirname(__file__), "models", "mobilenetv4.pth")
CLASS_NAMES = ["Kering", "Terhidrasi"]

# Transform standard 224x224 ImageNet normalization
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    ),
])

# Initialize model
print(f"[ml-service] Loading MobileNetV4 model from {MODEL_PATH}...")
model = timm.create_model("mobilenetv4_conv_small.e1200_r224_in1k", num_classes=2, pretrained=False)

if os.path.exists(MODEL_PATH):
    checkpoint = torch.load(MODEL_PATH, map_location=DEVICE, weights_only=False)
    state_dict = checkpoint.get("state_dict", checkpoint)
    model.load_state_dict(state_dict, strict=True)
    model.to(DEVICE)
    model.eval()
    print("[ml-service] MobileNetV4 weights successfully loaded and model set to eval mode!")
else:
    print(f"[ml-service] WARNING: Model file not found at {MODEL_PATH}")

@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "model": "mobilenetv4_conv_small",
        "device": str(DEVICE),
        "classes": CLASS_NAMES
    }

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        if not contents:
            raise HTTPException(status_code=400, detail="File kosong.")

        image = Image.open(io.BytesIO(contents)).convert("RGB")
        tensor = transform(image).unsqueeze(0).to(DEVICE)

        with torch.no_grad():
            outputs = model(tensor)
            probabilities = torch.softmax(outputs, dim=1)[0]
            confidence_val, predicted_idx = torch.max(probabilities, 0)

        label = CLASS_NAMES[predicted_idx.item()]
        confidence = int(round(confidence_val.item() * 100))

        prob_dict = {
            CLASS_NAMES[i]: round(probabilities[i].item() * 100, 2)
            for i in range(len(CLASS_NAMES))
        }

        return {
            "label": label,
            "confidence": confidence,
            "probabilities": prob_dict,
            "model_version": "MobileNetV4 Conv Small"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gagal melakukan klasifikasi: {str(e)}")
