# Government Recruitment Portal

A comprehensive recruitment management system for government organizations with both user-facing and admin interfaces.

## 🚀 Quick Start

### Option 1: Automated Setup (Windows)
1. Extract all files to `C:\Users\DELL\Documents\drdo_project`
2. Double-click `START.bat`
3. Wait for installation to complete
4. Your browser will open automatically at `http://localhost:5173`

### Option 2: Manual Setup

```bash
# Navigate to project directory
cd C:\Users\DELL\Documents\drdo_project

# Install dependencies
npm install

# Start development server
npm run dev
```

## 📋 Prerequisites

- Node.js (v16 or higher) - [Download here](https://nodejs.org/)
- npm (comes with Node.js)

## 🔑 Login Credentials

### Admin Panel
- **Username:** admin
- **Password:** admin123

### User Portal
- No login required for browsing
- Registration required for application submission

## 📁 Project Structure

```
drdo_project/
├── src/
│   ├── AdminPanel.jsx     # Admin login & dashboard
│   ├── UserPortal.jsx     # User recruitment portal
│   ├── App.jsx            # Main app with navigation
│   ├── main.jsx           # Entry point
│   └── index.css          # Global styles
├── public/                # Static assets
├── index.html             # HTML template
├── package.json           # Dependencies
├── vite.config.js         # Vite configuration
├── tailwind.config.js     # Tailwind CSS config
├── postcss.config.js      # PostCSS config
└── START.bat              # Quick start script (Windows)
```

## ✨ Features

### User Portal
- View current job openings
- Check required documents
- Submit applications with document uploads
- Track application status in real-time
- Multi-stage progress tracking:
  - Application Submitted
  - Document Verification
  - Written Examination
  - Medical Examination
  - Background Verification
  - Final Clearance

### Admin Panel
- **Dashboard Overview**
  - Statistics for all recruitment stages
  - Quick stats and trends
  - Recent candidate activity
  
- **Candidate Management**
  - View all applications
  - Search and filter candidates
  - Update candidate status
  - Manage recruitment stages
  
- **Bulk Email Sender**
  - Send emails to candidate groups
  - Use predefined templates
  - Track email delivery
  
- **Hospital Management**
  - Manage medical examination centers
  - Track capacity and pending exams
  - Schedule management

## 🛠️ Technology Stack

- **Frontend:** React 18
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Language:** JavaScript

## 📱 Accessing the Application

After running `npm run dev`, the application will be available at:
- Local: http://localhost:5173
- Network: http://YOUR_IP:5173

### Navigation
1. **Home Page:** Choose between User Portal or Admin Panel
2. **User Portal:** Browse jobs, apply, and track applications
3. **Admin Panel:** Login required (admin/admin123)

## 🔧 Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🐛 Troubleshooting

### npm install fails
```bash
# Clear cache and reinstall
npm cache clean --force
npm install
```

### Port 5173 already in use
```bash
# Kill the process or use a different port
npm run dev -- --port 3000
```

### Module not found errors
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## 📞 Support

For technical support:
- Email: support@gov.in
- Helpline: 1800-XXX-XXXX

## 📄 License

© 2026 Government of India. All rights reserved.

---

## 🎯 Development Notes

### Adding New Features
1. Components are in `src/` folder
2. Update `App.jsx` for routing changes
3. Use Tailwind classes for styling

### Customization
- **Colors:** Edit `tailwind.config.js`
- **Branding:** Update logos in `public/` folder
- **Content:** Edit component text directly

### Deployment
```bash
# Build production version
npm run build

# Output will be in dist/ folder
# Deploy dist/ folder to your hosting service
```
