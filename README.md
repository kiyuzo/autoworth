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

- **Frontend:** Next.js with TypeScript, Tailwind CSS, and ESlint
- **Backend:** Node.JS and Flask/Python
- **Database:** PostgreSQL (Neon)
- **AI/ML:** Python with scikit-learn
- **Authentication:** Firebase


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
and also the pickle model with excact file name: `model.pkl`

## Getting Started

First, install the dependencies on the root folder and API folder:

```bash
npm install
cd /api/
npm install
```

Second, install the requirements to run the model :

```bash
cd /api/
pip install -r requirements.txt
```

Then, don't forget to put the `.env.local` file in the root folder and `model.pkl` file in the /api/ folder. Here is how the files suppose to be structured:
autoworth/
├── .env.local                    ← .env.local file here
├── .gitignore
├── eslint.config.mjs
├── next-env.d.ts
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── README.md
├── tsconfig.json
├── .next/
├── api/
│   ├── .gitignore
│   ├── app.py
│   ├── carPrediction.ts
│   ├── model.pkl               ← model.pkl file here
│   ├── package.json
│   ├── requirements.txt
│   ├── server.js
│   ├── predict/
│   └── scripts/
├── app/
├── components/
├── contexts/
├── lib/
└── public/

Finally, run the development servers:

```bash
#For python
cd /api/
venv/Scripts/activate
python app.py

#add a new terminal

#for node
cd /api/
node server.js

#add new terminal

#for next.js
npm run dev

```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.


## Database Population

To populate the database with car data, run:

```bash
npx ts-node api/scripts/populate-database.ts
```

P.S This step isn't necessary unless you want to use your own database

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

<div align="center">

**Made with ❤️ and ☕ by our Team**

</div>
