'use client';

import { useState, useRef } from "react";
import { useRouter } from 'next/navigation';
import { predictCarPrice, PredictionRequest } from '../api/carPrediction';

// Car Data
const carData = {
  Audi: {
    models: {
      "A3": [
        "1.8T Premium Cabriolet FWD",
        "1.8T Premium Sedan FWD",
        "2.0T Premium Sedan FWD",
        "2.0T quattro Premium Plus Sedan AWD",
        "2.0T quattro Premium Sedan AWD",
        "2.0T quattro Sport Premium Plus S Sedan AWD",
        "2.0T quattro Sport Premium S Sedan AWD"
      ],
      "A3 Sportback": [
        "e-tron 1.4T Premium FWD"
      ],
      "A4": [
        "2.0T Premium Plus Sedan FWD",
        "2.0T Premium Sedan FWD",
        "2.0T quattro Premium Plus Sedan AWD",
        "2.0T quattro Premium Sedan AWD",
        "2.0T quattro Premium Sedan Plus AWD",
        "2.0T quattro Prestige Sedan AWD",
        "2.0T quattro Sedan AWD",
        "2.0T ultra Premium Sedan FWD"
      ],
      "A4 Allroad": [
        "2.0T quattro Premium Plus AWD"
      ],
      "A5": [
        "2.0T quattro Premium Cabriolet AWD",
        "2.0T quattro Premium Coupe AWD",
        "2.0T quattro Premium Plus Cabriolet AWD",
        "2.0T quattro Premium Plus Coupe AWD",
        "2.0T quattro Prestige Coupe AWD",
        "2.0T quattro Sport Cabriolet AWD"
      ],
      "A5 Sportback": [
        "2.0T quattro Premium AWD",
        "2.0T quattro Premium Plus AWD"
      ],
      "A6": [
        "2.0T quattro Premium Plus Sedan AWD",
        "2.0T quattro Premium Sedan AWD",
        "3.0T quattro Premium Plus Sedan AWD",
        "3.0T quattro Prestige Sedan AWD"
      ],
      "A7": [
        "3.0T quattro Premium Plus AWD",
        "3.0T quattro Prestige AWD"
      ],
      "A8": [
        "3.0T quattro AWD",
        "L 3.0 TDI quattro AWD",
        "L 3.0T quattro AWD",
        "L 4.0T quattro AWD",
        "L 4.0T quattro Sport AWD",
        "L quattro AWD"
      ],
      "Q3": [
        "2.0T Premium FWD",
        "2.0T Premium Plus FWD",
        "2.0T quattro Premium AWD",
        "2.0T quattro Premium Plus AWD",
        "2.0T quattro Premium Plus S Line AWD",
        "2.0T quattro Premium S Line AWD",
        "2.0T quattro Prestige AWD",
        "2.0T quattro Prestige S Line AWD"
      ],
      "Q5": [
        "2.0T quattro Premium AWD",
        "2.0T quattro Premium Plus AWD",
        "2.0T quattro Prestige AWD",
        "2.0T quattro Titanium Premium AWD",
        "2.0T quattro Titanium Premium Plus AWD",
        "3.0 TDI quattro Premium Plus AWD",
        "3.0T quattro Premium Plus AWD",
        "3.2 quattro Premium Plus AWD",
        "3.2 quattro Prestige AWD"
      ],
      "Q7": [
        "2.0T quattro Premium AWD",
        "2.0T quattro Premium Plus AWD",
        "3.0 TDI quattro Premium Plus AWD",
        "3.0 TDI quattro Prestige AWD",
        "3.0T quattro Premium AWD",
        "3.0T quattro Premium Plus AWD",
        "3.0T quattro Prestige AWD",
        "3.0T quattro S-Line Prestige AWD"
      ],
      "Q8": [
        "3.0T quattro Premium AWD",
        "3.0T quattro Premium Plus AWD",
        "3.0T quattro Prestige AWD",
        "3.0t quattro Prestige AWD"
      ],
      "R8": [
        "4.2 quattro Coupe AWD",
        "V10 RWS Coupe RWD",
        "quattro V10 Performance Coupe AWD"
      ],
      "RS 3": [
        "2.5T quattro AWD"
      ],
      "RS 5": [
        "quattro Coupe AWD"
      ],
      "RS 5 Sportback": [
        "2.9T quattro AWD"
      ],
      "S3": [
        "2.0T quattro Premium Plus AWD"
      ],
      "S4": [
        "2005.5 quattro Sedan AWD",
        "3.0T quattro Premium Plus Sedan AWD",
        "3.0T quattro Prestige Sedan AWD"
      ],
      "S5": [
        "3.0T quattro Premium Plus Coupe AWD",
        "3.0T quattro Prestige Cabriolet AWD",
        "3.0T quattro Prestige Coupe AWD",
        "4.2 quattro Premium Plus Coupe AWD"
      ],
      "S5 Sportback": [
        "3.0T quattro Premium Plus AWD"
      ],
      "S6": [
        "2.9T quattro Premium Plus Sedan AWD",
        "5.2 quattro Sedan AWD"
      ],
      "S8": [
        "4.0T quattro AWD"
      ],
      "SQ5": [
        "3.0T quattro Premium Plus AWD",
        "3.0T quattro Prestige AWD"
      ],
      "TT": [
        "2.0T Coupe FWD",
        "3.2 quattro Coupe AWD",
        "3.2 quattro Roadster AWD"
      ]
    }
  },
  BMW: {
    models: {
      "1 Series": [
        "128i Convertible RWD",
        "128i Coupe RWD",
        "135i Convertible RWD"
      ],
      "2 Series": [
        "228i Convertible RWD",
        "228i xDrive Convertible AWD",
        "228i xDrive Gran Coupe AWD",
        "230i Convertible RWD",
        "230i xDrive Convertible AWD",
        "M235i Coupe RWD",
        "M235i xDrive Gran Coupe AWD"
      ],
      "3 Series": [
        "320i Sedan RWD",
        "320i xDrive Sedan AWD",
        "323Ci Convertible RWD",
        "325Ci Convertible RWD",
        "325xi Sedan AWD",
        "328d Sedan RWD",
        "328d xDrive Sedan AWD",
        "328d xDrive Wagon AWD",
        "328i Convertible RWD",
        "328i Sedan RWD",
        "328i xDrive Coupe AWD",
        "328i xDrive Sedan AWD",
        "328i xDrive Wagon AWD",
        "328xi Sedan AWD",
        "330Ci Convertible RWD",
        "330e iPerformance Sedan RWD",
        "330i RWD",
        "330i Sedan RWD",
        "330i xDrive Sedan AWD",
        "330i xDrive Wagon AWD",
        "335d Sedan RWD",
        "335i Convertible RWD",
        "335i xDrive Sedan AWD",
        "340i Sedan RWD",
        "M340i Sedan RWD"
      ],
      "3 Series Gran Turismo": [
        "330i xDrive AWD",
        "335i xDrive AWD"
      ],
      "4 Series": [
        "428i Convertible RWD",
        "428i Coupe RWD",
        "428i Gran Coupe RWD",
        "428i xDrive Coupe AWD",
        "430i Convertible RWD",
        "430i Gran Coupe RWD",
        "430i xDrive Coupe AWD",
        "430i xDrive Gran Coupe AWD",
        "435i xDrive Coupe AWD",
        "440i Convertible RWD",
        "440i Coupe RWD",
        "440i Gran Coupe RWD",
        "440i xDrive Gran Coupe AWD"
      ],
      "5 Series": [
        "525i Sedan RWD",
        "528i Sedan RWD",
        "528i xDrive Sedan AWD",
        "528xi Sedan AWD",
        "530e iPerformance Sedan RWD",
        "530e xDrive iPerformance Sedan AWD",
        "530i Sedan RWD",
        "530i xDrive Sedan AWD",
        "530xi Sedan AWD",
        "535i Sedan RWD",
        "535i xDrive Sedan AWD",
        "535xi Sedan AWD",
        "535xi Wagon AWD",
        "540i Sedan RWD",
        "540i xDrive Sedan AWD",
        "550i Sedan RWD",
        "550i xDrive Sedan AWD",
        "M550i xDrive Sedan AWD"
      ],
      "5 Series Gran Turismo": [
        "535i xDrive AWD"
      ],
      "6 Series": [
        "640i Coupe RWD",
        "640i xDrive Coupe AWD",
        "640i xDrive Gran Coupe AWD",
        "650i Convertible RWD",
        "650i Coupe RWD",
        "650i Gran Coupe RWD",
        "650i xDrive Coupe AWD",
        "650i xDrive Gran Coupe AWD"
      ],
      "7 Series": [
        "740Li RWD",
        "740i RWD",
        "740i xDrive AWD",
        "750i RWD",
        "750i xDrive AWD",
        "Alpina B7 RWD"
      ],
      "8 Series": [
        "840i Coupe RWD",
        "M850i xDrive Coupe AWD",
        "M850i xDrive Gran Coupe AWD"
      ],
      "M3": [
        "Coupe RWD",
        "Sedan RWD"
      ],
      "M4": [
        "Convertible RWD",
        "Coupe RWD"
      ],
      "M5": [
        "Competition AWD",
        "RWD"
      ],
      "M6": [
        "Convertible RWD"
      ],
      "M8": [
        "Competition Convertible AWD",
        "Competition Coupe AWD",
        "Coupe AWD"
      ],
      "X1": [
        "sDrive28i FWD",
        "sDrive28i RWD",
        "xDrive28i AWD"
      ],
      "X2": [
        "M35i AWD",
        "sDrive28i FWD",
        "xDrive28i AWD"
      ],
      "X3": [
        "3.0i AWD",
        "3.0si AWD",
        "M40i AWD",
        "sDrive28i RWD",
        "sDrive30i RWD",
        "xDrive28i AWD",
        "xDrive30e AWD",
        "xDrive30i AWD",
        "xDrive35i AWD"
      ],
      "X4": [
        "xDrive28i AWD",
        "xDrive30i AWD",
        "xDrive35i AWD"
      ],
      "X4 M": [
        "Competition AWD"
      ],
      "X5": [
        "3.0i AWD",
        "4.8i AWD",
        "sDrive35i RWD",
        "sDrive40i RWD",
        "xDrive30i AWD",
        "xDrive35d AWD",
        "xDrive35i AWD",
        "xDrive35i Premium AWD",
        "xDrive40i AWD",
        "xDrive48i AWD",
        "xDrive50i AWD"
      ],
      "X5 M": [
        "AWD",
        "Sports Activity Vehicle AWD"
      ],
      "X6": [
        "sDrive40i RWD",
        "xDrive35i AWD"
      ],
      "X6 M": [
        "AWD"
      ],
      "X7": [
        "M50i AWD",
        "xDrive40i AWD"
      ],
      "Z3": [
        "1.9 Roadster RWD",
        "3.0i Roadster RWD"
      ],
      "Z4": [
        "3.0si Roadster RWD",
        "M40i RWD",
        "sDrive28i Roadster RWD",
        "sDrive30i RWD",
        "sDrive35i Roadster RWD"
      ]
    }
  },
  Honda: {
    models: {
      "Accord": [
        "1.5T EX FWD",
        "1.5T EX-L FWD",
        "1.5T LX FWD",
        "1.5T Sport FWD",
        "1.5T Touring FWD",
        "2.0T EX-L FWD",
        "2.0T Sport FWD",
        "2.0T Touring FWD",
        "EX",
        "EX FWD",
        "EX FWD with Honda Sensing",
        "EX V6",
        "EX V6 with Nav",
        "EX with Honda Sensing",
        "EX with Leather",
        "EX-L",
        "EX-L FWD",
        "EX-L FWD with Navigation and Honda Sensing",
        "EX-L V6",
        "EX-L V6 with Nav",
        "EX-L with Honda Sensing",
        "LX",
        "LX FWD",
        "LX FWD with Honda Sensing",
        "LX with Honda Sensing",
        "LX Special Edition",
        "LX V6",
        "LX-P",
        "SE",
        "SE V6",
        "Special Edition",
        "Sport",
        "Sport FWD",
        "Sport FWD with Honda Sensing",
        "Sport SE FWD",
        "Sport with Honda Sensing",
        "Touring",
        "V6 EX-L FWD",
        "V6 EX-L FWD with Navigation and Honda Sensing",
        "V6 Touring",
        "Value Package"
      ],
      "Accord Coupe": [
        "EX",
        "EX V6",
        "EX-L",
        "EX-L V6",
        "EX-L with Nav"
      ],
      "Accord Crosstour": [
        "EX-L 4WD"
      ],
      "Accord Hybrid": [
        "EX FWD",
        "EX-L",
        "EX-L FWD",
        "FWD",
        "Touring",
        "Touring FWD"
      ],
      "CR-V": [
        "EX AWD",
        "EX FWD",
        "EX-L AWD",
        "EX-L AWD with Navigation",
        "EX-L FWD",
        "EX-L FWD with Navigation",
        "LX AWD",
        "LX FWD",
        "SE AWD",
        "SE FWD",
        "Touring AWD",
        "Touring FWD"
      ],
      "CR-V Hybrid": [
        "EX AWD",
        "EX-L AWD",
        "LX AWD",
        "Touring AWD"
      ],
      "CR-Z": [
        "EX",
        "LX"
      ],
      "Civic": [
        "DX Hatchback",
        "DX-VP",
        "EX",
        "EX Coupe FWD",
        "EX FWD",
        "EX Sedan FWD",
        "EX w/ Navigation",
        "EX with Navigation",
        "EX-L",
        "EX-L FWD",
        "EX-L Sedan FWD",
        "EX-T",
        "EX-T with Honda Sensing",
        "GX",
        "LX",
        "LX Coupe FWD",
        "LX FWD",
        "LX Sedan FWD",
        "LX with Honda Sensing",
        "LX-S",
        "SE",
        "Si",
        "Si Coupe FWD",
        "Si Coupe FWD with Summer Tires",
        "Si Sedan FWD",
        "Sport Coupe FWD",
        "Sport FWD",
        "Sport Sedan FWD",
        "Touring",
        "Touring Coupe FWD",
        "Touring FWD",
        "Touring Sedan FWD",
        "Value Package"
      ],
      "Civic Coupe": [
        "EX",
        "EX Auto",
        "EX FWD",
        "EX-L",
        "EX-T",
        "LX",
        "LX Auto",
        "LX-P",
        "SI",
        "SI with Navi and Summer Tires",
        "Si",
        "Si with Summer Tires",
        "Sport FWD",
        "Value Package"
      ],
      "Civic Hatchback": [
        "EX",
        "EX FWD",
        "EX-L FWD",
        "EX-L FWD with Navigation",
        "EX-L FWD with Navigation and Honda Sensing",
        "EX-L with Nav",
        "LX",
        "LX FWD",
        "Sport",
        "Sport FWD",
        "Sport Touring FWD"
      ],
      "Civic Hybrid": [
        "FWD with Leather"
      ],
      "Civic Type R": [
        "Touring FWD"
      ],
      "Crosstour": [
        "EX",
        "EX-L V6 AWD",
        "EX-L V6 AWD with Navi"
      ],
      "Element": [
        "EX",
        "EX AWD",
        "EX-P",
        "EX-P AWD",
        "LX",
        "LX AWD",
        "SC"
      ],
      "Fit": [
        "Base",
        "EX",
        "EX FWD",
        "EX-L",
        "EX-L FWD",
        "LX",
        "LX FWD",
        "LX with Honda Sensing",
        "Sport",
        "Sport FWD",
        "Sport with Honda Sensing",
        "Sport with Nav"
      ],
      "HR-V": [
        "EX",
        "EX AWD",
        "EX FWD",
        "EX-L AWD",
        "EX-L AWD with Navigation",
        "EX-L FWD",
        "EX-L with Nav",
        "EX-L with Nav AWD",
        "EX-L with Navigation",
        "LX",
        "LX AWD",
        "LX FWD",
        "Sport AWD",
        "Sport FWD",
        "Touring AWD"
      ],
      "Odyssey": [
        "EX FWD",
        "EX FWD with DVD",
        "EX-L FWD",
        "EX-L FWD with DVD",
        "EX-L FWD with DVD and Navigation",
        "EX-L FWD with Navigation",
        "EX-L FWD with Navigation and DVD",
        "EX-L FWD with Navigation and RES",
        "EX-L FWD with RES",
        "EX-L with Navigation and RES",
        "Elite FWD",
        "LX FWD",
        "SE FWD",
        "Touring Elite FWD",
        "Touring FWD"
      ],
      "Passport": [
        "EX-L AWD",
        "EX-L FWD",
        "Elite AWD",
        "Sport AWD",
        "Sport FWD",
        "Touring AWD",
        "Touring FWD"
      ],
      "Pilot": [
        "4 Dr EX-L 4X4",
        "Black Edition AWD",
        "EX",
        "EX 4WD",
        "EX AWD",
        "EX FWD",
        "EX-L",
        "EX-L 4WD",
        "EX-L AWD",
        "EX-L AWD with Honda Sensing",
        "EX-L AWD with Nav",
        "EX-L AWD with Navigation",
        "EX-L AWD with RES",
        "EX-L FWD",
        "EX-L FWD with Navigation",
        "EX-L FWD with RES",
        "EX-L with DVD",
        "EX-L with DVD 4WD",
        "EX-L with Honda Sensing",
        "EX-L with Nav",
        "EX-L with Nav 4WD",
        "EX-L with RES",
        "Elite AWD",
        "LX",
        "LX 4WD",
        "LX AWD",
        "LX FWD",
        "SE AWD",
        "SE FWD",
        "Touring",
        "Touring 4WD",
        "Touring 7-Seat AWD",
        "Touring 7-Seat FWD",
        "Touring 8-Seat AWD",
        "Touring 8-Seat FWD",
        "Touring AWD",
        "Touring with Nav 4WD",
        "Touring with Nav and DVD 4WD"
      ],
      "Ridgeline": [
        "Black Edition AWD",
        "RTL",
        "RTL AWD",
        "RTL FWD",
        "RTL with Moonroof, XM and Navi",
        "RTL-E AWD",
        "RTL-T AWD",
        "RTS",
        "RTX",
        "Sport",
        "Sport AWD"
      ],
      "S2000": [
        "Roadster"
      ]
    }
  },
  Hyundai: {
    models: {
      "Accent": [
        "GL 2-Door Hatchback FWD",
        "GLS Sedan FWD",
        "GS 2-Door Hatchback FWD",
        "GS 4-Door Hatchback FWD",
        "Limited Sedan FWD",
        "SE 4-Door Hatchback FWD",
        "SE Sedan FWD",
        "SEL Sedan FWD",
        "Value Edition Sedan FWD"
      ],
      "Azera": [
        "FWD",
        "Limited FWD"
      ],
      "Elantra": [
        "Eco Sedan FWD",
        "GLS Sedan FWD",
        "GLS Wagon FWD",
        "Limited Sedan FWD",
        "SE Sedan FWD",
        "SE Value Edition Sedan FWD",
        "SEL Sedan FWD",
        "Sport Sedan FWD",
        "Value Edition Sedan FWD"
      ],
      "Elantra GT": [
        "FWD",
        "N Line FWD"
      ],
      "Elantra Touring": [
        "GLS FWD",
        "SE FWD"
      ],
      "Equus": [
        "Ultimate RWD"
      ],
      "Genesis": [
        "3.8 AWD",
        "3.8 RWD",
        "5.0 RWD"
      ],
      "Genesis Coupe": [
        "2.0T Premium RWD",
        "3.8 Grand Touring RWD",
        "3.8 RWD",
        "3.8 Track RWD",
        "3.8 Ultimate RWD with Tan Interior"
      ],
      "Kona": [
        "Iron Man FWD",
        "Limited AWD",
        "SE AWD",
        "SE FWD",
        "SEL AWD",
        "SEL FWD",
        "SEL Plus AWD",
        "SEL Plus FWD",
        "Ultimate AWD",
        "Ultimate FWD"
      ],
      "Palisade": [
        "Limited AWD",
        "SEL AWD",
        "SEL FWD"
      ],
      "Santa Fe": [
        "2.0T Limited AWD",
        "2.0T Limited FWD",
        "2.0T SEL AWD",
        "2.0T SEL FWD",
        "2.0T Ultimate AWD",
        "2.4L GLS AWD",
        "2.4L GLS FWD",
        "2.4L Limited AWD",
        "2.4L Limited FWD",
        "2.4L SE AWD",
        "2.4L SE FWD",
        "2.4L SEL AWD",
        "2.4L SEL FWD",
        "2.7L GLS FWD",
        "3.3L Limited FWD",
        "3.3L SE AWD",
        "3.3L SE FWD",
        "3.5L Limited AWD",
        "3.5L Limited FWD",
        "GLS FWD",
        "Limited",
        "Limited AWD",
        "Limited FWD",
        "Limited Ultimate AWD",
        "SE AWD",
        "SE FWD",
        "SE Ultimate AWD",
        "SE Ultimate FWD"
      ],
      "Santa Fe Sport": [
        "2.0T AWD",
        "2.0T FWD",
        "2.0T Ultimate AWD",
        "2.0T Ultimate FWD",
        "2.4L AWD",
        "2.4L FWD"
      ],
      "Santa Fe XL": [
        "Limited Ultimate AWD",
        "Limited Ultimate FWD",
        "SE FWD"
      ],
      "Sonata": [
        "2.0T Limited FWD",
        "2.0T SE FWD",
        "2.0T Sport FWD",
        "2.0T Sport FWD with Black Leather Interior",
        "2018.5 Sport+ FWD",
        "Eco FWD",
        "FWD",
        "GLS FWD",
        "Limited FWD",
        "SE FWD",
        "SEL FWD",
        "SEL Plus FWD",
        "Sport FWD",
        "V6 GLS FWD",
        "V6 LX FWD",
        "V6 Limited FWD"
      ],
      "Sonata Hybrid": [
        "FWD",
        "Limited FWD",
        "SE FWD"
      ],
      "Sonata Hybrid Plug-In": [
        "FWD",
        "Limited FWD"
      ],
      "Tucson": [
        "1.6T Limited AWD",
        "1.6T Limited FWD",
        "1.6T Night AWD",
        "1.6T Night FWD",
        "1.6T Sport AWD",
        "1.6T Sport FWD",
        "2.0L SE AWD",
        "2.0L SE FWD",
        "2.0L SE FWD with Beige Seats",
        "2.0L SE Plus AWD",
        "2.0L SE Plus FWD",
        "2.0L SEL AWD",
        "2.0L SEL FWD",
        "2.0L SEL Plus FWD",
        "GL FWD",
        "GLS 2WD",
        "GLS AWD",
        "GLS FWD",
        "Limited AWD",
        "Limited FWD",
        "Night AWD",
        "SE AWD",
        "SE FWD",
        "SEL AWD",
        "SEL FWD",
        "Sport AWD",
        "Sport FWD",
        "Ultimate AWD",
        "Ultimate FWD",
        "V6 SE AWD",
        "Value AWD",
        "Value FWD"
      ],
      "Veloster": [
        "2.0L Premium FWD",
        "Base",
        "FWD",
        "Re:Flex",
        "Value Edition FWD"
      ],
      "Veloster N": [
        "FWD"
      ],
      "Veloster Turbo": [
        "Coupe",
        "R-Spec",
        "Ultimate FWD"
      ],
      "Venue": [
        "SE FWD",
        "SEL FWD"
      ],
      "Veracruz": [
        "GLS",
        "GLS AWD",
        "Limited AWD",
        "SE"
      ],
      "XG350": [
        "4 Dr L Sedan"
      ]
    }
  },
  KIA: {
    models: {
      "Amanti": [
        "FWD"
      ],
      "Cadenza": [
        "Limited FWD",
        "Premium",
        "Technology",
        "Technology FWD"
      ],
      "Forte": [
        "EX",
        "EX FWD",
        "FE FWD",
        "GT FWD",
        "GT Line FWD",
        "LX",
        "LXS FWD",
        "S",
        "S FWD"
      ],
      "Forte Koup": [
        "EX"
      ],
      "Forte5": [
        "EX",
        "LX",
        "SX"
      ],
      "K5": [
        "EX FWD",
        "LX FWD",
        "LXS FWD"
      ],
      "K900": [
        "Luxury V8"
      ],
      "Optima": [
        "EX",
        "EX Turbo FWD",
        "LX",
        "LX FWD",
        "S",
        "S FWD",
        "SX",
        "SX Turbo",
        "SXL Turbo"
      ],
      "Optima Hybrid": [
        "EX",
        "EX FWD",
        "LX"
      ],
      "Optima Hybrid Plug-In": [
        "EX"
      ],
      "Rio": [
        "LX",
        "LX FWD",
        "S FWD"
      ],
      "Rondo": [
        "LX"
      ],
      "Sedona": [
        "EX",
        "EX FWD",
        "L",
        "L FWD",
        "LX",
        "LX FWD",
        "SX",
        "SX FWD",
        "SX-L"
      ],
      "Seltos": [
        "EX AWD",
        "LX AWD",
        "S AWD",
        "S FWD",
        "S Turbo AWD",
        "SX Turbo AWD"
      ],
      "Sorento": [
        "2.0T EX AWD",
        "2.0T EX FWD",
        "EX",
        "EX 4WD",
        "EX AWD",
        "EX V6 AWD",
        "EX V6 FWD",
        "L",
        "L FWD",
        "LX",
        "LX 4WD",
        "LX 4X4",
        "LX AWD",
        "LX FWD",
        "LX V6",
        "LX V6 AWD",
        "LX V6 FWD",
        "S V6 AWD",
        "S V6 FWD",
        "SX",
        "SX AWD",
        "SX Limited AWD",
        "SX Limited V6 FWD",
        "SX V6 AWD",
        "SX V6 FWD"
      ],
      "Soul": [
        "!",
        "FWD",
        "Base",
        "Base FWD",
        "EX FWD",
        "GT-Line FWD",
        "LX FWD",
        "S FWD",
        "Turbo FWD",
        "X-Line FWD"
      ],
      "Spectra": [
        "LS"
      ],
      "Sportage": [
        "EX",
        "EX AWD",
        "EX FWD",
        "EX V6",
        "LX",
        "LX AWD",
        "LX FWD",
        "S AWD",
        "S FWD",
        "SX",
        "SX Turbo AWD",
        "SX Turbo FWD"
      ],
      "Stinger": [
        "GT AWD",
        "GT-Line RWD",
        "GT1 RWD",
        "GT2 AWD",
        "GT2 RWD",
        "Premium RWD"
      ],
      "Telluride": [
        "EX AWD",
        "EX FWD",
        "LX AWD",
        "LX FWD",
        "S AWD",
        "SX AWD",
        "SX FWD"
      ]
    }
  },
  Lexus: {
    models: {
      "CT Hybrid": [
        "200h FWD",
        "200h Premium FWD"
      ],
      "ES": [
        "350 F Sport FWD",
        "350 FWD",
        "350 Luxury FWD"
      ],
      "ES 300": [
        "300 FWD"
      ],
      "ES 300h": [
        "300h FWD"
      ],
      "ES 330": [
        "330 FWD"
      ],
      "ES 350": [
        "350 FWD",
        "Crafted Line FWD"
      ],
      "GS": [
        "350 F Sport AWD"
      ],
      "GS 300": [
        "RWD"
      ],
      "GS 350": [
        "AWD",
        "F Sport RWD",
        "RWD"
      ],
      "GS 400": [
        "400 RWD"
      ],
      "GS Hybrid": [
        "450h RWD"
      ],
      "GX": [
        "460 4WD",
        "460 Luxury 4WD",
        "460 Premium 4WD"
      ],
      "GX 470": [
        "470 4WD"
      ],
      "HS 250h": [
        "Premium FWD"
      ],
      "IS": [
        "200t RWD",
        "300 AWD",
        "300 RWD",
        "300 Sedan AWD",
        "300 Sedan RWD",
        "350 AWD",
        "350C Convertible RWD"
      ],
      "IS 250": [
        "AWD",
        "Crafted Line AWD",
        "Crafted Line RWD",
        "RWD"
      ],
      "IS 350": [
        "AWD",
        "RWD"
      ],
      "LC": [
        "500 RWD"
      ],
      "LS": [
        "500 AWD",
        "500 Inspiration Series AWD",
        "500 RWD"
      ],
      "LS 430": [
        "430 RWD"
      ],
      "LS 460": [
        "AWD",
        "RWD"
      ],
      "LX": [
        "570 3-Row 4WD"
      ],
      "LX 570": [
        "570 4WD"
      ],
      "NX": [
        "300 AWD",
        "300 F Sport AWD",
        "300 F Sport FWD",
        "300 FWD"
      ],
      "NX 200t": [
        "AWD",
        "F Sport AWD",
        "F Sport FWD",
        "FWD"
      ],
      "NX Hybrid": [
        "300h AWD",
        "AWD"
      ],
      "RC": [
        "300 AWD",
        "300 RWD",
        "350 F Sport AWD"
      ],
      "RC 200t": [
        "200t RWD",
        "RWD"
      ],
      "RC 300": [
        "RWD"
      ],
      "RC 350": [
        "RWD"
      ],
      "RX": [
        "350 AWD",
        "350 F Sport AWD",
        "350 F Sport Performance AWD",
        "350 FWD",
        "350L AWD",
        "350L FWD",
        "350L Luxury FWD"
      ],
      "RX 300": [
        "AWD",
        "FWD"
      ],
      "RX 330": [
        "AWD",
        "FWD"
      ],
      "RX 350": [
        "AWD",
        "F Sport AWD",
        "F Sport Crafted Line AWD",
        "F Sport FWD",
        "FWD"
      ],
      "RX 400h": [
        "AWD"
      ],
      "RX Hybrid": [
        "450h AWD",
        "450h FWD"
      ],
      "SC 430": [
        "430 RWD"
      ],
      "UX": [
        "200 F Sport FWD",
        "200 FWD"
      ],
      "UX Hybrid": [
        "250h AWD",
        "250h F Sport AWD"
      ]
    }
  },
  Mazda: {
    models: {
      "B-Series": [
        "B3000 SE Cab Plus 4 RWD"
      ],
      "CX-3": [
        "Grand Touring AWD",
        "Sport AWD",
        "Sport FWD",
        "Touring",
        "Touring AWD",
        "Touring FWD"
      ],
      "CX-30": [
        "AWD",
        "FWD",
        "Preferred AWD",
        "Preferred FWD",
        "Premium AWD",
        "Premium FWD",
        "Select AWD",
        "Select FWD"
      ],
      "CX-5": [
        "Grand Select AWD",
        "Grand Touring",
        "Grand Touring AWD",
        "Grand Touring FWD",
        "Grand Touring Reserve AWD",
        "Signature AWD",
        "Signature Diesel AWD",
        "Sport",
        "Sport AWD",
        "Sport FWD",
        "Touring",
        "Touring AWD",
        "Touring FWD"
      ],
      "CX-7": [
        "i SV",
        "i Sport"
      ],
      "CX-9": [
        "Grand Touring",
        "Grand Touring AWD",
        "Grand Touring FWD",
        "Signature AWD",
        "Sport",
        "Sport AWD",
        "Sport FWD",
        "Touring",
        "Touring AWD",
        "Touring FWD"
      ],
      "MAZDA2": [
        "Sport"
      ],
      "MAZDA3": [
        "Grand Touring",
        "Grand Touring Hatchback",
        "Hatchback AWD",
        "Hatchback FWD",
        "Preferred Hatchback AWD",
        "Preferred Hatchback FWD",
        "Preferred Sedan AWD",
        "Preferred Sedan FWD",
        "Premium Hatchback AWD",
        "Premium Hatchback FWD",
        "Premium Sedan AWD",
        "Premium Sedan FWD",
        "S Hatchback",
        "Sedan FWD",
        "Select Sedan AWD",
        "Select Sedan FWD",
        "Sport",
        "Sport Hatchback",
        "Touring",
        "Touring 2.5 Hatchback",
        "Touring Hatchback",
        "i Grand Touring",
        "i Grand Touring Hatchback",
        "i SV",
        "i Sport",
        "i Sport Hatchback",
        "i Touring",
        "i Touring Hatchback",
        "i Touring with R Production",
        "s",
        "s Grand Touring",
        "s Sport",
        "s Sport Hatchback",
        "s Touring"
      ],
      "MAZDA6": [
        "2017.5 Grand Touring Sedan FWD",
        "2017.5 Touring Sedan FWD",
        "4 Dr s V6 Sedan",
        "Grand Touring FWD",
        "Grand Touring Reserve Sedan FWD",
        "Grand Touring Sedan FWD",
        "Signature Sedan FWD",
        "Sport FWD",
        "Sport Sedan FWD",
        "Touring FWD",
        "Touring Sedan FWD",
        "i 4dr Sedan",
        "i Grand Touring",
        "i Sport",
        "i Sport Grand Touring",
        "i Touring",
        "s Grand Sport 4dr Sedan",
        "s Grand Touring",
        "s Grand Touring Wagon"
      ],
      "MAZDASPEED3": [
        "Sport"
      ],
      "MX-5 Miata": [
        "Club Convertible",
        "Club RWD",
        "Grand Touring Convertible",
        "Grand Touring RWD",
        "RF Club RWD",
        "RF Grand Touring RWD",
        "Sport Convertible",
        "Sport Hardtop Convertible",
        "Touring"
      ],
      "Protege5": [
        "4 Dr STD Wagon"
      ],
      "Tribute": [
        "ES V6 4WD",
        "LX V6",
        "s 4WD"
      ]
    }
  },
  "Mercedes-Benz": { // Changed from "Mercedes" to "Mercedes-Benz" for consistency with common naming
    models: {
      "300-Class": [
        "4 Dr 300SE Sedan"
      ],
      "A-Class": [
        "A 220 Sedan 4MATIC AWD",
        "A 220 Sedan FWD",
        "A AMG 35 4MATIC AWD"
      ],
      "AMG GT": [
        "53 4MATIC AWD",
        "63 4MATIC AWD",
        "63 Sedan 4MATIC AWD",
        "R",
        "R Roadster RWD"
      ],
      "C-Class": [
        "C 230 Sport",
        "C 230 Supercharged Hatchback",
        "C 230 Supercharged Sedan",
        "C 250 Coupe",
        "C 250 Luxury",
        "C 250 Sport",
        "C 280 4MATIC Luxury AWD",
        "C 300",
        "C 300 4MATIC",
        "C 300 4MATIC AWD",
        "C 300 4MATIC Cabriolet",
        "C 300 4MATIC Cabriolet AWD",
        "C 300 4MATIC Coupe AWD",
        "C 300 4MATIC Sedan AWD",
        "C 300 Cabriolet",
        "C 300 Cabriolet RWD",
        "C 300 Coupe",
        "C 300 Coupe 4MATIC",
        "C 300 Luxury 4MATIC",
        "C 300 RWD",
        "C 300 Sedan RWD",
        "C 300 Sport",
        "C 300 Sport 4MATIC",
        "C 350 4MATIC Coupe",
        "C AMG 43",
        "C AMG 43 4MATIC AWD",
        "C AMG 43 4MATIC Cabriolet",
        "C AMG 43 4MATIC Coupe AWD",
        "C AMG 43 Coupe",
        "C AMG 450",
        "C AMG 63 Cabriolet RWD",
        "C AMG 63 S Coupe RWD",
        "C AMG 63 S Sedan RWD"
      ],
      "CL-Class": [
        "CL 500 Coupe"
      ],
      "CLA-Class": [
        "CLA 250",
        "CLA 250 4MATIC",
        "CLA 250 4MATIC AWD",
        "CLA 250 FWD",
        "CLA AMG 35 4MATIC AWD",
        "CLA AMG 45",
        "CLA AMG 45 4MATIC",
        "CLA AMG 45 4MATIC AWD"
      ],
      "CLK-Class": [
        "CLK 320 Cabriolet",
        "CLK 350 Coupe",
        "CLK 550 Cabriolet"
      ],
      "CLS-Class": [
        "CLS 400",
        "CLS 400 4MATIC",
        "CLS 450 4MATIC AWD",
        "CLS 450 4MATIC Coupe AWD",
        "CLS 450 Coupe RWD",
        "CLS 450 RWD",
        "CLS 500 4dr Sedan",
        "CLS 550",
        "CLS 550 4MATIC"
      ],
      "E-Class": [
        "E 300",
        "E 300 4MATIC",
        "E 300 4MATIC Sedan AWD",
        "E 300 Sedan RWD",
        "E 320",
        "E 320 BlueTEC",
        "E 320 Convertible",
        "E 350",
        "E 350 4MATIC",
        "E 350 4MATIC AWD",
        "E 350 4MATIC Wagon",
        "E 350 Coupe",
        "E 350 Luxury",
        "E 350 Luxury 4MATIC",
        "E 350 Luxury 4MATIC Wagon",
        "E 350 Sedan",
        "E 350 Sedan RWD",
        "E 350 Sport",
        "E 350 Sport 4MATIC",
        "E 350 Sport 4MATIC Wagon",
        "E 400 4MATIC Coupe AWD",
        "E 400 4MATIC Wagon",
        "E 400 4MATIC Wagon AWD",
        "E 400 Cabriolet",
        "E 400 Cabriolet RWD",
        "E 400 Coupe RWD",
        "E 450 4MATIC AWD",
        "E 450 4MATIC Cabriolet AWD",
        "E 450 4MATIC Sedan AWD",
        "E 450 4MATIC Wagon AWD",
        "E 450 Cabriolet RWD",
        "E 450 Coupe RWD",
        "E 550",
        "E 550 Coupe",
        "E 550 Sport",
        "E 550 Sport 4MATIC",
        "E AMG 43 4MATIC",
        "E AMG 43 4MATIC Sedan AWD",
        "E AMG 53 4MATIC Sedan AWD",
        "E AMG 63",
        "E AMG 63 S 4MATIC Sedan AWD"
      ],
      "G-Class": [
        "G 550",
        "G 550 4MATIC AWD",
        "G AMG 55",
        "G AMG 63",
        "G AMG 63 4MATIC AWD"
      ],
      "GL-Class": [
        "GL 350 BlueTEC",
        "GL 450"
      ],
      "GLA-Class": [
        "GLA 250",
        "GLA 250 4MATIC",
        "GLA 250 4MATIC AWD",
        "GLA 250 FWD"
      ],
      "GLB-Class": [
        "GLB 250 4MATIC AWD",
        "GLB 250 FWD"
      ],
      "GLC-Class": [
        "GLC 300",
        "GLC 300 4MATIC",
        "GLC 300 4MATIC AWD",
        "GLC 300 4MATIC Coupe AWD",
        "GLC 300 Coupe 4MATIC",
        "GLC 300 RWD",
        "GLC 350e 4MATIC AWD",
        "GLC AMG 43 4MATIC",
        "GLC AMG 43 4MATIC AWD",
        "GLC AMG 43 Coupe 4MATIC AWD",
        "GLC AMG 63 4MATIC AWD",
        "GLC AMG 63 S 4MATIC AWD"
      ],
      "GLE-Class": [
        "GLE 300d 4MATIC",
        "GLE 350",
        "GLE 350 4MATIC",
        "GLE 350 4MATIC AWD",
        "GLE 350 RWD",
        "GLE 400 4MATIC",
        "GLE 450 4MATIC AWD",
        "GLE 580 4MATIC AWD",
        "GLE AMG 43 4MATIC",
        "GLE AMG 43 4MATIC AWD",
        "GLE AMG 43 4MATIC Coupe",
        "GLE AMG 43 4MATIC Coupe AWD",
        "GLE AMG 53 4MATIC+ Coupe AWD",
        "GLE AMG 63 4MATIC S Coupe AWD"
      ],
      "GLK-Class": [
        "GLK 350",
        "GLK 350 4MATIC"
      ],
      "GLS-Class": [
        "GLS 450",
        "GLS 450 4MATIC AWD",
        "GLS 550 4MATIC AWD",
        "GLS AMG 63"
      ],
      "M-Class": [
        "ML 320 BlueTEC 4MATIC",
        "ML 350",
        "ML 350 4MATIC",
        "ML 350 4MATIC AWD",
        "ML 350 BlueTEC 4MATIC",
        "ML 550 4MATIC",
        "ML AMG 63 4MATIC"
      ],
      "Metris": [
        "Passenger RWD",
        "Worker Passenger RWD"
      ],
      "Metris Cargo": [
        "126 Standard Roof RWD",
        "135 Standard Roof RWD"
      ],
      "R-Class": [
        "R 350",
        "R 350 4MATIC"
      ],
      "S-Class": [
        "Maybach S 560 4MATIC AWD",
        "Maybach S 560 4MATIC Sedan AWD",
        "Maybach S 650 Sedan RWD",
        "S 430",
        "S 550",
        "S 550 4MATIC",
        "S 560 4MATIC AWD",
        "S 560 4MATIC Coupe AWD",
        "S 560 4MATIC Sedan AWD",
        "S 560 RWD",
        "S 560 Sedan RWD",
        "S AMG 63",
        "S AMG 63 4MATIC Cabriolet AWD",
        "S AMG 63 4MATIC Sedan AWD",
        "S AMG 65",
        "S AMG 65 RWD"
      ],
      "S-Class Coupe": [
        "S 550 4MATIC",
        "S 550 Cabriolet"
      ],
      "SL-Class": [
        "560SL",
        "SL 450",
        "SL 450 RWD",
        "SL 500",
        "SL 550",
        "SL 550 RWD",
        "SL 600 Turbo",
        "SL AMG 55",
        "SL AMG 63",
        "SL AMG 65"
      ],
      "SLC-Class": [
        "SLC 300",
        "SLC 300 RWD",
        "SLC AMG 43",
        "SLC AMG 43 RWD"
      ],
      "SLK-Class": [
        "SLK 230 Kompressor"
      ],
      "SLS-Class": [
        "AMG Roadster"
      ]
    }
  },
  Mitsubishi: {
    models: {
      "Eclipse Cross": [
        "ES AWD",
        "ES FWD",
        "ES S-AWC AWD",
        "LE AWD",
        "LE FWD",
        "LE S-AWC AWD",
        "SE AWD",
        "SE FWD",
        "SE S-AWC AWD",
        "SEL FWD"
      ],
      "Eclipse Spyder": [
        "GS Sport",
        "GS Spyder"
      ],
      "Galant": [
        "ES"
      ],
      "Lancer": [
        "DE",
        "ES",
        "ES FWD",
        "GTS",
        "LE",
        "SE"
      ],
      "Mirage": [
        "DE",
        "ES",
        "ES FWD",
        "GT FWD"
      ],
      "Mirage G4": [
        "ES FWD",
        "LE FWD",
        "SE FWD"
      ],
      "Montero": [
        "Limited 4WD"
      ],
      "Montero Sport": [
        "Limited 4WD"
      ],
      "Outlander": [
        "ES AWC AWD",
        "ES AWD",
        "ES FWD",
        "GT AWD",
        "GT S-AWC AWD",
        "LE FWD",
        "LS",
        "SE",
        "SE AWD",
        "SE FWD",
        "SE S-AWC AWD",
        "SEL",
        "SEL AWD",
        "SEL FWD",
        "SEL S-AWC AWD"
      ],
      "Outlander Sport": [
        "BE AWD",
        "BE FWD",
        "ES",
        "ES AWD",
        "ES FWD",
        "LE",
        "SE",
        "SE AWD",
        "SE FWD",
        "SEL AWD"
      ]
    }
  },
  Nissan: {
    models: {
      "350Z": [
        "Touring Roadster"
      ],
      "370Z": [
        "Base",
        "Coupe",
        "NISMO RWD",
        "Roadster",
        "Roadster Touring",
        "Sport RWD",
        "Sport Touring RWD"
      ],
      "Altima": [
        "2.0 Platinum FWD",
        "2.0 SR FWD",
        "2.5",
        "2.5 Platinum AWD",
        "2.5 Platinum FWD",
        "2.5 S",
        "2.5 S AWD",
        "2.5 S FWD",
        "2.5 SL",
        "2.5 SL AWD",
        "2.5 SL FWD",
        "2.5 SR",
        "2.5 SR AWD",
        "2.5 SR FWD",
        "2.5 SV",
        "2.5 SV AWD",
        "2.5 SV FWD",
        "2017.5 2.5 S",
        "2017.5 2.5 SL",
        "2017.5 2.5 SR",
        "2017.5 2.5 SV",
        "3.5 SE",
        "3.5 SL",
        "3.5 SR"
      ],
      "Altima Coupe": [
        "2.5 S"
      ],
      "Altima Hybrid": [
        "FWD"
      ],
      "Armada": [
        "Platinum",
        "Platinum 4WD",
        "Platinum RWD",
        "SL",
        "SL 4WD",
        "SL RWD",
        "SV",
        "SV 4WD",
        "SV RWD"
      ],
      "Cube": [
        "1.8 S",
        "SL"
      ],
      "Frontier": [
        "4 Dr SE 4WD Crew Cab SB",
        "4 Dr SE King Cab SB",
        "Desert Runner King Cab",
        "King Cab Nismo 4X4",
        "LE Crew Cab 4WD",
        "PRO-4X Crew Cab 4WD",
        "S Crew Cab",
        "S King Cab",
        "SE Crew Cab",
        "SE Crew Cab 4X4",
        "SE Crew Cab LWB 4WD",
        "SV Crew Cab",
        "SV Crew Cab 4WD",
        "SV Crew Cab LWB 4WD",
        "SV King Cab",
        "SV V6 Crew Cab",
        "SV V6 Crew Cab 4WD",
        "SV V6 Crew Cab LWB 4WD",
        "SV V6 Crew Cab RWD",
        "SV V6 King Cab 4WD"
      ],
      "Juke": [
        "NISMO",
        "S",
        "S AWD",
        "SL",
        "SL AWD",
        "SV",
        "SV AWD"
      ],
      "Kicks": [
        "S FWD",
        "SR FWD",
        "SV FWD"
      ],
      "Maxima": [
        "3.5 SE",
        "GLE",
        "GXE",
        "Platinum",
        "Platinum FWD",
        "S",
        "S FWD",
        "SE",
        "SL",
        "SL FWD",
        "SR FWD",
        "SV",
        "SV FWD"
      ],
      "Murano": [
        "2017.5 Platinum",
        "2017.5 Platinum AWD",
        "2017.5 S AWD",
        "2017.5 SL",
        "2017.5 SL AWD",
        "LE",
        "LE AWD",
        "Platinum",
        "Platinum AWD",
        "Platinum FWD",
        "S",
        "S AWD",
        "S FWD",
        "SE",
        "SE AWD",
        "SL",
        "SL AWD",
        "SL FWD",
        "SV",
        "SV AWD",
        "SV FWD"
      ],
      "NV200": [
        "S",
        "S FWD",
        "SV",
        "SV FWD"
      ],
      "Pathfinder": [
        "LE",
        "LE 4X4",
        "Platinum",
        "Platinum 4WD",
        "Platinum FWD",
        "S",
        "S 4WD",
        "S FWD",
        "SE",
        "SL",
        "SL 4WD",
        "SL FWD",
        "SV",
        "SV 4WD",
        "SV FWD",
        "Silver Edition",
        "Silver Edition 4WD",
        "XE 4WD"
      ],
      "Quest": [
        "3.5 LE",
        "3.5 S",
        "3.5 SL",
        "3.5 SV",
        "Base",
        "S",
        "SV"
      ],
      "Rogue": [
        "2017.5 S AWD",
        "2017.5 S FWD",
        "2017.5 SL AWD",
        "2017.5 SL FWD",
        "2017.5 SV AWD",
        "2017.5 SV FWD",
        "S",
        "S AWD",
        "S FWD",
        "S Krom Edition AWD",
        "SL",
        "SL AWD",
        "SL FWD",
        "SV",
        "SV AWD",
        "SV FWD",
        "SV with SL",
        "SV with SL AWD"
      ],
      "Rogue Select": [
        "S",
        "S AWD"
      ],
      "Rogue Sport": [
        "S",
        "S AWD",
        "S FWD",
        "SL",
        "SL AWD",
        "SL FWD",
        "SV",
        "SV AWD",
        "SV FWD"
      ],
      "Sentra": [
        "2.0 S",
        "2.0 SL",
        "2.0 SR",
        "FE+ S",
        "FE+ SV",
        "GXE",
        "S",
        "S FWD",
        "SE-R",
        "SL",
        "SL FWD",
        "SR",
        "SR FWD",
        "SR Turbo",
        "SR Turbo FWD",
        "SV",
        "SV FWD"
      ],
      "Titan": [
        "LE Crew Cab 4WD",
        "PRO-4X Crew Cab 4WD",
        "PRO-4X King Cab 4WD",
        "Platinum Reserve Crew Cab",
        "Platinum Reserve Crew Cab 4WD",
        "Platinum Reserve Crew Cab RWD",
        "S Crew Cab RWD",
        "S King Cab",
        "SE King Cab 4WD",
        "SL Crew Cab",
        "SL Crew Cab 4WD",
        "SL Crew Cab RWD",
        "SV Crew Cab",
        "SV Crew Cab 4WD",
        "SV Crew Cab RWD",
        "XE King Cab 2WD"
      ],
      "Truck": [
        "XE Standard Cab SB"
      ],
      "Versa": [
        "1.6 S",
        "1.6 S Plus",
        "1.6 SL",
        "1.6 SV",
        "1.8 S Hatchback",
        "1.8 SL Hatchback",
        "2018.5 SV",
        "S",
        "S FWD",
        "S Plus",
        "S Plus FWD",
        "SL Hatchback",
        "SR FWD",
        "SV",
        "SV FWD"
      ],
      "Versa Note": [
        "2018.5 SV FWD",
        "S",
        "S Plus",
        "SL",
        "SV",
        "SV FWD"
      ],
      "Xterra": [
        "S",
        "S 4WD",
        "SE",
        "SE 4WD",
        "X 4WD",
        "XE V6"
      ]
    }
  },
  Suzuki: {
    models: {
      "Forenza": [
        "Base",
        "S Sedan"
      ],
      "Grand Vitara": [
        "XSport",
        "XSport 4WD"
      ],
      "SX4": [
        "Crossover Touring AWD"
      ],
      "XL-7": [
        "Limited AWD",
        "Luxury AWD"
      ]
    }
  },
  Toyota: {
    models: {
      "4Runner": [
        "4 Dr Limited 4WD SUV",
        "4 Dr SR5 4WD SUV",
        "Limited",
        "Limited 4WD",
        "Limited AWD",
        "Limited RWD",
        "Nightshade 4WD",
        "SR5",
        "SR5 4WD",
        "SR5 Premium",
        "SR5 Premium 4WD",
        "SR5 Premium RWD",
        "SR5 RWD",
        "SR5 V6",
        "SR5 V6 4WD",
        "Sport Edition V6 4WD",
        "TRD Off-Road 4WD",
        "TRD Off-Road Premium 4WD",
        "TRD Pro 4WD",
        "Trail 4WD",
        "V6 4x2 SR5",
        "V6 4x2 Sport Edition",
        "Venture 4WD"
      ],
      "86": [
        "860 Special Edition",
        "RWD"
      ],
      "Avalon": [
        "Limited",
        "XL",
        "XLE",
        "XLE Premium",
        "XLE Touring",
        "XLS"
      ],
      "Avalon Hybrid": [
        "Limited FWD",
        "XLE Touring FWD"
      ],
      "C-HR": [
        "LE",
        "LE FWD",
        "Limited FWD",
        "XLE",
        "XLE FWD",
        "XLE Premium"
      ],
      "Camry": [
        "CE",
        "L",
        "LE",
        "LE AWD",
        "LE V6",
        "SE",
        "SE AWD",
        "SE Nightshade AWD",
        "SE Sport",
        "SE Sport Limited Edition",
        "SE V6",
        "Special Edition",
        "XLE",
        "XLE AWD",
        "XLE V6",
        "XSE",
        "XSE AWD",
        "XSE FWD",
        "XSE V6"
      ],
      "Camry Hybrid": [
        "FWD",
        "SE FWD",
        "XLE FWD"
      ],
      "Camry Solara": [
        "2 Dr SE Convertible",
        "SE V6 Convertible",
        "SLE Convertible",
        "SLE V6"
      ],
      "Celica": [
        "GTS"
      ],
      "Corolla": [
        "50th Anniversary Edition",
        "Base",
        "CE",
        "L",
        "LE",
        "LE Eco",
        "LE Plus",
        "LE Premium",
        "S",
        "S Plus",
        "SE",
        "Special Edition Package",
        "XLE",
        "XSE"
      ],
      "Corolla Hatchback": [
        "SE FWD",
        "XSE FWD"
      ],
      "Corolla iM": [
        "Hatchback"
      ],
      "FJ Cruiser": [
        "2WD",
        "4WD"
      ],
      "Highlander": [
        "Base",
        "Base 4WD",
        "Base AWD",
        "Base V6",
        "Base V6 4WD",
        "Base V6 AWD",
        "L AWD",
        "L FWD",
        "LE",
        "LE AWD",
        "LE FWD",
        "LE I4",
        "LE Plus",
        "LE Plus AWD",
        "LE Plus FWD",
        "LE i4",
        "LE i4 FWD",
        "Limited",
        "Limited 4WD",
        "Limited AWD",
        "Limited FWD",
        "Limited Platinum",
        "Limited Platinum AWD",
        "Limited Platinum FWD",
        "Limited V6 4WD",
        "Limited V6 AWD",
        "Platinum AWD",
        "Platinum FWD",
        "Plus V6",
        "SE",
        "SE AWD",
        "SE FWD",
        "SE V6",
        "SE V6 AWD",
        "Sport",
        "Sport 4WD",
        "XLE",
        "XLE AWD",
        "XLE FWD",
        "XLE V6 AWD"
      ],
      "Highlander Hybrid": [
        "Base",
        "Limited",
        "Limited Platinum"
      ],
      "Land Cruiser": [
        "4WD",
        "60 Series 4WD",
        "AWD"
      ],
      "Matrix": [
        "Base",
        "XRS"
      ],
      "Prius": [
        "FWD",
        "Five",
        "Four",
        "One",
        "Persona Series",
        "Persona Series SE",
        "Three",
        "Touring FWD",
        "Two"
      ],
      "Prius Plug-In": [
        "Advanced",
        "Base"
      ],
      "Prius c": [
        "Four",
        "One",
        "Three",
        "Two"
      ],
      "Prius v": [
        "Five FWD",
        "Four FWD",
        "Three FWD",
        "Two FWD"
      ],
      "RAV4": [
        "Adventure AWD",
        "Base",
        "Base 4WD",
        "Base AWD",
        "Base V6 AWD",
        "LE",
        "LE AWD",
        "LE FWD",
        "Limited",
        "Limited 4WD",
        "Limited AWD",
        "Limited FWD",
        "Limited V6",
        "Limited V6 AWD",
        "SE",
        "SE AWD",
        "Sport",
        "Sport 4WD",
        "Sport AWD",
        "Sport V6 4WD",
        "XLE",
        "XLE AWD",
        "XLE FWD",
        "XLE Premium AWD",
        "XLE Premium FWD"
      ],
      "RAV4 Hybrid": [
        "XLE AWD"
      ],
      "Sequoia": [
        "Limited",
        "Limited 4WD",
        "Limited RWD",
        "Platinum 4WD",
        "Platinum FFV 4WD",
        "Platinum RWD",
        "SR5",
        "SR5 4WD",
        "SR5 FFV 4WD",
        "SR5 RWD",
        "TRD Pro 4WD",
        "TRD Sport 4WD"
      ],
      "Sienna": [
        "4 Dr LE Passenger Van",
        "4 Dr XLE AWD Passenger Van",
        "CE",
        "CE 8 Passenger",
        "L 7-Passenger",
        "L 7-Passenger FWD",
        "LE",
        "LE 7-Passenger AWD",
        "LE 7-Passenger V6 AWD",
        "LE 8 Passenger",
        "LE 8-Passenger",
        "LE 8-Passenger FWD",
        "LE 8-Passenger V6",
        "LE AWD",
        "LE Mobility 7-Passenger",
        "Limited 7-Passenger AWD",
        "Limited Premium 7-Passenger AWD",
        "SE 8-Passenger",
        "SE 8-Passenger FWD",
        "SE Premium 7-Passenger AWD",
        "SE Premium 8-Passenger FWD",
        "XLE",
        "XLE 7-Passenger AWD",
        "XLE 7-Passenger Auto Access Seat",
        "XLE 7-Passenger FWD with Auto-Access Seat",
        "XLE 8-Passenger",
        "XLE 8-Passenger FWD",
        "XLE Limited AWD",
        "XLE Premium 7-Passenger AWD",
        "XLE Premium 8-Passenger",
        "XLE Premium 8-Passenger FWD"
      ],
      "Supra": [
        "3.0 Premium RWD"
      ],
      "Tacoma": [
        "4 Dr Prerunner Crew Cab SB",
        "4 Dr Prerunner V6 Crew Cab SB",
        "Access Cab 4WD",
        "Access Cab SB",
        "Access Cab V6 SR5 4WD",
        "Access Cab V6 TRD Sport 4WD",
        "Access Cab i4",
        "Access Cab i4 4WD",
        "Double Cab",
        "Double Cab LB V6 4WD",
        "Double Cab SB V6 4WD",
        "Double Cab V6 4WD",
        "Double Cab V6 LB 4WD",
        "Double Cab V6 LB TRD Off Road 4WD",
        "Double Cab V6 LB TRD Sport",
        "Double Cab V6 SR5",
        "Double Cab V6 SR5 4WD",
        "Double Cab V6 TRD Sport",
        "Double Cab V6 TRD Sport 4WD",
        "Limited Double Cab 4WD",
        "PreRunner Double Cab V6",
        "PreRunner Double Cab V6 LB",
        "PreRunner Double Cab V6 SB",
        "PreRunner V6 4dr Access Cab SB with automatic",
        "Regular Cab",
        "Regular Cab SB",
        "SR V6 Double Cab 4WD",
        "SR5 V6 Access Cab 4WD",
        "SR5 V6 Access Cab RWD",
        "SR5 V6 Double Cab 4WD",
        "SR5 V6 Double Cab LB 4WD",
        "SR5 V6 Double Cab LB RWD",
        "SR5 V6 Double Cab RWD",
        "TRD Off Road Double Cab 4WD",
        "TRD Off Road Double Cab LB 4WD",
        "TRD Off Road V6 Access Cab 4WD",
        "TRD Off Road V6 Double Cab 4WD",
        "TRD Pro Double Cab 4WD",
        "TRD Sport Access Cab LB 4WD",
        "TRD Sport Double Cab 4WD",
        "TRD Sport Double Cab LB 4WD",
        "TRD Sport Double Cab LB RWD",
        "TRD Sport Double Cab RWD",
        "TRD Sport V6 Access Cab 4WD",
        "TRD Sport V6 Double Cab 4WD",
        "TRD Sport V6 Double Cab LB 4WD",
        "TRD Sport V6 Double Cab RWD",
        "V6 4dr Double Cab 4WD SB with automatic"
      ],
      "Tundra": [
        "1794 Edition CrewMax 4WD",
        "1794 Edition CrewMax 5.7L 4WD",
        "1794 Edition CrewMax RWD",
        "4 Dr SR5 4WD Crew Cab SB",
        "4 Dr SR5 4WD Extended Cab SB",
        "4 Dr SR5 V8 4WD Extended Cab SB",
        "4 Dr SR5 V8 4WD Extended Cab Stepside SB",
        "4X2 Limited Double Cab 5.7L",
        "4X4 Limited Double Cab 5.7L",
        "4X4 SR5 Crew Max 5.7L",
        "4X4 SR5 Double Cab 5.7L",
        "Grade CrewMax 4.6L 4WD",
        "Grade CrewMax 5.7L FFV 4WD",
        "Grade Double Cab 5.7L FFV 4WD",
        "Limited CrewMax 4WD",
        "Limited CrewMax 5.7L",
        "Limited CrewMax 5.7L 4WD",
        "Limited CrewMax 5.7L FFV 4WD",
        "Limited CrewMax RWD",
        "Limited Double Cab 4WD",
        "Platinum CrewMax 4WD",
        "Platinum CrewMax 5.7L 4WD",
        "Platinum CrewMax 5.7L FFV 4WD",
        "Platinum CrewMax RWD",
        "Platinum Double Cab 4WD",
        "Platinum Double Cab 5.7L",
        "Platinum Double Cab 5.7L 4WD",
        "Platinum Double Cab 5.7L FFV 4WD",
        "Platinum Double Cab RWD",
        "Platinum RWD",
        "PreRunner Double Cab 5.7L",
        "PreRunner Double Cab RWD",
        "PreRunner RWD",
        "Regular Cab",
        "Regular Cab 4WD",
        "Regular Cab RWD",
        "Regular Cab SR5 RWD",
        "Regular Cab V6 RWD",
        "Regular Cab V8 RWD",
        "Regular Cab V8 Stepside RWD",
        "SR5 CrewMax 4WD",
        "SR5 CrewMax 5.7L 4WD",
        "SR5 CrewMax 5.7L FFV 4WD",
        "SR5 CrewMax RWD",
        "SR5 Double Cab 4WD",
        "SR5 Double Cab 5.7L",
        "SR5 Double Cab 5.7L 4WD",
        "SR5 Double Cab 5.7L FFV 4WD",
        "SR5 Double Cab RWD",
        "SR5 Double Cab V6 4WD",
        "SR5 Double Cab V6 RWD",
        "SR5 Regular Cab RWD",
        "SR5 Regular Cab V6 RWD",
        "SR5 Regular Cab V8 RWD",
        "SR5 Regular Cab V8 Stepside RWD",
        "SR5 RWD",
        "SR5 V6 Double Cab 4WD",
        "SR5 V6 Double Cab RWD",
        "SR5 V8 Double Cab 4WD",
        "SR5 V8 Double Cab RWD",
        "SR5 V8 Regular Cab RWD",
        "TRD Pro CrewMax 5.7L 4WD",
        "TRD Pro Double Cab 5.7L 4WD",
        // "TRD Pro Double Cab 5.7L RWD", // Duplicate entry in original data, kept one
        "TRD Pro Double Cab RWD",
        "TRD Pro Regular Cab RWD",
        "TRD Sport CrewMax 5.7L 4WD",
        "TRD Sport Double Cab 5.7L 4WD",
        // "TRD Sport Double Cab 5.7L RWD", // Duplicate entry in original data, kept one
        "TRD Sport Double Cab RWD",
        "TRD Sport Regular Cab RWD",
        "TRD Sport Regular Cab V6 RWD",
        "TRD Sport Regular Cab V8 RWD",
        "TRD Sport Regular Cab V8 Stepside RWD",
        "TRD Sport RWD",
        "TRD Sport V6 CrewMax 4WD",
        "TRD Sport V6 Double Cab 4WD",
        "TRD Sport V6 Double Cab RWD",
        "TRD Sport V6 Regular Cab RWD",
        "TRD Sport V8 CrewMax 4WD",
        "TRD Sport V8 Double Cab 4WD",
        "TRD Sport V8 Double Cab RWD",
        "TRD Sport V8 Regular Cab RWD",
        "TRD Sport V8 Regular Cab V8 Stepside RWD",
        // "TRD Sport V8 RWD", // Duplicate entry in original data, kept one
        // "TRD Sport V8 Stepside RWD" // Duplicate entry in original data, kept one
      ],
      "Venza": [
        "LE AWD",
        "XLE AWD"
      ],
      "Yaris": [
        "3 Dr Hatchback",
        "3 Dr Hatchback L",
        "3 Dr Hatchback LE",
        "3 Dr Hatchback SE",
        "5 Dr Hatchback",
        "5 Dr Hatchback LE",
        "5 Dr Hatchback SE",
        "5 Dr Hatchback XLE"
      ]
    }
  }
};

