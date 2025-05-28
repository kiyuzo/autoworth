import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from services.prediction_service import PredictionService
from utils.data_processing import validate_car_data

app = Flask(__name__)
CORS(app, origins=['http://localhost:3000', 'https://*.vercel.app'])

# Initialize prediction service
prediction_service = PredictionService()

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'model_loaded': prediction_service.is_model_loaded(),
        'version': '1.0.0'
    })

@app.route('/predict', methods=['POST'])
def predict_car_price():
    try:
        data = request.get_json()
        if not data:
            return jsonify({
                'error': 'No data provided',
                'success': False
            }), 400

        validation_result = validate_car_data(data)
        if not validation_result['valid']:
            return jsonify({
                'error': validation_result['message'],
                'success': False
            }), 400

        result = prediction_service.predict(data)
        
        return jsonify({
            'predicted_price': result['price'],
            'formatted_price': f"${result['price']:,.2f}",
            'confidence_score': result.get('confidence', 0.85),
            'input_data': data,
            'success': True
        })

    except Exception as e:
        app.logger.error(f"Prediction error: {str(e)}")
        return jsonify({
            'error': f'Prediction failed: {str(e)}',
            'success': False
        }), 500

@app.route('/model-info', methods=['GET'])
def get_model_info():
    return jsonify({
        'model_type': prediction_service.get_model_type(),
        'features': prediction_service.get_expected_features(),
        'training_date': '2024-01-15',
        'version': '1.0.0'
    })

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_DEBUG', 'False').lower() == 'true'
    app.run(host='0.0.0.0', port=port, debug=debug)