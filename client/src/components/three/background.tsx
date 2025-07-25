export default function OrganicBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Voronoi/Cell Pattern Base */}
      <div className="absolute inset-0 voronoi-bg"></div>
      <div className="absolute inset-0 cell-pattern"></div>
      
      {/* Floating Organic Cells */}
      <div className="absolute top-20 left-20 w-24 h-24 float-organic">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <path d="M20,50 Q30,20 50,30 Q70,20 80,50 Q70,80 50,70 Q30,80 20,50Z" 
                fill="none" stroke="var(--soft-mint)" strokeWidth="2" opacity="0.6"/>
        </svg>
      </div>
      
      <div className="absolute top-40 right-32 w-32 h-32 float-organic" style={{ animationDelay: '1s' }}>
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <path d="M25,40 Q45,15 65,35 Q85,25 75,55 Q85,75 65,65 Q45,85 25,65 Q15,45 25,40Z" 
                fill="none" stroke="var(--coral-bright)" strokeWidth="1.5" opacity="0.4"/>
        </svg>
      </div>
      
      <div className="absolute bottom-32 left-1/3 w-28 h-28 float-organic" style={{ animationDelay: '2.5s' }}>
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <path d="M30,25 Q55,10 70,35 Q85,50 70,70 Q55,85 30,75 Q15,60 15,45 Q15,35 30,25Z" 
                fill="none" stroke="var(--electric-cyan)" strokeWidth="2" opacity="0.5"/>
        </svg>
      </div>
      
      <div className="absolute top-60 right-1/4 w-20 h-20 float-organic" style={{ animationDelay: '4s' }}>
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <path d="M35,30 Q50,15 65,30 Q80,45 65,60 Q50,75 35,60 Q20,45 35,30Z" 
                fill="none" stroke="var(--neural-purple)" strokeWidth="1.8" opacity="0.7"/>
        </svg>
      </div>
      
      <div className="absolute bottom-20 right-20 w-36 h-36 float-organic" style={{ animationDelay: '3s' }}>
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <path d="M25,30 Q40,10 60,25 Q80,15 85,45 Q80,70 60,75 Q40,90 25,70 Q10,50 10,40 Q10,35 25,30Z" 
                fill="none" stroke="var(--warm-amber)" strokeWidth="1.5" opacity="0.3"/>
        </svg>
      </div>
      
      {/* Neural Network Connections */}
      <svg className="absolute inset-0 w-full h-full opacity-20">
        <defs>
          <linearGradient id="connectionGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--soft-mint)" />
            <stop offset="50%" stopColor="var(--electric-cyan)" />
            <stop offset="100%" stopColor="var(--neural-purple)" />
          </linearGradient>
        </defs>
        <path d="M100,200 Q300,150 500,300 Q700,250 900,400" 
              fill="none" stroke="url(#connectionGrad)" strokeWidth="1" opacity="0.4"/>
        <path d="M150,500 Q350,400 550,600 Q750,500 950,700" 
              fill="none" stroke="url(#connectionGrad)" strokeWidth="1" opacity="0.3"/>
        <path d="M50,700 Q250,600 450,800 Q650,700 850,900" 
              fill="none" stroke="url(#connectionGrad)" strokeWidth="1" opacity="0.2"/>
      </svg>
    </div>
  );
}
