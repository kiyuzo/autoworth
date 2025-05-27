# AutoWorth - Car Price Prediction App

A full-stack web application that predicts car prices using machine learning, built with Next.js frontend and Flask backend.

## Features

- **User Authentication**: Register, login, and logout functionality
- **Car Price Prediction**: ML-powered price predictions for vehicles
- **Prediction History**: Track all your previous predictions
- **Responsive Design**: Works on desktop and mobile devices
- **Session Management**: Secure user sessions with Flask

## Tech Stack

### Frontend
- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Hooks** - State management

### Backend
- **Flask** - Python web framework
- **SQLAlchemy** - Database ORM
- **SQLite** - Database
- **Pickle** - ML model serialization
- **Flask-CORS** - Cross-origin resource sharing

## Project Structure

```
y:\07\autoworthbackend\
├── backend/
│   ├── app.py              # Flask application
│   └── autoworth.db        # SQLite database (created automatically)
├── API/
│   └── car_price_model.pkl # Machine learning model
├── src/
│   └── app/
│       ├── layout.tsx      # Root layout
│       ├── page.tsx        # Main page component
│       └── globals.css     # Global styles
├── package.json            # Dependencies
├── next.config.ts          # Next.js configuration
├── tailwind.config.js      # Tailwind configuration
└── tsconfig.json          # TypeScript configuration
```

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- Python (v3.8 or higher)
- pip (Python package manager)

### 1. Install Dependencies

#### Frontend (Next.js)
```bash
npm install
```

#### Backend (Flask)
```bash
cd backend
pip install flask flask-sqlalchemy flask-cors werkzeug pickle
```

### 2. Place ML Model
Place your trained model file as:
```
y:\07\autoworthbackend\API\car_price_model.pkl
```

### 3. Start the Application

#### Start Backend (Flask)
```bash
cd backend
python app.py
```
Backend will run on http://localhost:5000

#### Start Frontend (Next.js)
```bash
npm run dev
```
Frontend will run on http://localhost:3000

## API Endpoints

### Authentication
- `POST /api/register` - Register new user
- `POST /api/login` - User login
- `POST /api/logout` - User logout
- `GET /api/user` - Get current user info

### Predictions
- `POST /api/predict` - Get car price prediction
- `GET /api/history` - Get prediction history

### Health Check
- `GET /api/health` - Check API health
- `GET /api/mock-predict` - Mock prediction for testing

## Usage

1. **Register/Login**: Create an account or sign in
2. **Enter Car Details**: Provide brand, model, trim, year, and mileage
3. **Get Prediction**: Click to get AI-powered price prediction
4. **View History**: See all your previous predictions

## Development

### Running in Development Mode
```bash
# Start both frontend and backend
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

## Environment Variables

Create `.env.local` for frontend configuration:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## Features in Detail

### Machine Learning Integration
- Uses trained pickle model for price predictions
- Fallback calculation when model unavailable
- Enhanced fallback with brand-specific multipliers

### User Management
- Secure password hashing
- Session-based authentication
- User-specific prediction history

### Frontend Features
- Responsive design with Tailwind CSS
- Real-time form validation
- Loading states and error handling
- Clean, modern UI/UX

## Troubleshooting

### Common Issues

1. **CORS Errors**: Make sure Flask CORS is properly configured
2. **Model Loading**: Ensure car_price_model.pkl is in the correct location
3. **Port Conflicts**: Change ports in configuration if needed
4. **Database Issues**: Delete autoworth.db to reset database

### Development Tips
- Use browser dev tools for debugging
- Check Flask console for backend errors
- Verify API endpoints with tools like Postman

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
