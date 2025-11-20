# AI Drinking Party (赛博酒局)

This is a React-based web application using TypeScript and Tailwind CSS.

## How to Start (Local Development)

1.  **Install Dependencies**: Ensure you have Node.js installed.
    ```bash
    npm install react react-dom tailwindcss @google/genai lucide-react framer-motion canvas-confetti
    npm install -D typescript @types/react @types/react-dom @types/canvas-confetti
    ```
    *(Note: The code assumes a standard Create React App or Vite setup. If using a pure HTML/JS runner that supports imports, just ensure the packages are available).*

2.  **Environment Variable**:
    You need a Google Gemini API Key. Create a `.env` file in the root:
    ```env
    REACT_APP_GEMINI_API_KEY=your_api_key_here
    # Or if using Vite:
    VITE_GEMINI_API_KEY=your_api_key_here
    ```
    *Note: The code uses `process.env.API_KEY` as per the specific system instructions provided to the AI, but in a real Vite/CRA app, you map this variable accordingly.*

3.  **Run**:
    ```bash
    npm start
    # or
    npm run dev
    ```

## How to Deploy

1.  **Vercel (Recommended)**:
    *   Push your code to GitHub.
    *   Import the project into Vercel.
    *   Add the `API_KEY` in the Vercel Project Settings > Environment Variables.
    *   Deploy.

2.  **Netlify**:
    *   Similar process. Connect GitHub, set Environment Variables, and deploy.

## Features
*   **Classic Deck**: Standard King's Cup style rules.
*   **AI Wildcard**: Jokers trigger a call to Gemini 2.5 Flash to generate a unique, creative challenge.
*   **Manual AI Trigger**: Bored? Ask the AI for a random dare.
