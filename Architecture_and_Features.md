# Travel-Go: Architecture & Features Documentation

This document provides a comprehensive overview of how the **Travel-Go** platform works, the relationship between its frontend and backend, and a breakdown of its file structure and features.

---

## 1. How the Website Works (The Big Picture)

Travel-Go is a **Full-Stack Web Application**. It follows a Client-Server architecture:

1.  **Frontend (The Client)**: This is what you see in your browser. It's built with **React** and **Vite**. Its job is to provide a beautiful interface, handle user input, and display data.
2.  **Backend (The Server)**: This is a **Node.js** and **Express** application. It lives on a server, handles logic, interacts with the database (MongoDB), and serves data.
3.  **Database (The Storage)**: **MongoDB** stores all persistent data like user profiles, bookings, hotel listings, and job applications.

---

## 2. Connecting Frontend and Backend

The communication between the frontend and backend happens through **APIs (Application Programming Interfaces)** using the **HTTP protocol**.

### The Flow:
1.  **Request**: The frontend sends a "request" to the backend (e.g., "Give me all available flights"). This is usually done using `fetch()` or `Axios`.
2.  **Data Format (JSON)**: Data is exchanged in **JSON (JavaScript Object Notation)** format, which is a lightweight way to structure data that both the browser and the server understand.
3.  **Processing**: The backend receives the request, checks the database, performs any necessary logic, and prepares a "response."
4.  **Response**: The backend sends back the data (as JSON) along with a status code (e.g., `200 OK`).
5.  **Update**: The frontend receives the JSON data and updates the UI dynamically without refreshing the whole page.

---

## 3. Project File Structure & Roles

### Root Directory
| File/Folder | Purpose |
| :--- | :--- |
| `src/` | **Frontend Codebase**: React components, pages, and styles. |
| `server/` | **Backend Codebase**: Express routes, models, and server logic. |
| `index.html` | The entry point for the browser. |
| `package.json` | Lists dependencies and scripts for the whole project. |
| `vite.config.js` | Configuration for the Vite build tool. |

### Frontend (`src/`)
| Folder/File | Role |
| :--- | :--- |
| `main.jsx` | The "brain" that starts the React application. |
| `App.jsx` | Main component that handles routing (which page to show for which URL). |
| `pages/` | Contains the code for each full page (e.g., `HomePage.jsx`, `AdminPanel.jsx`). |
| `components/` | Small, reusable UI pieces like `Header.jsx`, `Footer.jsx`, and `SearchForm.jsx`. |
| `context/` | Stores "Global State" (e.g., logged-in user info) shared across the app. |
| `styles/` | Custom CSS files for the "Liquid Glass" and "Premium" aesthetics. |

### Backend (`server/`)
| Folder/File | Role |
| :--- | :--- |
| `index.js` | The main server file. It starts the Express app and connects to the database. |
| `models/` | Defines the structure (Schema) of data in MongoDB (e.g., User, Booking, Job). |
| `routes/` | Defines the API endpoints (e.g., `/api/auth/register`, `/api/jobs/apply`). |
| `middleware/` | Logic that runs before a request reaches a route (e.g., checking if a user is an admin). |
| `.env` | Stores secret keys like your Database URL and JWT tokens. |

---

## 4. Important Features of Travel-Go

### 🏨 Booking Verticals
-   **Hotels & Holidays**: Search and book accommodation and curated holiday packages.
-   **Transport**: Full booking systems for **Flights**, **Trains**, **Buses**, and **Cabs**.
-   **Activities**: Discover and book local experiences.

### 🔐 User & Security
-   **Authentication**: Secure Register/Login system using JWT (JSON Web Tokens).
-   **Profile Management**: Users can update their info, track bookings, and earn rewards (Refer & Earn).

### 🛠️ Admin Dashboard (AdminPanel.jsx)
-   **Stats Visualization**: Real-time graphs and data about bookings and revenue.
-   **Management**: Full control over users, properties, bookings, and contact inquiries.
-   **Automation**: Tools for generating reports and monitoring system health.

### 💼 Career & Corporate
-   **Jobs Portal**: A complete system for viewing and applying for job openings at Travel-Go.
-   **Corporate Travel**: Specialized services for business clients.

### 💳 Financial & Support
-   **Payment Gateway**: Integrated flow for processing bookings (with confirmation modals).
-   **Gift Cards**: System for purchasing and redeeming travel gift cards.
-   **Insurance**: Integrated travel insurance options.
-   **FAQs & Support**: Comprehensive help section and contact forms.

---

## 5. Technical Highlights
-   **Modern Tech**: Built with Vite, React 18, and Node.js.
-   **Premium UI**: Features "Liquid Glass" aesthetics with smooth animations.
-   **Responsive Design**: Optimized for both Desktop and Mobile users.
-   **SEO Optimized**: Semantic HTML and descriptive metadata.
