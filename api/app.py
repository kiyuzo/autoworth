from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
import joblib
import os

app = Flask(__name__)
CORS(app) 

MODEL_PATH = 'model.pkl' 
try:
    model = joblib.load(MODEL_PATH)
    print("Model loaded successfully!")
    print(f"Model type: {type(model)}")
except Exception as e:
    print(f"Error loading model: {e}")
    model = None

def preprocess_input(brand, model_name, trim, year, mileage):
    """
    Preprocess input data to match your model's expected format.
    Your model expects exactly these features: ['year', 'make_name', 'model_name', 'mileage', 'trim_name']
    """
    data = {
        'year': year,
        'make_name': brand,        
        'model_name': model_name,  
        'mileage': mileage,
        'trim_name': trim         
    }
    
    features = ['year', 'make_name', 'model_name', 'mileage', 'trim_name']
    df = pd.DataFrame([data])
    
    df = df[features]
    
    return df

@app.route('/api/predict', methods=['POST'])
def predict_price():
    try:
        if model is None:
            return jsonify({'error': 'Model not loaded'}), 500
            
        data = request.get_json()
        print(f"Received data: {data}") 

        required_fields = ['brand', 'model', 'trim', 'year', 'mileage']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing field: {field}'}), 400
        
        brand = data['brand']
        model_name = data['model']
        trim = data['trim']
        year = int(data['year'])
        mileage = int(data['mileage'])
        
        print(f"Processing: {brand} {model_name} {trim} {year} {mileage}")  
        
        # Preprocess the input
        processed_data = preprocess_input(brand, model_name, trim, year, mileage)
        print(f"Processed data columns: {processed_data.columns.tolist()}")  
        print(f"Processed data:\n{processed_data}")  
        
        # Make prediction
        prediction = model.predict(processed_data)[0]
        predicted_price = round(float(prediction))
        
        print(f"Prediction: {predicted_price}")  
        
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
        import traceback
        traceback.print_exc()  
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy', 
        'model_loaded': model is not None,
        'model_type': str(type(model)) if model else None
    })

@app.route('/model-info', methods=['GET'])
def model_info():
    try:
        if model is None:
            return jsonify({'error': 'Model not loaded'}), 500
        
        feature_names = None
        if hasattr(model, 'feature_names_in_'):
            feature_names = model.feature_names_in_.tolist()
        elif hasattr(model, 'get_booster') and hasattr(model.get_booster(), 'feature_names'):
            feature_names = model.get_booster().feature_names
        
        return jsonify({
            'model_type': str(type(model)),
            'feature_names': feature_names,
            'expected_features': ['year', 'make_name', 'model_name', 'mileage', 'trim_name'],
            'has_feature_names': feature_names is not None
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000, host='0.0.0.0')