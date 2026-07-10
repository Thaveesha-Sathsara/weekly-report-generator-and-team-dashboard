# Sinesco Digital Weekly Report Generator

A full-stack MERN application designed to streamline weekly reporting and team management. It features role-based access control, automated date-cycle logic, and an integrated AI Chat Assistant.

## Setup Instructions

Follow these steps to run the application locally on your machine.

### 1. Installing Dependencies
You must install the Node packages for both the backend server and the frontend client. Open your terminal and run the following commands:

```bash
# Clone the repository
git clone https://github.com/Thaveesha-Sathsara/weekly-report-generator-and-team-dashboard.git
cd weekly-report

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 2. Running the Bacnkend
1. Open a terminal and navigate to your server directory.
2. Create a `.env` file in the root of the server folder and **copy & paste** the details from `/server/.env.example`.
3. Start the Express server:

```bash
npm run dev
```
The backend API will start on `http://localhost:5000`


## 3.Running Frontend
1. Open a new, separate terminal and navigate to your frontend directory.
2. Create a `.env` file in the root of the client folder and **copy & paste** the details from `/client/.env.example`.
3. Start the Vite development server:

```bash
npm run dev
```
The frontedn application will launch on `http://localhost:5173`
