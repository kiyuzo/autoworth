import os
import pickle

class PredictionService:
    def __init__(self):
        model_path = os.path.join(os.path.dirname(__file__), '..', '..', 'models', 'car_price_model.pkl')
        self.model = None
        self.load_model(model_path)

    def load_model(self, model_path):
        try:
            with open(model_path, 'rb') as f:
                self.model = pickle.load(f)
        except Exception as e:
            print(f"Failed to load model: {e}")
            self.model = None

    def is_model_loaded(self):
        return self.model is not None

    def predict(self, data):
        # Prepare input in the order: brand, model, trim, year, mileage
        # You may need to encode categorical variables as your model expects
        # Here, we just pass values as a list (adjust as needed)
        input_features = [
            data.get('brand'),
            data.get('model'),
            data.get('trim'),
            data.get('year'),
            data.get('mileage')
        ]
        # Reshape for a single prediction
        input_array = [input_features]
        price = self.model.predict(input_array)[0]
        return {
            'price': float(price),
            'confidence': 0.85  # Placeholder
        }

    def get_model_type(self):
        return type(self.model).__name__ if self.model else "Unknown"

    def get_expected_features(self):
        return ['brand', 'model', 'trim', 'year', 'mileage']