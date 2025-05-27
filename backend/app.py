from flask import Flask, request, jsonify, session
from flask_cors import CORS
import hashlib
import os
from datetime import datetime
import random

app = Flask(__name__)
app.secret_key = os.environ.get('SECRET_KEY', 'your-secret-key-here')

# Configure CORS to allow credentials
CORS(app, supports_credentials=True, origins=['http://localhost:3000'])

# In-memory user storage (replace with database in production)
users = {}

def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

def generate_mock_prediction(brand, model_name, trim, year, mileage):
    """Generate a realistic mock prediction for development/testing"""
    # Set seed based on car details for consistent results
    seed = hash(f"{brand}{model_name}{trim}{year}{mileage}") % 10000
    random.seed(seed)
    
    # Base prices by brand (realistic market values)
    brand_base_prices = {
        'toyota': random.randint(22000, 28000),
        'honda': random.randint(21000, 27000), 
        'ford': random.randint(19000, 25000),
        'chevrolet': random.randint(18000, 24000),
        'bmw': random.randint(40000, 55000),
        'mercedes': random.randint(45000, 65000),
        'audi': random.randint(38000, 52000),
        'nissan': random.randint(20000, 26000),
        'hyundai': random.randint(17000, 23000),
        'kia': random.randint(16000, 22000),
        'volkswagen': random.randint(21000, 28000),
        'mazda': random.randint(19000, 25000),
        'subaru': random.randint(22000, 29000)
    }
    
    # Calculate base price
    base_price = brand_base_prices.get(brand.lower(), random.randint(20000, 30000))
    
    # Age depreciation
    current_year = datetime.now().year
    car_age = current_year - year
    depreciation_rate = random.uniform(0.12, 0.18)  # 12-18% per year
    age_factor = max(0.2, (1 - depreciation_rate) ** car_age)  # Minimum 20% of original value
    price = base_price * age_factor
    
    # Mileage factor
    mileage_penalty = mileage * random.uniform(0.03, 0.07)  # $0.03-0.07 per mile
    price -= mileage_penalty
    
    # Market condition randomness
    market_factor = random.uniform(0.9, 1.1)  # ±10% market variation
    price *= market_factor
    
    # Ensure minimum price
    price = max(price, random.randint(3000, 8000))
    
    # Round to reasonable amounts
    if price < 10000:
        price = random.randint(int(price * 0.9), int(price * 1.1))
    elif price < 25000:
        price = round(price / 500) * 500  # Round to nearest $500
    else:
        price = round(price / 1000) * 1000  # Round to nearest $1000
    
    return int(price)

# Initialize with a test user
def init_test_user():
    test_email = "test@example.com"
    test_password = "123456"
    
    users[test_email] = {
        'id': 1,
        'username': 'Test User',
        'email': test_email,
        'password': hash_password(test_password),
        'created_at': datetime.now().isoformat()
    }
    print(f"Test user created: {test_email} / {test_password}")

