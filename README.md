# RakitCV

A professional, modern web application designed to help job seekers build 100% Applicant Tracking System (ATS) compliant CVs. The builder restricts formatting to recruiter-approved guidelines (such as single-column layouts, standard typography, and clean text parsing) to ensure resumes successfully pass automated screening systems.

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-blue?style=flat-square&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

---

## Key Features

- **ATS-Compliant Rendering**: Enforces layout constraints (single-column, text-based PDF layers, standard margins, and clean section breaks) designed specifically for ATS parsers.
- **Interactive Step-by-Step Editor**: Easily input personal information, professional summary, work experience, education, skills, languages, and certifications.
- **Real-Time Interactive Preview**: See changes instantly alongside the data input forms before generating the PDF.
- **Local Storage Drafts**: Automatically saves progress locally to prevent data loss during the creation process.
- **High-Quality PDF Generation**: Seamless export to high-quality PDF files leveraging client-side PDF rendering.
- **Example Data Loader**: Import pre-filled template data with a single click to see how the system structures information.

---

## Tech Stack

### Frontend & Core
- **Framework**: [Next.js 16](https://nextjs.org/) (App Router architecture)
- **UI Library**: [React 19](https://react.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)

### State Management & Validation
- **State Management**: React Context API (with automated `localStorage` syncing)
- **Form Management**: [React Hook Form](https://react-hook-form.com/)
- **Schema Validation**: [Zod](https://zod.dev/)

### Styling & Document Generation
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) & PostCSS
- **PDF Compiler**: [@react-pdf/renderer](https://react-pdf.org/) (generates clean vector-based text PDFs directly in the browser)

---

## Screenshot / Demo

*Placeholder for the Application Preview:*

```
┌────────────────────────────────────────────────────────┐
│  [ Back ]              RakitCV      [ MODERN ]  │
├──────────────────────────┬─────────────────────────────┤
│                          │                             │
│  1. Personal Info [x]    │        John Doe             │
│  2. Summary       [x]    │     Software Engineer       │
│  3. Experience    [/]    │  ─────────────────────────  │
│  4. Education     [ ]    │                             │
│  5. Skills        [ ]    │  SUMMARY                    │
│  6. Additional    [ ]    │  Experienced engineer...    │
│                          │                             │
│  [ Prev ]      [ Next ]  │  EXPERIENCE                 │
│                          │  Senior Dev @ Tech Corp...  │
└──────────────────────────┴─────────────────────────────┘
```

*(Add actual screenshots of the landing page and builder dashboard here)*

---

## Prerequisites

Ensure you have the following installed on your machine:
- **Node.js**: `v18.x` or higher (Recommended: `v20.x` LTS)
- **npm** (comes with Node.js) or **yarn** / **pnpm** / **bun**

---

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/syahreza-satria/rakitcv.git
   cd rakitcv
   ```

2. **Install dependencies**:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

---

## How to Run

### Development Mode
Runs the application locally with Hot Module Replacement (HMR):
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### Production Build
Builds the optimized production assets:
```bash
npm run build
```

### Start Production Server
Starts the built Next.js application in production mode:
```bash
npm run start
```

### Code Linting
Runs ESLint static code analysis checks:
```bash
npm run lint
```

---

## Directory Structure

```
.
├── src/
│   ├── app/                 # Next.js App Router routes & pages
│   │   ├── builder/         # CV Builder interactive workspace & PDF download route
│   │   ├── favicon.ico
│   │   ├── globals.css      # Core styles & Tailwind directives
│   │   ├── layout.js        # Root HTML shell and provider wrapper
│   │   └── page.js          # Interactive landing page with ATS guidelines
│   ├── components/          # Reusable UI component layer
│   │   ├── form/            # Modular step-by-step input forms
│   │   ├── pdf/             # React-PDF Document template rendering configuration
│   │   └── preview/         # Browser-rendered CV preview panel
│   └── lib/                 # Core utilities
│       ├── schema.js        # Zod validation schema & default values
│       └── store.jsx        # Context store state provider with Local Storage syncing
├── next.config.mjs          # Next.js configuration
├── package.json             # Core dependencies and run scripts
└── postcss.config.mjs       # CSS processor configuration
```

### Key Folder Explanations
- **`src/components/pdf/`**: Contains the `PDFTemplate.jsx` template configuration which builds the absolute layout styling, font dimensions, and text rendering tags outputting the final PDF file.
- **`src/components/form/`**: Individual components dividing the CV sections. Standardized inputs utilize `react-hook-form` logic for easy validation.
- **`src/lib/store.jsx`**: Manages global application state, handling step increments, template styling toggles, standard dummy-data hydration, and automatic caching of draft data in local storage.

---

## Environment Variables

This project runs completely client-side in the browser and does not require any mandatory environment variables (`.env`) for local development or basic deployment.

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Author / Contact

- **Author**: Syahreza Satria
- **GitHub**: [@syahreza-satria](https://github.com/syahreza-satria)
