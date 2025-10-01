# Health Risk Assessment Platform

A comprehensive web application for conducting various health risk assessments, built with Next.js, PayloadCMS, and modern web technologies.

## 🏥 Overview

This platform provides validated health risk assessment questionnaires that help users evaluate their risk for various health conditions. The application features a clean, user-friendly interface with real-time risk calculations and personalized results.

## 🩺 Available Assessments

### Cardiovascular Health
- **ASCVD Risk Calculator** - Evaluates 10-year risk of cardiovascular disease or stroke

### Metabolic Health  
- **FINDRISK Diabetes Assessment** - Finnish Diabetes Risk Score for Type 2 diabetes prediction

### Musculoskeletal Health
- **FRAX Bone Health** - Calculates osteoporotic fracture risk assessment

### Mental Health
- **GAD-7 Anxiety Assessment** - Generalized Anxiety Disorder screening tool

### Pain Management
- **ODI Back Assessment** - Back pain assessment and treatment stratification

## 🛠 Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Modern UI component library
- **Lucide React** - Beautiful icon library

### Backend & CMS
- **PayloadCMS 3.56** - Headless CMS for content management
- **MongoDB** - Document database with Mongoose adapter
- **Lexical Editor** - Rich text editing capabilities

### Development & Testing
- **Playwright** - End-to-end testing framework
- **Vitest** - Unit and integration testing
- **ESLint** - Code linting and formatting
- **Docker** - Containerized development environment

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.20.2+ or 20.9.0+
- **pnpm** 9+ or 10+
- **MongoDB** (local or cloud instance)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd health-risk
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp test.env .env
   ```
   
   Configure your environment variables:
   ```env
   DATABASE_URI=mongodb://localhost:27017/health-risk
   PAYLOAD_SECRET=your-secret-key-here
   ```

4. **Start development server**
   ```bash
   npm dev
   ```

### Using Docker (Recommended)

1. **Start with Docker Compose**
   ```bash
   docker-compose up
   ```
   
   This will start:
   - Next.js application on `http://localhost:3000`
   - MongoDB database on `localhost:27017`

## 📁 Project Structure

```
src/
├── app/
│   ├── (frontend)/           # User-facing pages
│   │   ├── ascvd/           # ASCVD assessment
│   │   ├── findrisk/        # Diabetes risk assessment
│   │   ├── frax/            # Bone health assessment
│   │   ├── gad7/            # Anxiety assessment
│   │   └── start/           # Back pain assessment
│   └── (payload)/           # CMS admin interface
├── collections/             # PayloadCMS collections
├── components/
│   ├── profile/             # User profile management
│   ├── questionnaire/       # Generic questionnaire system
│   └── ui/                  # Reusable UI components
├── lib/
│   ├── data/questionnaires/ # Questionnaire definitions
│   ├── scorers/             # Risk calculation logic
│   ├── actions/             # Server actions
│   └── types/               # TypeScript definitions
└── contexts/                # React contexts
```


## 🏗 Architecture

### Questionnaire System

The platform uses a flexible, reusable questionnaire architecture:

1. **Questionnaire Definitions** - JSON files defining questions and options
2. **Generic Components** - Reusable form and result components
3. **Scoring Engines** - Modular risk calculation classes
4. **Type Safety** - Full TypeScript integration

### User Profile Management

- **Profile-First Approach** - Users create profiles before assessments
- **Data Persistence** - Profiles stored locally with optional cloud sync
- **Privacy Focused** - Minimal data collection, user-controlled

### Risk Assessment Flow

1. **Profile Creation** - User provides demographic information
2. **Questionnaire Completion** - Interactive, validated forms
3. **Risk Calculation** - Real-time scoring with validated algorithms
4. **Results Display** - Clear risk visualization and recommendations
5. **History Tracking** - Previous assessments and trends

## 🔐 Data & Privacy

- **Local-First** - User profiles stored in browser localStorage
- **Optional Persistence** - PayloadCMS for long-term storage
- **HIPAA Considerations** - Designed with healthcare privacy in mind
- **No PHI Storage** - Personal health information handled securely

## 🎨 UI/UX Features

- **Responsive Design** - Mobile-first, works on all devices
- **Accessibility** - WCAG compliant, keyboard navigation
- **Modern Interface** - Clean, medical-grade design
- **Risk Visualization** - Color-coded risk levels and badges
- **Progress Tracking** - Visual progress indicators
- **Multilingual Ready** - Spanish interface (extensible)

## 🔧 Customization

### Adding New Assessments

1. **Create Questionnaire JSON**
   ```json
   {
     "id": "new-assessment",
     "name": "New Assessment",
     "questions": [...]
   }
   ```

2. **Implement Scorer Class**
   ```typescript
   export class NewAssessmentScorer extends BaseScorer {
     calculateRisk(): RiskResult { ... }
   }
   ```

3. **Add Route and Components**
   - Create page in `app/(frontend)/new-assessment/`
   - Add form component
   - Update navigation

### Customizing Risk Calculations

Each assessment has its own scorer class in `src/lib/scorers/`. Extend `BaseScorer` to implement custom risk calculation logic.


## 🏥 Medical Disclaimer

This application is for educational and informational purposes only. It is not intended to replace professional medical advice, diagnosis, or treatment. Always consult with qualified healthcare providers for medical decisions.
