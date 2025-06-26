# RiskVision - Intelligent Risk Management

A comprehensive risk management application built with React, TypeScript, and Firebase. RiskVision helps teams identify, assess, and mitigate project risks with AI-powered insights and collaborative features.

## Features

### 🎯 Core Functionality
- **Project Management**: Create and manage multiple projects with team collaboration
- **Risk Assessment**: Comprehensive risk identification with probability and impact scoring
- **AI-Powered Insights**: Generate risks, mitigation strategies, and solutions using AI
- **Risk Matrix Visualization**: Interactive risk matrix for visual risk assessment
- **Team Collaboration**: Assign risks to team members and track progress
- **Export Capabilities**: Generate PDF reports and CSV exports

### 🔐 Authentication & Security
- Firebase Authentication with email/password and Google Sign-in
- Role-based access control
- Secure user profile management   etc 

### 📊 Analytics & Reporting
- Risk status tracking and analytics
- Comprehensive PDF report generation
- CSV export for data analysis
- Visual risk matrix with interactive tooltips

### 🎨 User Experience
- Modern, responsive design with Tailwind CSS
- Intuitive navigation and user interface
- Real-time updates and collaborative editing
- Mobile-friendly responsive layout

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Firebase (Firestore, Authentication)
- **AI Integration**: DeepSeek API for risk generation and mitigation strategies
- **Build Tool**: Vite
- **Icons**: Lucide React
- **PDF Generation**: html2pdf.js
- **Deployment**: Netlify

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Firebase project setup

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/riskvision.git
cd riskvision
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with your Firebase configuration:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

### Firebase Setup

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication with Email/Password and Google providers
3. Create a Firestore database
4. Set up Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Projects can be read/written by team members
    match /projects/{projectId} {
      allow read, write: if request.auth != null && 
        request.auth.token.email in resource.data.teamMembers;
      allow create: if request.auth != null;
    }
  }
}
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   ├── export/         # Export functionality
│   ├── layout/         # Layout components
│   ├── profile/        # User profile components
│   ├── project/        # Project management components
│   ├── risk/           # Risk management components
│   └── ui/             # Base UI components
├── context/            # React context providers
├── pages/              # Page components
├── services/           # API services
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── config/             # Configuration files
```

## Key Features

### Risk Management
- Create and categorize risks across multiple categories
- Assign probability and impact scores (1-10 scale)
- Automatic priority calculation (Critical, High, Medium, Low)
- Status tracking (Open, Mitigated, Closed)
- Tag-based organization

### AI-Powered Generation
- Generate project-specific risks based on industry and context
- Create detailed mitigation strategies with timelines and responsibilities
- Suggest practical solutions for identified risks
- Consider team composition and expertise in recommendations

### Collaboration
- Multi-user project access with team member management
- Email-based user search and invitation
- Role-based task assignment
- Real-time updates across team members

### Reporting & Export
- Comprehensive PDF reports with risk matrices and detailed analysis
- CSV export for external analysis
- Individual risk reports
- Visual risk matrix with interactive elements

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@riskvision.com or create an issue in this repository.

## Acknowledgments

- Built with [React](https://reactjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons by [Lucide](https://lucide.dev/)
- Powered by [Firebase](https://firebase.google.com/)
- AI capabilities by [DeepSeek](https://www.deepseek.com/)