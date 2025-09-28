# AI Resume Analyzer

A modern web application that analyzes resumes using AI to provide comprehensive feedback and ATS (Applicant Tracking System) scoring.

## Features

- **Resume Upload**: Upload PDF resumes for analysis
- **AI-Powered Analysis**: Get detailed feedback on resume content and structure
- **ATS Scoring**: Receive an ATS compatibility score with improvement suggestions
- **Visual Preview**: View uploaded resumes with image conversion
- **Detailed Reports**: Get comprehensive analysis including:
  - Summary of strengths and weaknesses
  - ATS optimization tips
  - Detailed feedback on various resume sections

## Tech Stack

- **Frontend**: React 19 with React Router v7
- **Styling**: Tailwind CSS
- **File Processing**: PDF.js for PDF handling
- **Storage**: Puter.js for file and data management
- **Build Tool**: Vite
- **TypeScript**: Full type safety

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Usage

1. Visit the application homepage
2. Upload your resume in PDF format
3. Wait for the AI analysis to complete
4. Review your detailed feedback and ATS score
5. Use the suggestions to improve your resume

## Project Structure

- `/app` - Main application code
  - `/components` - Reusable UI components
  - `/routes` - Page components and routing
  - `/lib` - Utility functions and integrations
- `/constants` - Application constants
- `/types` - TypeScript type definitions
- `/public` - Static assets and icons