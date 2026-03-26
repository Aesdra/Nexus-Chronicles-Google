# Nexus Chronicles: The Eternal Echo

An epic single-player RPG set in the universe of Arathis. Journey through Dimensional Gates as a Threshold Chosen in a cosmic war between Eternals and the Fallen. Featuring a dynamic narrative powered by Gemini AI, deep character customization, and a vast multiverse to explore.

This project is a web-based RPG built with modern frontend technologies, showcasing dynamic storytelling and AI-powered content generation.

## Tech Stack

- **Framework:** React
- **State Management:** Zustand (See [State Management Documentation](./docs/STATE_MANAGEMENT.md))
- **Data Fetching & Caching:** TanStack Query
- **Local Database:** Dexie.js (for caching API data like spells and items)
- **AI Integration:** Google Gemini API (`@google/genai`) for procedural content, character sprite generation, and an in-game Loremaster chat.
- **Styling:** Tailwind CSS
- **Animation:** Framer Motion

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js (v18 or later recommended)
- A modern web browser
- An environment that supports `npm` or a similar package manager.

### Installation

1.  Clone the repository to your local machine.
2.  Navigate to the project directory:
    ```bash
    cd nexus-chronicles
    ```
3.  Install the necessary dependencies (Note: In this specific project environment, dependencies are managed by an `importmap`, so a local `npm install` might not be needed).

### Environment Setup

This project requires an API key for the Google Gemini API to function correctly.

1.  The project expects the API key to be available as an environment variable named `process.env.API_KEY`.
2.  When running locally, you would typically create a file named `.env` in the root of the project directory.
3.  Add your API key to this file:
    ```
    API_KEY=YOUR_GEMINI_API_KEY
    ```
    Replace `YOUR_GEMINI_API_KEY` with your actual key obtained from Google AI Studio. **The application will not work without this key.**

### Running the Application

Once installed, you can start a development server. If you are using a tool like Vite, the command would be:

```bash
npm run dev
```

This will launch the application in your default web browser, typically at `http://localhost:5173`.

## Project Structure

The project has been refactored into a modular and scalable structure to facilitate future development and maintainability.

-   `/components`: Contains all React components, organized by functionality.
    -   `/common`: Generic, reusable components used everywhere (e.g., `LoadingSpinner`, `MarkdownRenderer`).
    -   `/character`: Components related to the player character (e.g., `ItemSlot`) and its creation/sheet views.
    -   `/game`: Components used directly on the main gameplay screen (e.g., `CombatScreen`, `GameHeader`).
    -   `/icons`: A collection of SVG icon components.
    -   `/modals`: All primary modal components are centralized here (e.g., `InventoryModal`, `CodexModal`, `ModalManager`).
    -   `/ui`: Low-level, reusable UI primitives (e.g., `Button`, `ModalFrame`, `StatusBar`).
-   `/data`: Holds all static game data, now more organized.
    -   `scenes.ts`: The main story content (Planned for further splitting).
    -   `items.ts`, `races.ts`, `npcs.ts`: Static definitions for game entities.
-   `/docs`: Contains markdown files documenting core game systems and changelogs.
-   `/hooks`: Custom React hooks for shared logic (e.g., `useGameShortcuts`).
-   `/lib`: General utility functions.
-   `/screens`: Top-level components representing the main application views (e.g., `MainMenuScreen`, `GameScreen`).
-   `/services`: Contains modules for business logic and external interactions.
    -   `/ai`: The complete AI decision-making system.
    -   `conditionRegistry.ts`: Centralized game logic predicates.
    -   `effectRegistry.ts`: Centralized game state modifiers.
    -   Other files handle interactions with APIs (Gemini, D&D), audio, and data persistence.
-   `/store`: The global game state management setup using Zustand, with logic split into modular "slices".
    -   `/selectors`: Reusable functions to extract and compute derived data from the state.
-   `/types`: All TypeScript type definitions, split into multiple domain-specific files.
-   `/db.ts`: Configuration for the Dexie.js local database.

## Author

A game by **Samuel Casanueva**.
