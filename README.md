# 🚨 SheGuard – Offline AI Safety App Powered by Gemma 3n

**SheGuard** is a women’s safety app designed to work even without internet.  
It uses Google’s **Gemma 3n model**, running locally via **Ollama**, to detect emergencies or threats using voice — all processed entirely offline.

This app was developed as part of the **Kaggle Gemma 3n Impact Challenge**.

---

## 🛡️ Features

- SOS button that plays a loud siren
- Voice-based emergency detection powered by Gemma 3n (offline)
- Emergency contact manager (add/view/delete)
- Dark/light mode toggle
- Clean, mobile-friendly design (based on Figma prototype)

---

## 🛠️ Tech Stack

- React (Vite)
- Ollama + Gemma 3n
- Web Speech API
- Figma Make (for UI design)

---

## 🚀 How to Run the App Locally

Make sure [Node.js](https://nodejs.org/) and [Ollama](https://ollama.com) are installed.

```bash
# Clone this repo
git clone https://github.com/your-username/sheguard-gemma.git
cd sheguard-gemma

# Install dependencies
npm install

# Start the development server
npm run dev

# Start the Gemma model in another terminal
ollama run gemma:3b
```

## 📸 Demo & Screenshots

[Click here to view demo video and screenshots](https://drive.google.com/drive/folders/1wpuL8DoNauxfaCAP3sBNTUK1wwmkbwys?usp=sharing)

🎥 **Demo Video:** [Watch on YouTube](https://youtu.be/1u1_4UP5gVk)

📌 **Note**: The SOS siren button is fully functional in the app, but due to screen recording limitations, the audio siren was not captured in the demo video.

