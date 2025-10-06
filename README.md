# Mission Dashboard

A lightweight dashboard built with **Vite + React** for visualizing and interacting with satellite mission data.  
Designed to work alongside the [sat-image-server](https://github.com/captinturtle1/sat-image-server).

## Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Start the development server
```bash
npm run dev
```

### 3. Open in browser
Navigate to http://localhost:5173

## Architecture
The dashboard connects to the sat-image-server API and displays mission data in an interactive UI.

![System Architecture Diagram](https://raw.githubusercontent.com/captinturtle1/mission-dashboard/refs/heads/main/documentation/architecture.png)

## Tech Stack

- [Vite](https://vite.dev/)
- [React](https://react.dev/)
- [Go API](https://github.com/captinturtle1/sat-image-server)