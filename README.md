# TaskMaster Pro - Full Stack Task Management Application

A production-ready task management application built with **Next.js 15**, **MongoDB**, and **TypeScript**, demonstrating advanced security practices and clean architecture.

## 🚀 Live Demo
[Link to your deployed application]

## 🏗️ Architecture Overview

The project follows a modular and clean architecture using the **Next.js App Router**:

- **Frontend**: React with custom CSS design system (Vanilla CSS) for maximum performance and premium aesthetics.
- **Backend**: Next.js API Routes (Serverless) handling business logic and data persistence.
- **Database**: MongoDB with Mongoose for schema-based modeling.
- **Security Layer**: 
  - **JWT Authentication**: Secure token-based access.
  - **HTTP-Only Cookies**: Tokens are stored in secure cookies to prevent XSS.
  - **AES Encryption**: Utility provided for encrypting sensitive payload fields.
  - **Password Hashing**: Bcryptjs implementation for user protection.
  - **Input Validation**: Server-side validation for all CRUD operations.

## ✨ Features

- **Auth**: Secure Register, Login, and Session management.
- **Task CRUD**: Create, Read, Update, and Delete tasks.
- **Advanced Filtering**: Filter by status (Pending, In-Progress, Completed).
- **Search**: Real-time search by task title.
- **Pagination**: Optimized data fetching for large task lists.
- **Responsive Design**: Premium dark-mode UI that works on all devices.

## 🛠️ Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Database**: MongoDB (via Atlas)
- **Styling**: Custom CSS (Glassmorphism design)
- **Icons**: Lucide React
- **Security**: JWT (jose), BcryptJS, CryptoJS

## 🏁 Getting Started

1. **Clone the repository**:
   ```bash
   git clone [your-repo-link]
   cd intrenship-project
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env.local` file based on `.env.example`:
   ```env
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   ENCRYPTION_KEY=your_encryption_key
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔒 Security Implementation Details

- **Secure Session**: Uses `jose` for edge-compatible JWT handling.
- **Cookie Security**: `httpOnly`, `secure`, and `sameSite: 'strict'` flags are used to harden authentication.
- **Payload Protection**: Includes utilities to encrypt/decrypt sensitive data using AES-256 before transmission where required.
- **Authorization**: Strict checks to ensure users can only access their own data (`userId` owner checks on all CRUD operations).

## 📄 API Documentation

Refer to `API_DOCS.md` for detailed endpoint request/response samples.
