# Healthcare Patient Risk Analysis System

A React-based dashboard for analyzing patient health data and identifying high-risk patients based on vital signs and medical history.

## Overview

This application fetches patient data from a healthcare API, analyzes risk factors (blood pressure, temperature, age), and displays:
- **Alert summaries** for high-risk patients, fever cases, and data quality issues
- **Patient data table** with pagination showing all medical records
- **Risk assessment** capabilities for healthcare monitoring

## Features

- 📊 **Real-time Patient Monitoring** - Paginated table displaying patient vital signs and medical data
- 🚨 **Automated Risk Analysis** - Identifies high-risk patients based on:
  - Blood pressure levels (Normal, Elevated, Stage 1, Stage 2 Hypertension)
  - Temperature readings (Normal, Low Fever, High Fever)
  - Age demographics (Under 40, 40-65, Over 65)
- 🔔 **Smart Alerts** - Dynamic alert system showing:
  - High-risk patients (risk score ≥4)
  - Patients with fever (≥99.6°F)
  - Data quality issues (missing/invalid data)
- 📄 **Pagination** - Navigate through large patient datasets (20 records per page)
- ⚡ **Global State Management** - Centralized loading and error handling

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **React Context API** for global state management

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ksense-take-home
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```bash
   cp .env.example .env
   ```
   
   Add your API key to `.env`:
   ```env
   VITE_API_KEY=your_api_key_here
   ```
   
   > **Note:** The API key must be prefixed with `VITE_` to be accessible in the client-side code.

4. **Start the development server**
   ```bash
   npm run dev
   ```
   
   The application will be available at `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The production-ready files will be in the `dist` directory.

## Project Structure

```
src/
├── components/          # React components
│   ├── Alert.tsx       # Alert display component
│   ├── UserTable.tsx   # Patient data table with pagination
│   └── SubmitButton.tsx # Assessment submission button
├── contexts/           # React Context providers
│   └── LoadingContext.tsx # Global loading/error state
├── hooks/              # Custom React hooks
│   └── useHealthcare.ts # API integration hook
├── lib/                # Utilities and types
│   ├── types.ts        # TypeScript type definitions
│   └── utils.ts        # Risk analysis utilities
└── App.tsx             # Main application component
```

## Key Components

### Risk Analysis System (`src/lib/utils.ts`)

The core risk scoring algorithm evaluates patients based on:

**Blood Pressure Scoring (0-3 points):**
- Normal (<120/<80): 0 points
- Elevated (120-129/<80): 1 point
- Stage 1 Hypertension (130-139/80-89): 2 points
- Stage 2 Hypertension (≥140/≥90): 3 points

**Temperature Scoring (0-2 points):**
- Normal (≤99.5°F): 0 points
- Low Fever (99.6-101.0°F): 1 point
- High Fever (≥101.0°F): 2 points

**Age Scoring (0-2 points):**
- Under 40: 0 points
- 40-65: 1 point
- Over 65: 2 points

**High Risk Threshold:** Total score ≥4 points

### API Integration (`src/hooks/useHealthcare.ts`)

Provides functions to:
- `getPatients(page, limit)` - Fetch paginated patient data
- `submitAssessment(results)` - Submit risk assessment results
- `refreshPatients()` - Reload the first page of patients

### Global State (`src/contexts/LoadingContext.tsx`)

Manages application-wide:
- Loading states during API calls
- Error messages from failed requests
- Centralized error handling

## API Endpoints

**Base URL:** `https://assessment.ksensetech.com/api`

### GET `/patients`
Fetch paginated patient data

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Records per page (max: 20, default: 10)

**Headers:**
- `x-api-key`: Your API key
- `Content-Type`: application/json

### POST `/submit-assessment`
Submit patient risk assessment results

**Request Body:**
```json
{
  "high_risk_patients": ["patient_id_1", "patient_id_2"],
  "fever_patients": ["patient_id_3"],
  "data_quality_issues": ["patient_id_4"]
}
```

**Headers:**
- `x-api-key`: Your API key
- `Content-Type`: application/json

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style

- TypeScript for type safety
- Functional components with hooks
- Tailwind CSS for styling
- ESLint for code quality

## Troubleshooting

### API Key Issues
- Ensure your `.env` file contains `VITE_API_KEY=your_key`
- Restart the dev server after changing environment variables
- Check browser console for authentication errors

### Pagination Errors
- API limit is max 20 records per page
- Ensure page numbers start at 1

### Build Errors
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check Node.js version compatibility (v16+)

## License

MIT

---

## Original Vite Template Info

This project was bootstrapped with Vite + React + TypeScript template.

### Vite Plugins

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
