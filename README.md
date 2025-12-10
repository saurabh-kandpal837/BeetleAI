# Beetle AI

A futuristic AI chat interface powered by Ollama.

## Features
- **English First**: Beetle AI responds in English by default.
- **Hindi on Request**: Ask "Answer in Hindi" to get a Hindi response.
- **Real AI**: Powered by Llama 3.2 via Ollama.
- **Smart Image Generation**: Ask "Generate a cat image" -> Auto-downloads.
- **Memory**: Chats are saved locally.
- **Voice Controls**: Stop button to silence the AI.

## Prerequisites

1.  **Python 3.8+**
2.  **Ollama** installed and running.
3.  **Llama 3.2:3b** model pulled:
    ```bash
    ollama pull llama3.2:3b
    ```

## Setup & Running

### 1. Backend (Localhost)

The backend connects to Ollama and serves the API.

1.  Navigate to the `backend` directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
3.  Run the server:
    ```bash
    python app.py
    ```
    The server will start at `http://localhost:5000`.

### 2. Frontend (GitHub Pages)

The frontend is a static site that connects to the backend.

1.  **Local Testing:**
    Simply open `index.html` in your browser. Ensure the backend is running.
    *Note: Voice features work best in Chrome/Edge.*

2.  **GitHub Pages Deployment:**
    - Push this `web` folder to a GitHub repository.
    - Go to **Settings > Pages**.
    - Select the branch (e.g., `main`) and folder (`/` or `/web` depending on your repo structure).
    - **Important:** Since GitHub Pages is HTTPS, it might block requests to `http://localhost:5000` (Mixed Content Error).
    - **Solution for Local Backend + GitHub Pages:**
        - For true remote access, deploy the backend to a service like **Render** or **Railway**.
        - Update `API_URL` in `script.js` to your deployed backend URL (e.g., `https://your-app.onrender.com/chat`).
        - For local testing with GitHub Pages, you might need to disable "Block insecure content" in your browser settings for the specific page, or just run the frontend locally.

### 3. Deploying Backend to Render (Optional)

To make your backend accessible from anywhere (including GitHub Pages):
1.  Push your code to GitHub.
2.  Create a new **Web Service** on Render.
3.  Connect your repository.
4.  Set **Root Directory** to `web/backend`.
5.  Render should auto-detect Python.
6.  **Build Command**: `pip install -r requirements.txt`
7.  **Start Command**: `gunicorn app:app`
8.  Once deployed, copy the URL (e.g., `https://beetle-ai.onrender.com`) and update `API_URL` in `script.js`.

## Project Structure

- `index.html`: Main UI.
- `style.css`: Styling.
- `script.js`: Frontend logic, API connection, STT & TTS, Image Gen, Storage.
- `backend/app.py`: Flask backend server.
- `backend/Procfile`: Deployment configuration for Render.