export default function Home() {
  const router = useRouter();
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [trim, setTrim] = useState("");
  const [year, setYear] = useState("");
  const [mileage, setMileage] = useState("");

  const [brandInput, setBrandInput] = useState("");
  const [modelInput, setModelInput] = useState("");
  const [trimInput, setTrimInput] = useState("");

  const [showBrandDropdown, setShowBrandDropdown] = useState(false);
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [showTrimDropdown, setShowTrimDropdown] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Refs for blur handling
  const brandDropdownRef = useRef<HTMLDivElement>(null);
  const modelDropdownRef = useRef<HTMLDivElement>(null);
  const trimDropdownRef = useRef<HTMLDivElement>(null);

  // Filtered lists
  const filteredBrands = Object.keys(carData).filter((b) =>
    b.toLowerCase().includes(brandInput.toLowerCase())
  );
  const filteredModels =
    brand && carData[brand]
      ? Object.keys(carData[brand].models).filter((m) =>
          m.toLowerCase().includes(modelInput.toLowerCase())
        )
      : [];
  const filteredTrims =
    brand && model && carData[brand]?.models[model]
      ? carData[brand].models[model].filter((t) =>
          t.toLowerCase().includes(trimInput.toLowerCase())
        )
      : [];

  // Helper for blur: close dropdown only if click is outside
  const handleBlur = (ref: React.RefObject<HTMLDivElement>, setShow: (v: boolean) => void) => (e: React.FocusEvent) => {
    setTimeout(() => {
      if (ref.current && !ref.current.contains(document.activeElement)) {
        setShow(false);
      }
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Validation
    if (!brand || !model || !trim || !year || !mileage) {
      setError("Please fill in all fields");
      return;
    }

    const yearNum = parseInt(year);
    const mileageNum = parseInt(mileage);

    if (isNaN(yearNum) || yearNum < 1900 || yearNum > new Date().getFullYear() + 1) {
      setError("Please enter a valid year");
      return;
    }

    if (isNaN(mileageNum) || mileageNum < 0) {
      setError("Please enter a valid mileage");
      return;
    }

    setIsLoading(true);

    try {
      const predictionData: PredictionRequest = {
        brand,
        model,
        trim,
        year: yearNum,
        mileage: mileageNum
      };

      const result = await predictCarPrice(predictionData);
      
      // Store result in localStorage to pass to result page
      localStorage.setItem('predictionResult', JSON.stringify(result));
      
      // Navigate to result page
      router.push('/result');
    } catch (error) {
      console.error('Prediction error:', error);
      setError("Failed to get price prediction. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: "url('/home-bg.png')",
      }}
    >
      <div className="bg-white bg-opacity-95 rounded-lg shadow-lg p-8 w-full max-w-2xl">
        <form onSubmit={handleSubmit} className="flex flex-col space-y-5">
          {error && (
            <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-md">
              {error}
            </div>
          )}

          {/* Car Brand Dropdown */}
          <div ref={brandDropdownRef} tabIndex={-1} onBlur={handleBlur(brandDropdownRef, setShowBrandDropdown)}>
            <input
              type="text"
              placeholder="Car brand..."
              value={brandInput}
              onFocus={() => setShowBrandDropdown(true)}
              onChange={(e) => {
                setBrandInput(e.target.value);
                setBrand("");
                setModel("");
                setTrim("");
                setModelInput("");
                setTrimInput("");
                setShowBrandDropdown(true);
              }}
              className="appearance-none block w-full px-3 py-4 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {showBrandDropdown && brandInput && (
              <ul className="border border-gray-300 rounded-md bg-white mt-1 max-h-40 overflow-y-auto z-10 absolute w-full">
                {filteredBrands.length === 0 && (
                  <li className="px-3 py-2 text-gray-400">No brands found</li>
                )}
                {filteredBrands.map((b) => (
                  <li
                    key={b}
                    className="px-3 py-2 hover:bg-indigo-100 cursor-pointer"
                    onMouseDown={() => {
                      setBrand(b);
                      setBrandInput(b);
                      setModel("");
                      setTrim("");
                      setModelInput("");
                      setTrimInput("");
                      setShowBrandDropdown(false);
                    }}
                  >
                    {b}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Car Model Dropdown */}
          <div ref={modelDropdownRef} tabIndex={-1} onBlur={handleBlur(modelDropdownRef, setShowModelDropdown)}>
            <input
              type="text"
              placeholder="Car model..."
              value={modelInput}
              onFocus={() => setShowModelDropdown(true)}
              onChange={(e) => {
                setModelInput(e.target.value);
                setModel("");
                setTrim("");
                setTrimInput("");
                setShowModelDropdown(true);
              }}
              disabled={!brand}
              className="appearance-none block w-full px-3 py-4 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:bg-gray-100"
            />
            {brand && showModelDropdown && modelInput && (
              <ul className="border border-gray-300 rounded-md bg-white mt-1 max-h-40 overflow-y-auto z-10 absolute w-full">
                {filteredModels.length === 0 && (
                  <li className="px-3 py-2 text-gray-400">No models found</li>
                )}
                {filteredModels.map((m) => (
                  <li
                    key={m}
                    className="px-3 py-2 hover:bg-indigo-100 cursor-pointer"
                    onMouseDown={() => {
                      setModel(m);
                      setModelInput(m);
                      setTrim("");
                      setTrimInput("");
                      setShowModelDropdown(false);
                    }}
                  >
                    {m}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Car Trim Dropdown */}
          <div ref={trimDropdownRef} tabIndex={-1} onBlur={handleBlur(trimDropdownRef, setShowTrimDropdown)}>
            <input
              type="text"
              placeholder="Car Trim..."
              value={trimInput}
              onFocus={() => setShowTrimDropdown(true)}
              onChange={(e) => {
                setTrimInput(e.target.value);
                setTrim("");
                setShowTrimDropdown(true);
              }}
              disabled={!model}
              className="appearance-none block w-full px-3 py-4 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:bg-gray-100"
            />
            {model && showTrimDropdown && trimInput && (
              <ul className="border border-gray-300 rounded-md bg-white mt-1 max-h-40 overflow-y-auto z-10 absolute w-full">
                {filteredTrims.length === 0 && (
                  <li className="px-3 py-2 text-gray-400">No trims found</li>
                )}
                {filteredTrims.map((t) => (
                  <li
                    key={t}
                    className="px-3 py-2 hover:bg-indigo-100 cursor-pointer"
                    onMouseDown={() => {
                      setTrim(t);
                      setTrimInput(t);
                      setShowTrimDropdown(false);
                    }}
                  >
                    {t}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Year and Mileage */}
          <input
            type="number"
            placeholder="Year..."
            value={year}
            onChange={(e) => setYear(e.target.value)}
            min="1900"
            max={new Date().getFullYear() + 1}
            className="appearance-none block w-full px-3 py-4 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          <input
            type="number"
            placeholder="Mileage..."
            value={mileage}
            onChange={(e) => setMileage(e.target.value)}
            min="0"
            className="appearance-none block w-full px-3 py-4 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Calculating...' : 'Calculate Best Price'}
          </button>
        </form>
      </div>
    </div>
  );
}