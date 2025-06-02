// autoworth/app/api/predict/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { brand, model, trim, year, mileage } = await request.json();
    
    // For now, return mock data - replace with actual ML model call
    const mockPrice = Math.floor(Math.random() * 50000) + 10000;
    
    return NextResponse.json({ 
      price: mockPrice,
      confidence: 0.85 
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Prediction failed' }, 
      { status: 500 }
    );
  }
}