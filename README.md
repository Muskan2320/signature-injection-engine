# Signature Injection Engine

This project is a prototype built for the Full Stack Developer (MERN) assignment.

## Overview
The Signature Injection Engine allows users to place signature and form fields on a PDF in a responsive web editor and permanently burn those signatures into the PDF on the backend with audit-level integrity.

---

## Tech Stack

### Frontend
- React (Vite)
- react-pdf / PDF.js
- Drag & Drop overlays
- Ratio-based coordinate system

### Backend
- Node.js
- Express
- pdf-lib
- MongoDB (Audit Trail)
- SHA-256 hashing

---

## Core Concept (Important)

Frontend works in **ratios**, not pixels.

- Browser uses top-left origin (pixels)
- PDF uses bottom-left origin (points)

Coordinates are stored as:
xRatio = x / pdfWidth  
yRatio = y / pdfHeight  
widthRatio = width / pdfWidth  
heightRatio = height / pdfHeight  

Backend converts ratios to PDF points and flips Y-axis.

---

## Backend Setup

cd backend  
npm install  
npm run dev  

Create folders:
mkdir pdfs signed

Add an A4 PDF:
backend/pdfs/sample.pdf

---

## API

### POST /api/sign-pdf

Payload:
{
  "pdfId": "sample",
  "signatureImage": "<base64>",
  "coordinates": {
    "page": 1,
    "xRatio": 0.3,
    "yRatio": 0.6,
    "widthRatio": 0.2,
    "heightRatio": 0.08
  }
}

Returns:
{
  "success": true,
  "url": "/signed/sample-signed.pdf"
}

---

## Audit Trail

Before signing:
- SHA-256 hash of original PDF

After signing:
- SHA-256 hash of signed PDF

Both hashes are stored in MongoDB to ensure document integrity.

---

## Frontend Setup

cd frontend  
npm install  
npm run dev  

---

## Assignment Notes

- No pixel values are stored
- All positioning is ratio-based
- Aspect ratio of signature image is preserved
- Works across desktop and mobile views

---
