from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
import joblib
import os

app = Flask(__name__)
CORS(app)

# Load your trained model
MODEL_PATH = 'model.pkl'  # Put your pkl file here
try:
    model = joblib.load(MODEL_PATH)
    print("Model loaded successfully!")
except Exception as e:
    print(f"Error loading model: {e}")
    model = None

def preprocess_input(brand, model_name, trim, year, mileage):
    """
    Preprocess input data to match your model's expected format.
    Adjust this function based on how your model was trained.
    """
    # Create a dictionary with the features your model expects
    data = {
        'brand': brand,
        'model': model_name,
        'trim': trim,
        'year': year,
        'mileage': mileage
    }
    
    # Convert to DataFrame (adjust columns based on your model)
    df = pd.DataFrame([data])
    
    # Add any feature engineering your model needs
    # For example:
    current_year = 2024
    df['age'] = current_year - df['year']
    df['mileage_per_year'] = df['mileage'] / df['age'].replace(0, 1)
    
    # Add brand encoding if your model uses it
    brand_mapping = {
        'Toyota': 1, 'Honda': 2, 'BMW': 3, 'Mercedes-Benz': 4,
        'Audi': 5, 'Lexus': 6, 'Hyundai': 7, 'KIA': 8,
        'Nissan': 9, 'Mazda': 10, 'Mitsubishi': 11, 'Suzuki': 12
    }
    df['brand_encoded'] = df['brand'].map(brand_mapping).fillna(0)
    
    # Return the features your model expects
    # Adjust these column names based on your model's training data
    feature_columns = ['year', 'mileage', 'age', 'mileage_per_year', 'brand_encoded']
    
    return df[feature_columns]

@app.route('/api/predict', methods=['POST'])
def predict_price():
    try:
        if model is None:
            return jsonify({'error': 'Model not loaded'}), 500
            
        data = request.get_json()
        
        # Validate input
        required_fields = ['brand', 'model', 'trim', 'year', 'mileage']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing field: {field}'}), 400
        
        brand = data['brand']
        model_name = data['model']
        trim = data['trim']
        year = int(data['year'])
        mileage = int(data['mileage'])
        
        # Preprocess the input
        processed_data = preprocess_input(brand, model_name, trim, year, mileage)
        
        # Make prediction
        prediction = model.predict(processed_data)[0]
        predicted_price = round(float(prediction))
        
        response = {
            'predicted_price': predicted_price,
            'car_name': f'{year} {brand} {model_name} {trim}',
            'brand': brand,
            'model': model_name,
            'trim': trim,
            'year': year,
            'mileage': mileage
        }
        
        return jsonify(response)
        
    except Exception as e:
        print(f"Prediction error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'model_loaded': model is not None})

if __name__ == '__main__':
    app.run(debug=True, port=5000)