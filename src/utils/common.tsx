// Logo médical professionnel SVG inline
const AppLogo = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Fond circulaire avec gradient médical */}
    <circle
      cx="20"
      cy="20"
      r="18"
      fill="url(#medicalGradient)"
      stroke="url(#borderGradient)"
      strokeWidth="2"
    />
    
    {/* Croix médicale stylisée */}
    <path
      d="M18 10H22V30H18V10Z"
      fill="white"
      fillOpacity="0.95"
    />
    <path
      d="M10 18H30V22H10V18Z"
      fill="white"
      fillOpacity="0.95"
    />
    
    {/* Seringue/Vaccination - élément central */}
    <circle
      cx="20"
      cy="20"
      r="3"
      fill="url(#accentGradient)"
    />
    
    {/* Points décoratifs représentant la protection/immunité */}
    <circle cx="13" cy="13" r="1.5" fill="url(#accentGradient)" fillOpacity="0.8" />
    <circle cx="27" cy="13" r="1.5" fill="url(#accentGradient)" fillOpacity="0.8" />
    <circle cx="13" cy="27" r="1.5" fill="url(#accentGradient)" fillOpacity="0.8" />
    <circle cx="27" cy="27" r="1.5" fill="url(#accentGradient)" fillOpacity="0.8" />
    
    <defs>
      {/* Gradient principal - bleu médical du projet */}
      <linearGradient id="medicalGradient" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="oklch(0.6000 0.1800 220)" />
        <stop offset="100%" stopColor="oklch(0.5000 0.2000 220)" />
      </linearGradient>
      
      {/* Gradient de bordure */}
      <linearGradient id="borderGradient" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="oklch(0.7000 0.1500 220)" />
        <stop offset="100%" stopColor="oklch(0.4500 0.2200 220)" />
      </linearGradient>
      
      {/* Gradient d'accent - vert santé du projet */}
      <linearGradient id="accentGradient" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="oklch(0.6500 0.1600 160)" />
        <stop offset="100%" stopColor="oklch(0.5500 0.1800 160)" />
      </linearGradient>
    </defs>
  </svg>
);

export { AppLogo };