@app.route('/api/guest-login', methods=['POST'])
def guest_login():
    """Allow guest access without registration"""
    try:
        guest_id = f"guest_{datetime.now().timestamp()}"
        session['user_id'] = guest_id
        session['is_guest'] = True
        session['username'] = 'Guest User'
        
        return jsonify({
            'success': True,
            'user': {
                'id': guest_id,
                'username': 'Guest User',
                'email': None,
                'is_guest': True
            }
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        
        if not username or not email or not password:
            return jsonify({'success': False, 'error': 'All fields are required'}), 400
        
        if email in users:
            return jsonify({'success': False, 'error': 'User already exists'}), 400
        
        users[email] = {
            'id': len(users) + 1,
            'username': username,
            'email': email,
            'password': hash_password(password),
            'created_at': datetime.now().isoformat()
        }
        
        session['user_id'] = users[email]['id']
        session['email'] = email
        
        return jsonify({
            'success': True,
            'user': {
                'id': users[email]['id'],
                'username': username,
                'email': email
            }
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        
        if not username or not password:
            return jsonify({'success': False, 'error': 'Email and password are required'}), 400
        
        if username not in users:
            return jsonify({'success': False, 'error': 'Invalid credentials'}), 401
        
        user = users[username]
        expected_hash = hash_password(password)
        
        if user['password'] != expected_hash:
            return jsonify({'success': False, 'error': 'Invalid credentials'}), 401
        
        session['user_id'] = user['id']
        session['email'] = username
        
        return jsonify({
            'success': True,
            'user': {
                'id': user['id'],
                'username': user['username'],
                'email': user['email']
            }
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/user', methods=['GET'])
def get_user():
    try:
        if 'user_id' not in session:
            return jsonify({'success': False, 'error': 'Not authenticated'}), 401
        
        if session.get('is_guest'):
            return jsonify({
                'success': True,
                'user': {
                    'id': session['user_id'],
                    'username': session.get('username', 'Guest User'),
                    'email': None,
                    'is_guest': True
                }
            })
        
        email = session.get('email')
        if email not in users:
            return jsonify({'success': False, 'error': 'User not found'}), 404
        
        user = users[email]
        return jsonify({
            'success': True,
            'user': {
                'id': user['id'],
                'username': user['username'],
                'email': user['email'],
                'is_guest': False
            }
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/logout', methods=['POST'])
def logout():
    try:
        session.clear()
        return jsonify({'success': True, 'message': 'Logged out successfully'})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/predict', methods=['POST'])
def predict_price():
    try:
        # Always generate a prediction and store in session
        data = request.get_json()
        brand = data.get('brand', 'Toyota')
        model = data.get('model', 'Camry')
        trim = data.get('trim', 'LE')
        year = data.get('year', 2020)
        mileage = data.get('mileage', 50000)
        
        # Convert to proper types
        try:
            year = int(year)
            mileage = int(mileage)
        except:
            year = 2020
            mileage = 50000
        
        # Generate mock prediction
        predicted_price = generate_mock_prediction(brand, model, trim, year, mileage)
        
        # Store prediction in session for result page
        session['last_prediction'] = {
            'brand': brand,
            'model': model,
            'trim': trim,
            'year': year,
            'mileage': mileage,
            'predicted_price': predicted_price,
            'is_mock': True,
            'prediction_method': 'mock',
            'timestamp': datetime.now().isoformat()
        }
        
        print(f"Mock prediction generated: ${predicted_price} for {year} {brand} {model} {trim}")
        
        # Always return success to redirect to result page
        return jsonify({
            'success': True,
            'predicted_price': predicted_price,
            'car_details': {
                'brand': brand,
                'model': model,
                'trim': trim,
                'year': year,
                'mileage': mileage
            },
            'is_mock': True,
            'prediction_method': 'mock',
            'message': 'Mock prediction generated successfully'
        })
        
    except Exception as e:
        print(f"Prediction error: {str(e)}")
        # Even on error, generate a fallback prediction
        predicted_price = random.randint(15000, 35000)
        session['last_prediction'] = {
            'brand': 'Unknown',
            'model': 'Unknown',
            'trim': 'Unknown',
            'year': 2020,
            'mileage': 50000,
            'predicted_price': predicted_price,
            'is_mock': True,
            'prediction_method': 'emergency_mock',
            'timestamp': datetime.now().isoformat()
        }
        
        return jsonify({
            'success': True,
            'predicted_price': predicted_price,
            'is_mock': True,
            'prediction_method': 'emergency_mock',
            'message': 'Emergency prediction generated'
        })

@app.route('/api/get-prediction', methods=['GET'])
def get_prediction():
    """Get the last prediction for the result page"""
    try:
        prediction = session.get('last_prediction')
        if not prediction:
            # Generate a default prediction if none exists
            prediction = {
                'brand': 'Toyota',
                'model': 'Camry',
                'trim': 'LE',
                'year': 2020,
                'mileage': 50000,
                'predicted_price': random.randint(20000, 30000),
                'is_mock': True,
                'prediction_method': 'default_mock',
                'timestamp': datetime.now().isoformat()
            }
            session['last_prediction'] = prediction
        
        return jsonify({
            'success': True,
            'prediction': prediction
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/debug', methods=['GET'])
def debug():
    """Debug endpoint to check server status"""
    return jsonify({
        'success': True,
        'message': 'Backend server is running',
        'session_data': dict(session),
        'users_count': len(users)
    })

if __name__ == '__main__':
    print("Starting Flask server...")
    init_test_user()
    print("Available endpoints:")
    print("  POST /api/login")
    print("  POST /api/register") 
    print("  POST /api/guest-login")
    print("  GET /api/user")
    print("  POST /api/logout")
    print("  POST /api/predict")
    print("  GET /api/get-prediction")
    print("  GET /api/debug")
    print("\nMock prediction system enabled - always returns success")
    app.run(debug=True, port=5000)
