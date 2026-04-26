<div align="center">

# ⚔️ GameBattle

**Discover which game from your Steam library you should play next.**

Run bracket-style tournaments between your own Steam games and crown a champion.

[![Java](https://img.shields.io/badge/Java-21-ED8B00?logo=openjdk&logoColor=white)](https://openjdk.org/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4.0.2-6DB33F?logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

</div>

---

## 📖 Table of Contents

- [About the Project](#-about-the-project)
- [Features](#-features)
- [Built With](#-built-with)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [Usage](#-usage)
  - [Running the Application](#running-the-application)
  - [API Reference](#api-reference)
- [Project Structure](#-project-structure)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

---

## 🎯 About the Project

Ever stared at your Steam library of 200+ games and had no idea what to play? **GameBattle** solves that.

It connects to the **Steam Web API**, syncs your entire game library, and lets you run **single-elimination bracket tournaments** between your games. You pick a winner in each head-to-head matchup until a single champion emerges — the game you should go play right now.

The app offers two battle modes designed for different moods: attack your **backlog** of untouched games, or settle the debate among your **all-time favorites**. Every tournament champion is recorded in a global **Hall of Fame**, where the most-crowned games rise to legendary status.

### ✨ Features

- 🔐 **Steam Authentication** — One-click sign-in via Steam OpenID. No passwords stored.
- 🔄 **Library Sync** — Automatically imports your full game library with playtime data and cover art.
- 📦 **Backlog Battle** — Tournament between games you own but barely played (< 3 hours).
- 🔥 **Favorites Battle** — Tournament between your top 20 most-played games.
- ⚔️ **Bracket System** — Single-elimination format with round tracking, progress bars, and smooth animations.
- 🏆 **Hall of Fame** — Persistent leaderboard of the most-crowned champions across all tournaments.
- 🎨 **Steam-Inspired UI** — Dark theme with glassmorphism, neon glow effects, and the Orbitron display font.
- 📱 **Responsive Design** — Fully functional on desktop and mobile devices.

---

## 🛠 Built With

### Backend

| Technology | Purpose |
|---|---|
| [Java 21](https://openjdk.org/) | Core language |
| [Spring Boot 4.0.2](https://spring.io/projects/spring-boot) | Application framework |
| [Spring Data JPA](https://spring.io/projects/spring-data-jpa) | Database access & ORM |
| [Spring Security](https://spring.io/projects/spring-security) | CORS & security configuration |
| [Spring WebFlux (RestClient)](https://docs.spring.io/spring-framework/reference/web/webflux.html) | HTTP client for Steam API |
| [PostgreSQL 16](https://www.postgresql.org/) | Relational database |
| [Lombok](https://projectlombok.org/) | Boilerplate reduction |
| [Maven](https://maven.apache.org/) | Build & dependency management |
| [Spring Boot Actuator](https://docs.spring.io/spring-boot/reference/actuator/) | Health check endpoint |

### Frontend

| Technology | Purpose |
|---|---|
| [React 18](https://react.dev/) | UI library |
| [TypeScript 5.8](https://www.typescriptlang.org/) | Type safety |
| [Vite 5](https://vite.dev/) | Build tool & dev server |
| [Tailwind CSS 3](https://tailwindcss.com/) | Utility-first CSS |
| [shadcn/ui](https://ui.shadcn.com/) | Component library (Radix primitives) |
| [Framer Motion](https://www.framer.com/motion/) | Animations & transitions |
| [TanStack React Query](https://tanstack.com/query) | Server state management |
| [Axios](https://axios-http.com/) | HTTP client |
| [React Router v6](https://reactrouter.com/) | Client-side routing |
| [Lucide React](https://lucide.dev/) | Icon system |

### Infrastructure

| Technology | Purpose |
|---|---|
| [Docker Compose](https://docs.docker.com/compose/) | Container orchestration |
| [pgAdmin 4](https://www.pgadmin.org/) | Database management UI |

---

## 🏗 Architecture

GameBattle is a **monorepo** with two independent applications communicating over REST:

```
┌──────────────────────┐       HTTP/REST        ┌──────────────────────┐
│                      │  ◄──────────────────►  │                      │
│    React Frontend    │                        │  Spring Boot Backend │
│    (port 5173)       │                        │    (port 8080)       │
│                      │                        │                      │
└──────────────────────┘                        └──────────┬───────────┘
                                                           │
                                                           │ JDBC
                                                           ▼
                                                ┌──────────────────────┐
                                                │    PostgreSQL 16     │
                                                │    (port 5432)       │
                                                └──────────────────────┘
                                                           ▲
                                                           │
                                                ┌──────────────────────┐
                                                │   pgAdmin 4          │
                                                │   (port 16543)       │
                                                └──────────────────────┘
```

The backend also makes outbound calls to the **Steam Web API** to fetch player profiles and owned games.

### Application Flow

```
Login (Steam OpenID)
  └─► Loading (sync library via Steam API)
        └─► Mode Select (Backlog or Favorites)
              └─► Battle Arena (single-elimination, 1v1)
                    └─► Champion Screen (saved to Hall of Fame)
```

### Domain Model

```
┌──────────┐       ┌───────────────┐       ┌──────────┐
│  User    │──1:N──│ UserLibrary   │──N:1──│  Game    │
│          │       │ (playtime)    │       │          │
└────┬─────┘       └───────────────┘       └────┬─────┘
     │                                          │
     │  1:N                                N:1  │
     │         ┌───────────────┐                │
     └─────────│  HallOfFame   │────────────────┘
               │  (timestamp)  │
               └───────────────┘
```

| Table | Key Columns | Description |
|---|---|---|
| `tb_user` | `steam_id` (unique), `username`, `avatar_url` | Steam user profiles |
| `tb_game` | `app_id` (unique), `name`, `image_url` | Steam game catalog |
| `tb_user_library` | `user_id` (FK), `game_id` (FK), `total_playtime` | User-game ownership with playtime |
| `tb_hall_of_fame` | `user_id` (FK), `game_id` (FK), `time` | Tournament champion records |

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- **Java 21** (JDK) — [Download](https://adoptium.net/)
- **Node.js 18+** and **npm** — [Download](https://nodejs.org/)
- **Docker** and **Docker Compose** — [Download](https://www.docker.com/)
- **Steam Web API Key** — [Get one here](https://steamcommunity.com/dev/apikey)

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/lucasterra/gamebattle.git
cd gamebattle
```

**2. Set up environment variables**

```bash
cp .envexample .env
```

Edit `.env` and fill in all required values (see [Environment Variables](#environment-variables) below).

**3. Start the database**

```bash
docker compose up -d
```

**4. Start the backend**

```bash
./mvnw spring-boot:run
```

> The backend starts on `http://localhost:8080`.

**5. Start the frontend** (in a separate terminal)

```bash
cd gamebattle-frontend
npm install
npm run dev
```

> The frontend starts on `http://localhost:5173`.

**6. Open the app**

Navigate to `http://localhost:5173` and click **"Sign in with Steam"**.

### Environment Variables

Create a `.env` file in the project root based on `.envexample`:

| Variable | Description | Example |
|---|---|---|
| `DB_USER` | PostgreSQL username | `postgres` |
| `DB_PASSWORD` | PostgreSQL password | `secretpass` |
| `DB_NAME` | Database name | `steam_battle_db` |
| `PGADMIN_EMAIL` | pgAdmin login email | `admin@admin.com` |
| `PGADMIN_PASSWORD` | pgAdmin login password | `admin` |
| `STEAM_API_KEY` | Your Steam Web API key | `XXXXXXXXXXXXXXXX` |
| `STEAM_API_URL` | Steam API base URL | `http://api.steampowered.com/` |
| `MY_STEAM_ID` | Default Steam ID (optional) | `76561198000000000` |
| `APP_USER` | Spring Security user | `admin` |
| `APP_PASSWORD` | Spring Security password | `admin` |
| `APP_FRONTEND_URL` | Frontend origin for CORS | `http://localhost:5173` |
| `APP_BACKEND_URL` | Backend base URL | `http://localhost:8080` |

> **Important:** Your Steam profile must be set to **Public** for the library sync to work.

---

## 💡 Usage

### Running the Application

| Command | Description | Directory |
|---|---|---|
| `docker compose up -d` | Start PostgreSQL + pgAdmin | Root |
| `./mvnw spring-boot:run` | Start Spring Boot backend | Root |
| `npm run dev` | Start Vite dev server | `gamebattle-frontend/` |
| `./mvnw test` | Run backend tests | Root |
| `npm run test` | Run frontend tests (vitest) | `gamebattle-frontend/` |
| `./mvnw clean package` | Build production JAR | Root |
| `npm run build` | Build production frontend | `gamebattle-frontend/` |

### How It Works

1. **Sign in** with your Steam account (OpenID redirect).
2. Your game library is **synced** automatically from Steam.
3. **Choose a mode:**
   - 📦 **Backlog Battle** — games with less than 3 hours of playtime
   - 🔥 **Favorites Battle** — your top 20 most-played games
4. Games face off in **head-to-head matchups**. Pick a winner each round.
5. A **champion** is crowned and saved to the Hall of Fame.
6. Check the 🏆 **Hall of Fame** to see which games are the most legendary.

### API Reference

<details>
<summary><strong>🔐 Authentication</strong></summary>

<br>

#### `GET /api/auth/steam`

Redirects the user to Steam OpenID login.

#### `GET /api/auth/steam/callback`

Handles the Steam OpenID callback. On success, redirects to the frontend with `?steamId=<id>`.

</details>

<details>
<summary><strong>🎮 Games</strong></summary>

<br>

#### `POST /api/games/sync?steamId={steamId}`

Syncs the user's Steam library to the local database.

```bash
curl -X POST "http://localhost:8080/api/games/sync?steamId=76561198000000000"
```

#### `GET /api/games/least?steamId={steamId}`

Returns games with less than 180 minutes of playtime (backlog candidates).

```bash
curl "http://localhost:8080/api/games/least?steamId=76561198000000000"
```

```json
[
  {
    "id": 42,
    "appId": 1174180,
    "name": "Red Dead Redemption 2",
    "imageUrl": "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1174180/header.jpg"
  }
]
```

#### `GET /api/games/most?steamId={steamId}`

Returns the top 20 most-played games.

```bash
curl "http://localhost:8080/api/games/most?steamId=76561198000000000"
```

</details>

<details>
<summary><strong>👤 Users</strong></summary>

<br>

#### `GET /api/users?steamId={steamId}`

Returns the user profile.

```bash
curl "http://localhost:8080/api/users?steamId=76561198000000000"
```

```json
{
  "id": 1,
  "steamId": "76561198000000000",
  "username": "PlayerOne",
  "avatarUrl": "https://avatars.steamstatic.com/..."
}
```

</details>

<details>
<summary><strong>🏆 Hall of Fame</strong></summary>

<br>

#### `POST /api/hall-of-fame?steamId={steamId}&gameId={gameId}`

Saves a tournament champion.

```bash
curl -X POST "http://localhost:8080/api/hall-of-fame?steamId=76561198000000000&gameId=42"
```

#### `GET /api/hall-of-fame/top-champions`

Returns the top 10 most-crowned games across all tournaments.

```bash
curl "http://localhost:8080/api/hall-of-fame/top-champions"
```

```json
[
  {
    "id": 5,
    "appId": 1091500,
    "name": "Cyberpunk 2077",
    "imageUrl": "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1091500/header.jpg"
  }
]
```

</details>

---

## 📂 Project Structure

```
gamebattle/
│
├── src/main/java/com/lucasterra/gamebattle/
│   ├── GamebattleApplication.java          # Spring Boot entry point
│   ├── config/
│   │   ├── SecurityConfig.java             # CORS, CSRF, endpoint security
│   │   └── SteamConfig.java                # RestClient bean for Steam API
│   ├── domain/
│   │   ├── Game.java                       # Game entity (appId, name, imageUrl)
│   │   ├── User.java                       # User entity (steamId, username, avatar)
│   │   ├── UserLibrary.java                # User-Game join with playtime
│   │   └── HallOfFame.java                 # Tournament champion records
│   ├── integration/steam/response/
│   │   ├── GetOwnedGamesResponse.java      # Steam owned-games DTO
│   │   └── GetPlayerSummariesResponse.java # Steam player-profile DTO
│   ├── repositories/
│   │   ├── GameRepository.java             # Game data access
│   │   ├── UserRepository.java             # User data access
│   │   ├── UserLibraryRepository.java      # Library data access
│   │   └── HallOfFameRepository.java       # Hall of Fame queries
│   ├── service/
│   │   ├── GameService.java                # Library sync & game filtering
│   │   └── HallOfFameService.java          # Champion persistence
│   └── web/
│       ├── AuthController.java             # Steam OpenID login flow
│       ├── GameController.java             # Game list endpoints
│       ├── UserController.java             # User profile endpoint
│       ├── HallOfFameController.java       # Hall of Fame endpoints
│       └── GlobalExceptionHandler.java     # Centralized error handling
│
├── gamebattle-frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── BattleArena.tsx             # Bracket tournament UI
│   │   │   ├── ChampionScreen.tsx          # Winner celebration screen
│   │   │   ├── HallOfFame.tsx              # Top champions leaderboard
│   │   │   ├── Header.tsx                  # Navigation bar with user info
│   │   │   ├── LoadingScreen.tsx           # Loading state
│   │   │   ├── LoginScreen.tsx             # Steam sign-in screen
│   │   │   ├── ModeSelection.tsx           # Battle mode picker
│   │   │   └── ui/                         # shadcn/ui components (auto-generated)
│   │   ├── pages/
│   │   │   ├── Index.tsx                   # Main page (state machine)
│   │   │   └── NotFound.tsx                # 404 catch-all
│   │   ├── data/
│   │   │   └── mockGames.ts               # Game type definitions & mock data
│   │   ├── index.css                       # Custom theme & utility classes
│   │   ├── App.tsx                         # Router & providers setup
│   │   └── main.tsx                        # React entry point
│   ├── package.json
│   ├── tailwind.config.ts
│   ├── vite.config.ts
│   └── vitest.config.ts
│
├── docker-compose.yaml                     # PostgreSQL + pgAdmin services
├── pom.xml                                 # Maven dependencies & build config
├── .envexample                             # Environment variable template
└── mvnw / mvnw.cmd                         # Maven wrapper scripts
```

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 📬 Contact

**Lucas Terra** — Creator & Maintainer

[![GitHub](https://img.shields.io/badge/GitHub--181717?logo=github)](https://github.com/l-terra)
[![LinkedIn](https://img.shields.io/badge/LinkedIn--0A66C2?logo=linkedin)](https://linkedin.com/in/l-ta)

---

<div align="center">

Built with ☕ Java, ⚛️ React, and a mass of unplayed Steam games.

</div>
