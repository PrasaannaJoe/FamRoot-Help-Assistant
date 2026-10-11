# Famie – FamRoot Help Assistant

## About the Project

Famie is an in-product help assistant developed for the FamRoot Family Tree module. It helps users find answers to questions about managing family relationships and using Family Tree features.

The assistant searches a supplied knowledge base (`corpus.json`) and provides concise answers with relevant reference links.

## Features

- Interactive chat interface
- Context-aware answers
- Knowledge-base search
- Relevant help links and references
- Fallback responses when information is unavailable
- Simple and user-friendly interface
- Grounded answers based on the supplied documentation

## Technologies Used

**Frontend**
- React 18
- Vite
- Ant Design 5
- JavaScript
- CSS

**Backend**
- Node.js
- Express.js
- CORS
- JSON

## Project Structure

```text
famie/
├── backend/
│   ├── corpus.json
│   ├── corpus-backup.json
│   └── server.cjs
├── public/
├── src/
│   ├── assets/
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── EVALUATION.md
├── NOTES.md
├── index.html
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
```

## Prerequisites

Install the following software:

- Node.js
- npm
- Git

## Installation

### 1. Clone the Repository

Replace the URL with your GitHub repository URL.

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd famie
```

### 2. Install Frontend Dependencies

```bash
npm install
```

### 3. Install Backend Dependencies

```bash
cd backend
npm install
```

Make sure `backend/corpus.json` contains valid JSON data.

## Running the Application

### Start the Backend

Open a terminal in the `backend` folder and run:

```bash
node server.cjs
```

The backend runs at:

`http://localhost:3001`

### Start the Frontend

Open a second terminal in the main `famie` folder and run:

```bash
npm run dev
```

Open the local URL shown in the terminal. It is usually:

`http://localhost:5173`

Keep both terminals running while using the application.

## How to Use

1. Open the Famie application in your browser.
2. Select the appropriate page context.
3. Enter a question about FamRoot Family Tree features.
4. Famie searches the knowledge base for relevant information.
5. Read the answer and use the reference links for additional help.
6. If the information is not available, Famie should respond that it could not find the answer.

## Knowledge Base

The application uses `backend/corpus.json` as its product knowledge source. Answers should be based on the supplied documentation and should not include unsupported information.

## Limitations

- Answer accuracy depends on the knowledge base and search algorithm.
- Questions outside the supplied documentation may not receive a complete answer.
- The project is a prototype and does not require user authentication.

## Future Improvements

- Improve search relevance and answer quality.
- Add automated tests.
- Improve the responsive chat interface.
- Add more help resources.
- Deploy the application online.

## Author

Prasanna

## Project Type

Take-Home Assignment – FamRoot Help Assistant
