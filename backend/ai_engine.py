import cv2
import mediapipe as mp
from mediapipe.tasks import python
from mediapipe.tasks.python import vision
import numpy as np
from typing import Dict, Any
import os
import urllib.request

# Download MediaPipe face landmark model if it doesn't exist
MODEL_PATH = "face_landmarker.task"
if not os.path.exists(MODEL_PATH):
    url = "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task"
    urllib.request.urlretrieve(url, MODEL_PATH)

base_options = python.BaseOptions(model_asset_path=MODEL_PATH)
options = vision.FaceLandmarkerOptions(base_options=base_options,
                                       output_face_blendshapes=True,
                                       output_facial_transformation_matrixes=True,
                                       num_faces=1)
detector = vision.FaceLandmarker.create_from_options(options)

def calculate_distance(p1, p2):
    return np.linalg.norm(np.array(p1) - np.array(p2))

def analyze_face(image_bytes: bytes) -> Dict[str, Any]:
    """
    Analyzes an image using MediaPipe Face Mesh to calculate real biometric ratios.
    Outputs Harmony, Angularity, Dimorphism, and an overall Chad/HTN/MTN/LTN classification.
    """
    # Convert image bytes to numpy array
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    if img is None:
        raise ValueError("Invalid image format.")
        
    # Convert to RGB for MediaPipe
    img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=img_rgb)
    
    # Process image
    detection_result = detector.detect(mp_image)
    
    if not detection_result.face_landmarks:
        raise ValueError("No face detected in the image.")
        
    face_landmarks = detection_result.face_landmarks[0]
    
    # Map landmarks to 2D coordinates
    h, w, _ = img.shape
    points = [(int(lm.x * w), int(lm.y * h)) for lm in face_landmarks]
    
    # ---------------------------------------------------------
    # BIOMETRIC RATIO CALCULATIONS (Using specific mesh indices)
    # ---------------------------------------------------------
    
    # 1. Facial Width to Height Ratio (fWHR)
    # Width: Bizygomatic width (Indices 234 and 454)
    # Height: Upper lip (0) to brow (10)
    face_width = calculate_distance(points[234], points[454])
    face_height = calculate_distance(points[10], points[152]) # Nasion to Chin
    fwhr = face_width / (face_height + 1e-6)
    
    # 2. Eye Spacing Ratio (Intercanthal distance vs Biocular width)
    # Inner eyes: 133, 362
    # Outer eyes: 33, 263
    inner_eye_dist = calculate_distance(points[133], points[362])
    outer_eye_dist = calculate_distance(points[33], points[263])
    eye_spacing_ratio = inner_eye_dist / (outer_eye_dist + 1e-6)
    
    # 3. Gonial Angle / Jawline Width
    # Jaw angles: 132, 361
    jaw_width = calculate_distance(points[132], points[361])
    jaw_to_face_ratio = jaw_width / (face_width + 1e-6)
    
    # 4. Chin to Philtrum Ratio
    # Philtrum: 164, Chin: 152
    lower_third = calculate_distance(points[164], points[152])
    
    # ---------------------------------------------------------
    # SCORING ALGORITHM (Normalized to 1-10)
    # ---------------------------------------------------------
    
    # Harmony: Optimal fWHR is around 1.3 to 1.4 for males.
    harmony_score = max(1.0, 10.0 - abs(fwhr - 1.35) * 20)
    
    # Angularity: Jaw width close to bizygomatic width is highly angular.
    angularity_score = max(1.0, min(10.0, jaw_to_face_ratio * 12))
    
    # Dimorphism: Strong lower third and compact eyes.
    dimorphism_score = max(1.0, min(10.0, (lower_third / (face_height + 1e-6)) * 30))
    
    # Skin Health: (Simulated via image clarity/variance for now)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    laplacian_var = cv2.Laplacian(gray, cv2.CV_64F).var()
    skin_score = max(1.0, min(10.0, laplacian_var / 100))
    
    # OVERALL SCORE
    overall_score = (harmony_score * 0.35) + (angularity_score * 0.3) + (dimorphism_score * 0.2) + (skin_score * 0.15)
    overall_score = round(overall_score, 1)
    
    # CLASSIFICATION TIER
    tier = 'LTN'
    if overall_score >= 8.5:
        tier = 'Chad'
    elif overall_score >= 7.0:
        tier = 'HTN'
    elif overall_score >= 5.0:
        tier = 'MTN'
        
    return {
        "tier": tier,
        "score": overall_score,
        "metrics": {
            "harmony": round(harmony_score, 1),
            "angularity": round(angularity_score, 1),
            "dimorphism": round(dimorphism_score, 1),
            "skin": round(skin_score, 1)
        },
        "raw_ratios": {
            "fwhr": round(fwhr, 3),
            "jaw_to_face": round(jaw_to_face_ratio, 3),
            "eye_spacing": round(eye_spacing_ratio, 3)
        }
    }
