# READPOINT - Frontend

Platform Literasi Digital dengan Gamifikasi - Frontend built with Next.js 16, React 19, and Tailwind CSS 4.

## 🎨 UI/UX Redesign Features

- **Modern Design**: Clean, professional interface with gradient backgrounds and smooth animations
- **Fully Responsive**: Optimized for mobile, tablet, and desktop devices
- **Accessibility**: Proper focus states, ARIA labels, and keyboard navigation
- **Performance**: Next.js 16 with Turbopack for fast development and production builds
- **Tailwind CSS 4**: Advanced styling with custom animations and components

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
frontend/
├── app/
│   ├── page.tsx           # Landing page
│   ├── layout.tsx         # Root layout
│   ├── globals.css        # Global styles & animations
│   ├── login/             # Login page
│   ├── register/          # Register page
│   ├── dashboard/         # Dashboard layout
│   ├── auth/              # Auth routes
│   └── providers.tsx      # Context providers
├── components/
│   ├── PDFReader.tsx      # E-book PDF viewer
│   ├── QuizInterface.tsx  # Quiz component
├── context/
│   └── AuthContext.tsx    # Authentication context
├── lib/
│   └── api.ts             # API utilities
├── public/
│   └── images/            # Static assets
├── tailwind.config.ts     # Tailwind configuration
├── postcss.config.mjs     # PostCSS configuration
├── next.config.ts         # Next.js configuration
└── tsconfig.json          # TypeScript configuration
```

## 🎯 Key Pages

- **Landing Page** (`/`): Hero section with features and statistics
- **Login** (`/login`): User authentication
- **Register** (`/register`): Account creation
- **Dashboard** (`/dashboard`): Protected user dashboard

## 🎨 Design System

### Colors
- **Primary**: Blue (#0ea5e9)
- **Accent**: Amber (#f59e0b)
- **Success**: Green (#10b981)
- **Danger**: Red (#ef4444)

### Typography
- **Headings**: Clamp values for responsive font sizes
- **Body**: Clean system fonts with optimal line-height

### Animations
- `fade-in`: Smooth opacity animation
- `slide-up/down/left/right`: Directional slide animations
- `scale-in`: Scale entrance animation
- `blob`: Floating blob animation
- `pulse-glow`: Pulsing glow effect

## 🔧 Technologies

- **Framework**: Next.js 16.1.6
- **UI Library**: React 19.2.3
- **Styling**: Tailwind CSS 4
- **Language**: TypeScript 5
- **Linting**: ESLint 9

## 🌐 Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

## 📱 Responsive Design

- **Mobile**: < 640px (sm breakpoint)
- **Tablet**: 640px - 1024px (md/lg breakpoints)
- **Desktop**: > 1024px (lg breakpoint)

## ✨ Features

- ✅ Modern gradient UI with animations
- ✅ Fully responsive design
- ✅ Dark mode ready (CSS variables)
- ✅ Accessibility compliant
- ✅ Performance optimized
- ✅ Clean, maintainable code

## 📝 Notes

- All components use Next.js best practices
- CSS is managed through Tailwind + global styles
- Authentication uses Laravel Sanctum
- Forms include validation and error handling

## 🤝 Contributing

Guidelines for code contributions:
- Follow the existing folder structure
- Use TypeScript for all new files
- Keep components small and focused
- Document complex logic with comments

## 📄 License

MIT

---

**READPOINT - Platform Literasi Digital Indonesia © 2026**

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
