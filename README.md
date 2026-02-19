# Government Recruitment Portal

A comprehensive recruitment management system for government organizations with both user-facing and admin interfaces.



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

