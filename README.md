<div align="center">

# 🚗💰 Autoworth

**AI-Powered Used Car Valuation Platform**

*Empowering smart decisions in the used car market with data-driven insights*

[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![PostgreSQL](https://img.shields.io/badge/postgresql-4169e1?style=for-the-badge&logo=postgresql&logoColor=white)](https://neon.tech/)
[![Firebase](https://img.shields.io/badge/Firebase-039BE5?style=for-the-badge&logo=Firebase&logoColor=white)](https://firebase.google.com/)

</div>

---

## 🎯 Core Aim

Autoworth provides a **transparent and data-driven approach** to car valuation, leveraging AI models trained on real-world market datasets. Our mission is to help users understand the true market value of vehicles, enabling informed decisions in the used car marketplace.

## ✨ Key Features

- **🌓 Light Mode / Dark Mode:** Choose your preferred visual theme for comfortable browsing
- **🔐 User Authentication:** Secure Sign Up and Log In functionality with Firebase
- **🤖 Car Value Prediction:** Get an AI-powered estimation of your car's worth by inputting its features
- **📊 Prediction History:** Keep track of all your past car valuations

## 🏗️ Project Structure

The application is organized into the following key sections:

- **🏠 Landing Page:** The initial page users visit, introducing Autoworth
- **🔑 Sign Up / Log In:** Pages for user account creation and authentication
- **📝 Input Page:** A dedicated section for users to input the features and specifications of their car
- **🎯 Prediction Page:** Displays the AI-generated valuation of the user's car
- **📋 History Page:** Allows users to view their previously valuated cars

## 🛠️ Technology Stack

- **Frontend:** Next.js with TypeScript
- **Database:** PostgreSQL (Neon)
- **Authentication:** Firebase
- **AI/ML:** Python with scikit-learn
- **Deployment:** Vercel

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Database Setup

This project uses [Neon](https://neon.tech/) as the PostgreSQL database. The database connection is configured using a connection string.

### Environment Variables

Make sure to set up your `.env.local` file with the following variables:

```bash
DATABASE_URL=your_neon_connection_string
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id
```

## Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev 
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Database Population

To populate the database with car data, run:

```bash
npx ts-node api/scripts/populate-database.ts
```

## 👥 Development Team

<div align="center">

| Name | Role | Student ID | Specialization |
|------|------|------------|----------------|
| **Rama Andhika Pratama** | *Full Stack Developer* | 23/517333/PA/22175 | Frontend & Backend Development |
| **Michael Satpellin Williamtu** | *Full Stack Developer* | 23/517103/PA/22151 | Frontend & Backend Development |
| **Tristan Khayru Abiyudha** | *AI/UX Developer* | 23/511504/PA/21811 | UI/UX Design & AI Implementation |
| **Bagus Aryajatmiko** | *Project Manager* | 23/516205/PA/22067 | Project Management & UI/UX |
| **Vaughn Daniel Kenneth** | *Security/UX Specialist* | 23/511655/PA/21839 | Cybersecurity & UI/UX Design |

</div>

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

<div align="center">

**Made with ❤️ by the Autoworth Team**

*Transforming car valuation through AI innovation*

</div>
