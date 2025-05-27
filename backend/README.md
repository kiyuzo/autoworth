# AutoWorth Backend

Flask REST API for car price prediction.

## Setup

1. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run the server:
```bash
python app.py
```

## API Endpoints

- `GET /api/health` - Health check and model status
- `POST /api/predict` - Car price prediction (requires model file)
- `POST /api/mock-predict` - Mock prediction for testing

## Model File

The car price prediction model (`car_price_model.pkl`) should be placed in the `../API/` directory. If not available, the API will fall back to mock predictions.

## Request Format

```json
{
  "year": 2020,
  "mileage": 50000,
  "engine_size": 2.0,
  "fuel_type": 1,
  "transmission": 1
}
```

## Response Format

```json
{
  "predicted_price": 15000.0,
  "currency": "USD"
}
```
