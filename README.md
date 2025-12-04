# Currency Converter

A simple, easy-to-use Currency Converter app for converting amounts between currencies using up-to-date exchange rates. This README contains a demo section, overview, features, installation and local run instructions, project structure, technologies used, design & inspiration placeholder, and author placeholder.

## Demo
Live demo: https://ayzsw.github.io/currency-converter/


## Overview
Currency Converter provides a fast way to convert an amount from one currency to another using a reliable exchange rates provider. It is intended for both end-users (simple UI) and developers (API endpoint and modular architecture) who need accurate conversions in a compact app.

Key goals:
- Quick, accurate conversions
- Clean, responsive UI
- Easy to run locally and extend

## Features
- Convert between any two supported currencies
- Fetches live exchange rates from an external API (configurable)
- Selectable base / target currencies with search
- Optional: historical rates (if enabled/implemented)
- Lightweight, responsive interface suitable for mobile and desktop
- Simple REST API for programmatic access (if included)

## Installation and Local Run

Requirements:
- Node.js (>=16) and npm or yarn installed
- An API key for the exchange rates provider (if required), e.g. ExchangeRate-API, Open Exchange Rates, or exchangeratesapi.io

Steps:
1. Clone the repository
```bash
git clone https://github.com/ayzsw/currency-converter.git
cd currency-converter
```

2. Install dependencies
```bash
# Using npm
npm install

# or using yarn
yarn install
```

3. Create an environment file
Create a `.env` file in the project root with the variables your app requires. Example:
```env
# Example variables — adjust names to match your app
EXCHANGE_API_URL=https://api.exchangerate.host
EXCHANGE_API_KEY=your_api_key_here
PORT=3000
```

4. Run the app in development
```bash
# Frontend
npm run dev         # or `yarn dev` (if using Vite/Next/etc)

# Backend (if there is one)
npm run start:server # or `yarn start:server`

# Or a single command if the project has a combined script
npm run dev:all
```

5. Open in browser
Visit http://localhost:3000 (or the port you set) to view the app.

Production build:
```bash
npm run build
npm run start       # or follow your deployment steps
```

Notes:
- If your project is a single-page frontend (React/Vite/Next), use the frontend commands.
- If your project includes a separate backend (Express/Node), run both backend and frontend or follow the repository-specific instructions.

## Project structure (example)
Adjust this to match your repository. This is a common layout for a web-based currency converter:

```
currency-converter/
├─ public/                  # static files, images, favicon
├─ src/
│  ├─ components/           # UI components (Converter, CurrencySelect, etc.)
│  ├─ pages/                # If using Next.js or page-based routing
│  ├─ services/             # API service for fetching rates
│  ├─ hooks/                # Reusable React hooks
│  ├─ styles/               # CSS / SCSS / Tailwind config
│  ├─ utils/                # Utility functions (formatting, math helpers)
│  └─ index.tsx             # App entry point
├─ server/                  # (optional) backend API (Express, Koa, etc.)
│  ├─ routes/
│  └─ index.js
├─ .env.example
├─ package.json
├─ README.md
└─ docs/                    # optional: screenshots, design notes
```

## Technologies
List of suggested / common technologies used for a currency converter app — update to match your implementation:
- Frontend: React (with TypeScript or JavaScript), Vite or Create React App, or Next.js
- Styling: Tailwind CSS, CSS Modules, or plain CSS
- State management: React Context or Redux (if needed)
- Backend (optional): Node.js + Express (for proxying API requests or securing API keys)
- Exchange rates providers: exchangerate.host, ExchangeRate-API, Open Exchange Rates, Fixer.io, etc.
- Testing: Jest, React Testing Library
- Deployment: Vercel, Netlify, Heroku, DigitalOcean

## Design & Inspiration
- Add design inspirations, mockups, or links here.
- Example: Figma design link or Dribbble references.
Design & Inspiration: 
[https://www.figma.com/design/xurpGe4gY00pO2xPUvYDRE/Currency-converter---Mobile-and-Web-Version--Community-?node-id=15-31&p=f&t=PPgO3eay7e4ybmS8-0](https://www.figma.com/community/file/1215141639571590423)
https://1drv.ms/p/c/828fea46ba0ee2aa/IQBMq9MgNglER6zLtyRci9sCAb0xElzZV918W11V3Ffzxmg?e=VVV8zR

## Author
Add your name and links (GitHub, website, email) here.
Author: https://ayzsw.github.io/currency-converter/

## Contributing
Contributions are welcome. Please open an issue or submit a pull request with a clear description of your changes and why they are needed.

## License
Specify your license here (e.g. MIT). If you don't have one yet, add a license file and update this section.

