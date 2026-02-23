# Strubloid - Portfolio & Blog

A modern portfolio and blog website built with Next.js, featuring a contact form, artistic gallery, and more.

[![Netlify Status](https://api.netlify.com/api/v1/badges/dd62d2ac-1ab3-4a1b-98a6-828a588a9be6/deploy-status)](https://app.netlify.com/sites/strubloid/deploys)

## Overview

This project showcases modern web development practices with ReactJS, Next.js, and serverless deployment on Netlify. It serves as both a portfolio and demonstration of full-stack capabilities.

## Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | Next.js 15 (React) |
| Language | TypeScript |
| Styling | Sass/SCSS |
| Database | MongoDB |
| Email Service | Sendgrid/Resend |
| Authentication | Google ReCAPTCHA v3 |
| Maps | Google Maps API |
| Parallax | Rellax |
| Hosting | Netlify |
| Package Manager | npm |
| Node Version | 20+ |

## Features

- **Portfolio Section** - Showcase projects and work experience
- **Artistic Gallery** - Integration with Flickr API for photo galleries
- **Contact Form** - Fully functional contact form with email notifications
- **Responsive Design** - Mobile-first design with organic warm color scheme
- **Dynamic Content** - Data-driven pages with MongoDB integration
- **Type Safety** - Full TypeScript support throughout the application

## Project Structure

```
strubloid-on-nextjs/
├── pages/                          # Next.js pages & API routes
│   ├── api/                        # Backend API endpoints
│   │   ├── contact/               # Contact form endpoint
│   │   └── github/                # GitHub integration
│   ├── about-me.tsx               # About page
│   ├── artistic.tsx               # Artistic gallery page
│   ├── contact-me.tsx             # Contact page
│   ├── index.tsx                  # Homepage
│   └── _app.tsx                   # App wrapper
├── src/
│   ├── features/                  # Feature-based modules
│   │   ├── contact/              # Contact feature
│   │   ├── home/                 # Home page components
│   │   └── [feature]/            # Other features
│   ├── shared/                   # Shared resources
│   │   ├── components/           # Reusable components
│   │   ├── hooks/                # Custom React hooks
│   │   ├── styles/               # Global & shared styles
│   │   ├── types/                # TypeScript type definitions
│   │   └── utils/                # Utility functions
│   └── lib/                      # External libraries & services
│       └── db/                   # Database models & connection
├── public/
│   ├── fonts/                    # Custom fonts
│   └── [static assets]/          # Static files
├── types/                        # Global TypeScript declarations
└── netlify.toml                  # Netlify configuration
```

## Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn
- MongoDB connection string
- API keys for: Google Maps, Google ReCAPTCHA, Sendgrid/Resend

### Installation

```bash
# Clone repository
git clone https://github.com/strubloid/strubloid-on-nextjs
cd strubloid-on-nextjs

# Install dependencies
npm install

# Create .env file with required variables
cp .env_sample .env
```

### Environment Variables

```env
# Database
NEXT_PUBLIC_MONGO_URI=your_mongodb_connection_string

# APIs
NEXT_PUBLIC_GOOGLE_KEY=your_google_maps_api_key
NEXT_PUBLIC_SITE_RECAPTCHA_KEY=your_recaptcha_site_key
NEXT_PUBLIC_SITE_RECAPTCHA_SECRET=your_recaptcha_secret_key

# Email Service
NEXT_PUBLIC_RESEND_API_KEY=your_resend_api_key
NEXT_PUBLIC_GMAIL=your_gmail_address
NEXT_PUBLIC_MAIL=your_contact_email

# Server
NEXT_PUBLIC_SERVER_URL=http://localhost:3000

# Flickr (Optional)
NEXT_PUBLIC_STRUBLOID_FLICKR_ID=your_flickr_id
NEXT_PUBLIC_STRUBLOID_FLICKR_KEY=your_flickr_key
NEXT_PUBLIC_STRUBLOID_FLICKR_KEY_SECRET=your_flickr_secret
NEXT_PUBLIC_STRUBLOID_FLICKR_NSID=your_flickr_nsid
```

### Development

```bash
# Start development server
npm run dev

# Open http://localhost:3000
```

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

## Pages

- **/** - Homepage with introduction
- **/about-me** - About section with timeline and skills
- **/artistic** - Gallery featuring Flickr photos
- **/contact-me** - Contact form with Google Maps integration

## API Endpoints

- `POST /api/contact/send` - Send contact form message
- `GET /api/github` - Fetch GitHub profile data

## Notes

- Contact form is disabled on localhost without valid `NEXT_PUBLIC_GOOGLE_KEY`
- Styles are organized in `src/shared/styles/` with global and component-specific SCSS
- All components use TypeScript for type safety
- Database models are in `src/lib/db/models/`

## Deployment

Deployed on Netlify with automatic builds from the main branch. Configuration in `netlify.toml`.

---

For more information or inquiries, visit [strubloid.com](https://strubloid.com)