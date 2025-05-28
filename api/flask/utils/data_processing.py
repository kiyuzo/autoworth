def validate_car_data(data):
    required_fields = ['brand', 'model', 'trim', 'year', 'mileage']
    missing = [field for field in required_fields if field not in data or data[field] in [None, '']]
    if missing:
        return {
            'valid': False,
            'message': f"Missing or empty fields: {', '.join(missing)}"
        }
    # Optionally, add more validation (e.g., year is int, mileage is positive)
    if not isinstance(data['year'], int) or data['year'] < 1900:
        return {
            'valid': False,
            'message': "Year must be a valid integer (>= 1900)"
        }
    if not isinstance(data['mileage'], (int, float)) or data['mileage'] < 0:
        return {
            'valid': False,
            'message': "Mileage must be a non-negative number"
        }
    return {'valid': True}