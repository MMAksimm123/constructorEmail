# 📧 Email Builder — email newsletter builder

![Vue 3](https://img.shields.io/badge/vue-3.x-brightgreen.svg)
![TypeScript](https://img.shields.io/badge/typescript-5.x-blue.svg)
![Vite](https://img.shields.io/badge/vite-5.x-purple.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

**Email Builder** is a visual email builder with drag-n-drop support, saving layouts in the browser and sending via popular email services.

Create emails, add text blocks, images, buttons, columns and separators — all in a user-friendly interface. The project works completely on the client side and does not require a server part.

---

## 🎯 Features

- ✨ **Drag-n-drop editor** — drag components from the panel to the writing area.
- 📝 **Content editing** — edit the text directly in the preview (inline editing).
- 🎨 **Customize styles** — change the colors of the buttons, add images by URL.
- 💾 **Saving layouts** — all projects are stored in `localStorage', without a database.
- 📤 **Sending emails**:
- 🗂️ **Layout Management** — View, open, and delete saved projects on the home page.

---

## 🛠️ Technologies

- **Vue 3** (Composition API, `<script setup>`)
- **TypeScript** — strong typing
- **Vite** — fast build and development
- **CSS** — custom styles (without external libraries)
- **EmailJS** — optional sending of HTML emails (registration required)

---

## 🚀 Installation and launch

1. Clone the repository:
```bash
git clone https://github.com/your-username/email-builder.git
cd email-builder```

2. Install the dependencies:
```npm install```

3. Start the development server:
```npm run dev```

4. Open the application in the browser at ```http://localhost:5173 ```
