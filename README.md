# AutoWorth - Car Value Predictor

A full-stack application that predicts car values using machine learning.

## Features

- React/Next.js frontend with TypeScript
- Flask backend with scikit-learn
- Real-time car value predictions
- Responsive design with Tailwind CSS

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Create a virtual environment:

   ```bash
   python -m venv venv
   ```

3. Activate the virtual environment:

   ```bash
   # Windows
   venv\Scripts\activate
   # macOS/Linux
   source venv/bin/activate
   ```

4. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

### Frontend Setup

1. Install Node.js dependencies:

   ```bash
   npm install
   ```

### Running the Application

1. Start both frontend and backend:

   ```bash
   npm run dev:all
   ```

   Or run them separately:

2. Start the backend (in one terminal):

   ```bash
   npm run backend
   ```

3. Start the frontend (in another terminal):

   ```bash
   npm run dev
   ```

The application will be available at:

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Usage

1. Fill in the car details (make, model, year, mileage, condition)
2. Click "Get Price Prediction"
3. View the predicted value and confidence score

## Technology Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Flask, scikit-learn, NumPy
- **Development**: ESLint, PostCSS

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

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

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
