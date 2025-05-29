# Proyecto de Reconocimiento Facial

Este proyecto fue desarrollado como parte de la materia de Ingeniería en Software en la Escuela Superior de Ingeniería Mecánica y Eléctrica (ESIME) Zacatenco del Instituto Politécnico Nacional (IPN).

## Descripción

El proyecto consiste en una aplicación web de reconocimiento facial que permite a los usuarios registrarse y autenticarse utilizando sus rostros. La aplicación está construida utilizando Flask para el backend y JavaScript para el frontend, aprovechando la biblioteca `face_recognition` para el procesamiento y reconocimiento de imágenes.

## Funcionalidades

- **Registro de Usuario:** Los usuarios pueden registrar sus rostros para su posterior identificación.
- **Inicio de Sesión:** Los usuarios pueden iniciar sesión utilizando su rostro.
- **Interfaz de Usuario:** La aplicación presenta una interfaz web simple y fácil de usar, con un header, footer, y secciones claramente definidas.

## Estructura del Proyecto

.
├── static
│ ├── css
│ │ └── styles.css
│ └── js
│ └── script.js
├── templates
│ ├── index.html
│ └── success.html
├── app.py
├── README.md
└── requirements.txt


- `static/css/styles.css`: Archivo CSS para los estilos de la aplicación.
- `static/js/script.js`: Archivo JavaScript para la lógica del frontend.
- `templates/index.html`: Página de inicio donde los usuarios pueden registrarse e iniciar sesión.
- `templates/success.html`: Página de bienvenida que se muestra después de un inicio de sesión exitoso.
- `app.py`: Archivo principal de la aplicación Flask.
- `README.md`: Documentación del proyecto.
- `requirements.txt`: Lista de dependencias necesarias para ejecutar la aplicación.

## Instalación

Para instalar y ejecutar la aplicación localmente, sigue estos pasos:

1. Clona este repositorio:

    ```sh
    git clone https://github.com/tu_usuario/tu_repositorio.git
    ```

2. Navega al directorio del proyecto:

    ```sh
    cd tu_repositorio
    ```

3. Crea un entorno virtual:

    ```sh
    python -m venv venv
    ```

4. Activa el entorno virtual:

    - En Windows:

        ```sh
        venv\Scripts\activate
        ```

    - En macOS/Linux:

        ```sh
        source venv/bin/activate
        ```

5. Instala las dependencias:

    ```sh
    pip install -r requirements.txt
    ```

6. Ejecuta la aplicación:

    ```sh
    python app.py
    ```

7. Abre tu navegador web y navega a `http://127.0.0.1:5000` para ver la aplicación.

## Requisitos

Las dependencias del proyecto están listadas en el archivo `requirements.txt`:

Flask
face_recognition
numpy
Pillow
opencv-python


## Autor

- **Emmanuel Campos Genaro**
- **Número de Boleta:** 2014300225
- **Escuela:** ESIME Zacatenco, Instituto Politécnico Nacional (IPN)


