# AI Proof Reader

This repository contains a minimal proof‑of‑concept for a text proofreading service.

![alt text](Docs/Front_end.png)

## Structure

```
/
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPI server with `/analyze` endpoint
│   │   ├── ai_service.py     # wrapper for Gemini proofreader call
│   └── requirements.txt     # Python dependencies
└── frontend/               # React application
    ├── package.json         # Node dependencies & scripts
    ├── vite.config.js       # Vite configuration
    ├── index.html           # Vite entry point
    ├── src/                 # React source files
    │   ├── main.jsx
    │   ├── App.jsx
    │   └── index.css
    └── dist/                # Build output (generated)
```

## Getting started

1. **Python backend**
   - Create a virtual environment and activate it (e.g. `python -m venv venv` & `venv\Scripts\activate`).
   - Install requirements:
     ```powershell
     pip install -r backend/requirements.txt
     ```
   - Set your Gemini key using a `.env` file (preferred) or environment variable:

     1. **Create a file named `.env` at the repository root** with the following contents:
        ```text
        GEMINI_API_KEY=your_key_here
        ```
        
     2. The backend will automatically load this value when it starts (thanks to `python-dotenv`) **NOTE:Do not upload your api key on any public service**.

   - Start the API server:
     ```powershell
     uvicorn backend.app.main:app --reload
     ```
   - The server will serve both the API and the frontend static page at http://localhost:8000/

2. **React frontend**

   - **Development**
     ```powershell
     cd frontend
     npm install      
     npm run dev      # starts Vite dev server on port 5173
     ```

   - **Production build**
     ```powershell
     cd frontend
     npm install
     npm run build    # outputs static files to frontend/dist
     ```

## Notes

* This is the bare minimum working flow: a user pastes text, the front end sends it to `/analyze`,
  the backend calls Gemini via `ai_service.proofread_text` and returns the raw output.
* Later iterations will add Login, Sign up and history pages, alongside  authentication and Database storage
