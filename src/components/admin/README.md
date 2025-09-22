# Admin Dashboard Components

This directory contains all the components for the admin dashboard built with shadcn/ui components.

## Overview

The admin dashboard provides a comprehensive interface for managing the health risk assessment platform. It includes:

- **Dashboard Overview**: Statistics, charts, and recent activity
- **User Management**: View and manage all system users
- **Submissions Analysis**: Review and analyze questionnaire submissions
- **Questionnaire Management**: Manage available assessments
- **Analytics**: Detailed insights and trends
- **Settings**: System configuration and administrative tools

## Components

### Layout Components
- `AdminSidebar.tsx` - Collapsible sidebar navigation with role-based menu items
- `AdminHeader.tsx` - Header with breadcrumbs, search, notifications, and user menu
- `AdminLayout.tsx` - Main layout wrapper with authentication and permission checks

### Dashboard Components
- `DashboardStats.tsx` - Key metrics cards with trends
- `RecentSubmissions.tsx` - Latest submission activity feed
- `UserGrowthChart.tsx` - User registration trends visualization
- `RiskDistributionChart.tsx` - Risk level distribution analytics

### Data Tables
- `UsersDataTable.tsx` - Comprehensive user management table
- `SubmissionsDataTable.tsx` - Questionnaire submissions with filtering
- `QuestionnairesDataTable.tsx` - Assessment management interface

### Analytics Components
- `AnalyticsOverview.tsx` - High-level analytics metrics
- `RiskTrendsChart.tsx` - Monthly risk trend analysis
- `QuestionnairePerformance.tsx` - Usage statistics by assessment type

### Settings
- `AdminSettings.tsx` - System configuration and administrative tools

## Features

### Role-Based Access Control
- **Super Admin**: Full system access including user management and system settings
- **Admin**: Standard administrative access with data viewing and questionnaire management

### Data Visualization
- Interactive charts and graphs using custom CSS animations
- Risk distribution analysis with color-coded categories
- Monthly trends and growth patterns
- Performance metrics for each questionnaire type

### User Management
- View all users with profile information
- Filter and search capabilities
- Role-based badges and status indicators
- BMI calculation and health categorization

### Submission Analysis
- Comprehensive view of all questionnaire submissions
- Risk level categorization and filtering
- Detailed submission history and patterns
- Export capabilities for data analysis

### Responsive Design
- Mobile-first responsive layout
- Collapsible sidebar for mobile devices
- Adaptive grid layouts for different screen sizes
- Touch-friendly interface elements

## Usage

### Accessing the Dashboard
The admin dashboard is available at `/client` and requires authentication with admin or superadmin role.

### Navigation
- Use the sidebar to navigate between different sections
- Breadcrumbs show current location within the dashboard
- Search functionality in the header for quick access

### Data Export
- Export user data, submissions, and analytics
- Multiple format support for data analysis
- Filtered export based on current view settings

## Styling

The components use:
- **shadcn/ui** components for consistent design
- **Tailwind CSS** for styling and responsive design
- **Lucide React** icons for visual elements
- **Custom color schemes** for risk categorization

## Dependencies

- `@tanstack/react-table` - Advanced table functionality
- `date-fns` - Date formatting and manipulation
- `next/navigation` - Next.js routing
- `payload` - CMS integration and authentication
