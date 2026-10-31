# HTML Tool & Prompt Studio

An interactive, card-based web application and prompt studio for session participants to design custom tools with multi-input/output schemas and export 100% self-contained, standalone single-file HTML applications.

---

## 🚀 Instant Offline Usage (Zero Dependencies)

This repository includes **`html_tool.html`**, a standalone, zero-dependency single-file application.

- **How to run:** Double-click `html_tool.html` in your file explorer on Windows, macOS, or Linux. It opens directly in Chrome, Safari, Edge, or Firefox.
- **Offline Ready:** All CSS styling and JavaScript logic are completely embedded. No local server, node modules, or internet connection required.
- **Commented Code:** Key functions (`validateInput`, `processData`, `renderInputsList`, `renderOutputsList`) are annotated with clear inline comments for workshop learning.

---

## 🛠️ Features

1. **Session Goal & Context Definition**: Define the tool title, participant audience, and core problem statement. Load starter presets (*Session Prompt Generator*, *CSV Data Cleaner*, *Meeting Notes to Actions*).
2. **Dynamic Multi-Input Builder**:
   - Set the number of inputs using the stepper or quick number chips.
   - For every input, configure all 4 required sections:
     - **Input Name**: Unique parameter identifier.
     - **Input / File Type**: Text, textarea, number, file upload, text file (`.txt`/`.md`), CSV spreadsheet (`.csv`), select dropdown, date, checkbox, email, or URL.
     - **Label & Placeholder**: Instruction text for users.
     - **Validation Rule (Dropdown)**: Required, positive number, range, file extension, email, URL, minimum character length, or optional.
3. **Dynamic Multi-Output Specification**:
   - Set the number of outputs using the stepper or quick number chips.
   - For every output, configure all 4 required sections:
     - **Output Title**: Section header.
     - **Display Format**: Interactive data table, formatted markdown text, downloadable file, KPI summary cards, or copyable code block.
     - **Destination Action**: Render on-screen card, instant file download, copy to clipboard, or modal popup.
     - **Processing Logic**: AI prompt synthesis, text transformation, math aggregation, or template merge.
4. **Live Interactive Simulator**: Test inputs with real-time validation and preview dynamic output generation directly inside the tool.
5. **Master AI Prompt Generator**: Automatically compiles a structured prompt ready to paste into Gemini, ChatGPT, or Claude.
6. **One-Click Single-File HTML Export**: Download a freshly generated `.html` file matching your custom schema.

---

## 🌐 Deploy to GitHub Pages (Free Hosting)

You can host this tool on GitHub Pages in under 2 minutes:

1. Push this repository to GitHub (see instructions below).
2. In your GitHub repository, go to **Settings** > **Pages**.
3. Under **Build and deployment** > **Branch**, select `main` (or `gh-pages`) and `/` (root) folder.
4. Click **Save**. GitHub Pages will deploy your site at:
   ```
   https://<your-username>.github.io/<your-repo-name>/html_tool.html
   ```

---

## 💻 Developer React Application

To run the full development studio with live hot reloading:

```bash
# 1. Install dependencies
npm install

# 2. Start local development server
npm run dev

# 3. Build for production
npm run build
```

---

## 📦 Pushing to your GitHub Repository

Run these commands in your local terminal:

```bash
# 1. Initialize git (if not already initialized)
git init

# 2. Add all files and make the initial commit
git add .
git commit -m "Initial commit: HTML Tool and Prompt Studio"

# 3. Rename default branch to main
git branch -M main

# 4. Add your GitHub remote repository URL
# Replace <YOUR-GITHUB-USERNAME> and <YOUR-REPO-NAME> with your actual GitHub details
git remote add origin https://github.com/<YOUR-GITHUB-USERNAME>/<YOUR-REPO-NAME>.git

# 5. Push to GitHub
git push -u origin main
```

---

## 📄 License

Apache-2.0 License
