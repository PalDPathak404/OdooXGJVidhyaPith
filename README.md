# FleetEdge - Enterprise Fleet Management System

FleetEdge is a high-performance, real-time fleet management platform designed for enterprise logistics and transportation operations. It provides a comprehensive suite of tools for mission control, asset tracking, personnel management, and financial oversight.

## 🚀 Key Features

### 📡 Real-Time Mission Control
- **Interactive Live Tracking**: Real-world map integration using Leaflet and OpenStreetMap.
- **Dynamic Asset Visualization**: Custom-styled vehicle markers with real-time status indicators (Active, Maintenance, Alert, Idle).
- **Mission Dispatch**: Streamlined workflow for launching new missions with vehicle and driver assignments.
- **Emergency Management**: Instant emergency broadcast system for fleet-wide critical notifications.

### 📊 Command Center (Dashboard)
- **High-Level Analytics**: Overview of fleet health, mission success rates, and active deployments.
- **Live Signal Status**: Pulse monitoring of active fleet connections.
- **Actionable Insights**: Instant access to pending maintenance and critical alerts.

### 🚛 Asset & Personnel Management
- **Fleet Asset Tracking**: Detailed inventory of vehicles with real-time state management.
- **Personnel Hub**: Driver status tracking and assignment management.
- **Maintenance Bay**: Log and track vehicle service records to minimize downtime.

### 💰 Financial & Operational Hub
- **Expenditure Tracking**: Automated calculation of fuel costs and maintenance expenses.
- **Budget Monitoring**: Visual progress bars tracking Fuel, Maintenance, and Operations budgets.
- **Mission Association**: Link expenses directly to specific Trip IDs for granular financial auditing.

### 🔐 Enterprise-Grade Security
- **Clerk Authentication**: Secure login and registration with Email, Password, and Google OAuth.
- **Onboarding Flow**: Post-authentication role selection for new operators.
- **RBAC (Role-Based Access Control)**: Strict permission-based access for Administrators, Managers, Dispatchers, and Operators.

## 🛠️ Technical Stack

### Frontend
- **Framework**: React.js with Vite
- **Styling**: Tailwind CSS (Enterprise Dark Theme)
- **Animations**: Framer Motion
- **Map Engine**: Leaflet (OpenStreetMap Tiles)
- **Authentication**: Clerk React SDK
- **State Management**: Zustand
- **Icons**: Lucide React

### Backend
- **Server**: Node.js & Express
- **Database**: MongoDB
- **Security**: Clerk SDK for JWT verification

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16+)
- npm or yarn
- MongoDB Instance

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file and add your Clerk credentials:
   ```env
   VITE_CLERK_PUBLISHABLE_KEY=your_publishable_key
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with necessary variables:
   ```env
   MONGO_URI=your_mongodb_uri
   CLERK_SECRET_KEY=your_secret_key
   PORT=5000
   ```
4. Start the backend server:
   ```bash
   npm start
   ```

## 🎨 Design Philosophy
FleetEdge uses a "Command Center" aesthetic, featuring a custom dark-mode palette, glassmorphism effects, and highly readable high-contrast typography designed for mission-critical operations.
