import mysql.connector

def get_connection():
    return mysql.connector.connect(
        host="localhost",
        user="tu_usuario",
        password="tu_contraseña",
        database="face_login"
    )
