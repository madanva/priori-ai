# Priori AI

A modern, responsive frontend for a healthcare AI app designed to streamline clinical prior authorization.

## Features

- Patient selection and management
- Authorization prediction with confidence scores
- Missing criteria identification with evidence attachment
- Draft letter generation and editing
- Export to PDF or EDI-278 transmission

## Tech Stack

- React + TypeScript
- Vite
- TailwindCSS
- Framer Motion for animations
- Zustand for state management
- React Router for navigation

## Getting Started

### Prerequisites

- Node.js 16+
- pnpm (recommended) or npm

### Installation

1. Clone the repository:

\`\`\`bash
git clone https://github.com/your-username/priori-ai.git
cd priori-ai
\`\`\`

2. Install dependencies:

\`\`\`bash
pnpm install
\`\`\`

3. Start the development server:

\`\`\`bash
pnpm dev
\`\`\`

This will start the app in development mode at http://localhost:5173.

## Project Structure

- `/src`: React UI components and pages
- `/src/components`: Reusable UI components
- `/src/hooks`: Zustand store for state management
- `/src/pages`: Route screens for the five main views
- `/public`: Static assets

## Screens

1. **Landing Page**: Patient selection
2. **Prediction Page**: Shows approval likelihood with confidence score
3. **Suggestions Page**: Two-pane layout with note excerpts and missing criteria
4. **Draft Page**: Rich text editor with diff view and copy to EHR functionality
5. **Export Page**: Summary card with PDF export and EDI-278 options

## Design Tokens

- Primary Color: #087E8B (Deep Teal)
- Background: #F5F7FA (Warm White)
- Success: #0CCE6B
- Alert: #FF9F1C
- Error: #E63946
- Text: #2D3748
- Secondary Text: #718096
- Border: #E2E8F0
- Highlight: #4299E1

## License

MIT
