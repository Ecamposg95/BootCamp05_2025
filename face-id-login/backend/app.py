from flask import Flask, request, jsonify
from flask_cors import CORS
import os, datetime
import numpy as np
from face_utils import decode_image, encode_face
from database import get_connection

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = os.path.join(os.getcwd(), "static", "uploads")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/register', methods=['POST'])
def register():
    data = request.json
    name = data.get('name')
    photo = data.get('photo')

    img = decode_image(photo)
    filename = f"{name}_{datetime.datetime.now().timestamp()}.jpg"
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    img.save(filepath)

    encoding = encode_face(filepath)
    if encoding is not None:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute("INSERT INTO users (name, encoding) VALUES (%s, %s)", (name, encoding.tobytes()))
        conn.commit()
        cur.close()
        conn.close()
        return jsonify({"message": "Usuario registrado"}), 200
    return jsonify({"error": "No se detectó rostro"}), 400

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    photo = data.get('photo')
    img = decode_image(photo)
    filename = "login_face.jpg"
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    img.save(filepath)

    login_encoding = encode_face(filepath)
    if login_encoding is None:
        return jsonify({"error": "No se detectó rostro"}), 400

    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT name, encoding FROM users")
    users = cur.fetchall()
    cur.close()
    conn.close()

    for name, encoding_blob in users:
        stored_encoding = np.frombuffer(encoding_blob, dtype=np.float64)
        matches = face_recognition.compare_faces([stored_encoding], login_encoding)
        if any(matches):
            return jsonify({"success": True, "name": name})

    return jsonify({"success": False}), 401

if __name__ == '__main__':
    app.run(debug=True)
