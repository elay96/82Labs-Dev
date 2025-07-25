export default function ThreeBackground() {
  return (
    <div className="absolute inset-0 opacity-30 overflow-hidden">
      {/* Floating geometric shapes using CSS animations */}
      <div className="absolute top-20 left-20 w-16 h-16 border-2 border-blue-400 rotate-45 animate-pulse"></div>
      <div className="absolute top-40 right-32 w-12 h-12 border-2 border-orange-400 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-60 left-1/3 w-20 h-20 border-2 border-green-600 transform rotate-12 animate-spin" style={{ animationDuration: '8s' }}></div>
      <div className="absolute bottom-40 right-20 w-14 h-14 border-2 border-cyan-400 rotate-45 animate-pulse" style={{ animationDelay: '2s' }}></div>
      <div className="absolute bottom-60 left-20 w-18 h-18 border-2 border-orange-500 rounded-full animate-bounce" style={{ animationDelay: '3s' }}></div>
      <div className="absolute top-80 right-1/4 w-16 h-16 border-2 border-blue-500 transform -rotate-12 animate-spin" style={{ animationDuration: '12s' }}></div>
      <div className="absolute bottom-20 left-1/2 w-12 h-12 border-2 border-green-500 rotate-45 animate-pulse" style={{ animationDelay: '4s' }}></div>
      <div className="absolute top-32 left-2/3 w-14 h-14 border-2 border-coral rounded-full animate-bounce" style={{ animationDelay: '1.5s' }}></div>
      
      {/* Gradient background overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 via-transparent to-orange-50/20 dark:from-blue-900/10 dark:via-transparent dark:to-orange-900/10"></div>
    </div>
  );
}
