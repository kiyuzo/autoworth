from flask import Flask, request, jsonify, session
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import pickle
import os
from datetime import datetime
import warnings

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key-change-this'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///autoworth.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
CORS(app, supports_credentials=True)

# Suppress all warnings
warnings.filterwarnings("ignore")

# User model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(120), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

# Prediction history model
class PredictionHistory(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    brand = db.Column(db.String(50), nullable=False)
    model = db.Column(db.String(50), nullable=False)
    trim = db.Column(db.String(50), nullable=False)
    year = db.Column(db.Integer, nullable=False)
    mileage = db.Column(db.Integer, nullable=False)
    predicted_price = db.Column(db.Float, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

# Load ML model with version compatibility handling
def load_model():
    model_path = os.path.join(os.path.dirname(__file__), '..', 'API', 'car_price_model.pkl')
    
    if os.path.exists(model_path):
        try:
            with warnings.catch_warnings():
                warnings.simplefilter("ignore")
                with open(model_path, 'rb') as file:
                    model = pickle.load(file)
                    print("ML model loaded successfully (with version warnings suppressed)")
                    return model
        except Exception as e:
            print(f"Could not load ML model: {e}")
            print("Using fallback prediction method")
            return None
    else:
        print("Model file not found. Please ensure car_price_model.pkl is available.")
        return None

model = load_model()

# Enhanced fallback prediction based on car data
def fallback_predict(brand, model_name, year, mileage):
    # Brand value multipliers
    brand_multipliers = {
        'toyota': 1.1, 'honda': 1.05, 'bmw': 1.3, 'mercedes': 1.4,
        'audi': 1.25, 'lexus': 1.2, 'ford': 0.9, 'chevrolet': 0.85,
        'nissan': 0.95, 'hyundai': 0.9, 'kia': 0.85
    }
    
    base_price = 25000
    brand_multiplier = brand_multipliers.get(brand.lower(), 1.0)
    
    # Age depreciation (more realistic)
    age = 2024 - year
    age_depreciation = age * 1500 if age <= 5 else (5 * 1500) + ((age - 5) * 2000)
    
    # Mileage depreciation
    mileage_depreciation = mileage * 0.12
    
    # Calculate final price
    predicted_price = (base_price * brand_multiplier) - age_depreciation - mileage_depreciation
    
    return max(predicted_price, 3000)  # Minimum value

@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    
    if not data or not data.get('username') or not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Missing required fields'}), 400
    
    if User.query.filter_by(username=data['username']).first():
        return jsonify({'error': 'Username already exists'}), 400
    
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already exists'}), 400
    
    user = User(
        username=data['username'],
        email=data['email'],
        password_hash=generate_password_hash(data['password'])
    )
    
    db.session.add(user)
    db.session.commit()
    
    session['user_id'] = user.id
    session['username'] = user.username
    
    return jsonify({
        'message': 'User registered successfully',
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email
        }
    }), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if not data or not data.get('username') or not data.get('password'):
        return jsonify({'error': 'Missing username or password'}), 400
    
    user = User.query.filter_by(username=data['username']).first()
    
    if user and check_password_hash(user.password_hash, data['password']):
        session['user_id'] = user.id
        session['username'] = user.username
        
        return jsonify({
            'message': 'Login successful',
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email
            }
        }), 200
    
    return jsonify({'error': 'Invalid username or password'}), 401

@app.route('/api/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({'message': 'Logout successful'}), 200

@app.route('/api/predict', methods=['POST'])
def predict_price():
    if 'user_id' not in session:
        return jsonify({'error': 'Authentication required'}), 401
    
    data = request.get_json()
    
    if not data or not all(key in data for key in ['brand', 'model', 'trim', 'year', 'mileage']):
        return jsonify({'error': 'Missing required fields'}), 400
    
    try:
        if model:
            # Try to use the ML model (may have version warnings)
            try:
                import numpy as np
                features = np.array([[data['year'], data['mileage']]])
                predicted_price = model.predict(features)[0]
                using_fallback = False
            except Exception as e:
                print(f"ML model prediction failed: {e}")
                predicted_price = fallback_predict(data['brand'], data['model'], data['year'], data['mileage'])
                using_fallback = True
        else:
            # Use enhanced fallback prediction
            predicted_price = fallback_predict(data['brand'], data['model'], data['year'], data['mileage'])
            using_fallback = True
        
        prediction = PredictionHistory(
            user_id=session['user_id'],
            brand=data['brand'],
            model=data['model'],
            trim=data['trim'],
            year=data['year'],
            mileage=data['mileage'],
            predicted_price=float(predicted_price)
        )
        
        db.session.add(prediction)
        db.session.commit()
        
        return jsonify({
            'predicted_price': float(predicted_price),
            'car_details': {
                'brand': data['brand'],
                'model': data['model'],
                'trim': data['trim'],
                'year': data['year'],
                'mileage': data['mileage']
            },
            'using_fallback': using_fallback
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Prediction failed: {str(e)}'}), 500

@app.route('/api/history', methods=['GET'])
def get_prediction_history():
    if 'user_id' not in session:
        return jsonify({'error': 'Authentication required'}), 401
    
    predictions = PredictionHistory.query.filter_by(user_id=session['user_id']).order_by(
        PredictionHistory.created_at.desc()
    ).all()
    
    history = []
    for pred in predictions:
        history.append({
            'id': pred.id,
            'brand': pred.brand,
            'model': pred.model,
            'trim': pred.trim,
            'year': pred.year,
            'mileage': pred.mileage,
            'predicted_price': pred.predicted_price,
            'created_at': pred.created_at.isoformat()
        })
    
    return jsonify({'history': history}), 200

@app.route('/api/user', methods=['GET'])
def get_current_user():
    if 'user_id' not in session:
        return jsonify({'error': 'Not authenticated'}), 401
    
    user = User.query.get(session['user_id'])
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    return jsonify({
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email
        }
    }), 200

@app.route('/')
def home():
    return jsonify({
        'message': 'Autoworth Car Price Prediction API',
        'version': '1.0.0',
        'endpoints': {
            'POST /api/register': 'Register a new user',
            'POST /api/login': 'Login user',
            'POST /api/logout': 'Logout user',
            'GET /api/user': 'Get current user info',
            'POST /api/predict': 'Predict car price',
            'GET /api/history': 'Get prediction history'
        },
        'status': 'running',
        'ml_model_status': 'fallback' if model is None else 'loaded'
    })

@app.route('/api')
def api_info():
    return jsonify({
        'message': 'Autoworth API',
        'available_endpoints': [
            'POST /api/register',
            'POST /api/login', 
            'POST /api/logout',
            'GET /api/user',
            'POST /api/predict',
            'GET /api/history'
        ]
    })

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'model_loaded': model is not None
    })

@app.route('/api/mock-predict', methods=['POST'])
def mock_predict():
    """Mock prediction endpoint for testing when model is not available"""
    try:
        data = request.get_json()
        
        # Mock calculation based on simple rules
        base_price = 20000
        year = data.get('year', 2020)
        mileage = data.get('mileage', 50000)
        
        # Simple mock calculation
        age_factor = max(0, 2024 - year) * 1000
        mileage_factor = mileage * 0.1
        
        mock_price = base_price - age_factor - mileage_factor
        mock_price = max(5000, mock_price)  # Minimum price
        
        return jsonify({
            'predicted_price': float(mock_price),
            'currency': 'USD',
            'note': 'This is a mock prediction. Real model not loaded.'
        })
        
    except Exception as e:
        return jsonify({
            'error': f'Mock prediction failed: {str(e)}'
        }), 500

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, port=5000)
