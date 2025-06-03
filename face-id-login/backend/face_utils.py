import base64
import numpy as np
from PIL import Image
from io import BytesIO
import face_recognition

def decode_image(data_url):
    header, encoded = data_url.split(",", 1)
    img_data = base64.b64decode(encoded)
    img = Image.open(BytesIO(img_data))
    return img

def encode_face(image_path):
    img = face_recognition.load_image_file(image_path)
    encodings = face_recognition.face_encodings(img)
    return encodings[0] if encodings else None
