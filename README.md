<<<<<<< HEAD
# constructor-email

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```
=======
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
