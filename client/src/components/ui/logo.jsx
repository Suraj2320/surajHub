export function SurajLogo() {
  return (
    <div className="flex items-center gap-2 group cursor-pointer">
      <div className="relative w-10 h-10">
        {/* Outer glow circle */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-400 via-orange-500 to-red-600 rounded-lg group-hover:shadow-2xl group-hover:shadow-orange-500/50 transition-all duration-300" />
        
        {/* Inner shine effect */}
        <div className="absolute inset-1 bg-gradient-to-br from-yellow-300 via-orange-400 to-red-500 rounded-md" />
        
        {/* Center glow */}
        <div className="absolute inset-2 bg-gradient-to-br from-white/80 to-yellow-100 rounded-sm flex items-center justify-center">
          {/* Sun/S icon */}
          <span className="text-2xl font-black bg-gradient-to-br from-orange-600 to-red-700 bg-clip-text text-transparent">
            S
          </span>
        </div>
        
        {/* Animated shine overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 animate-pulse rounded-lg" />
      </div>
      
      <div className="hidden sm:block">
        <h1 className="text-xl md:text-2xl font-black bg-gradient-to-r from-amber-400 via-orange-500 to-red-600 bg-clip-text text-transparent group-hover:from-amber-300 group-hover:via-orange-400 group-hover:to-red-500 transition-all">
          SurajHub
        </h1>
        <p className="text-xs text-muted-foreground font-semibold">Premium Shopping</p>
      </div>
    </div>
  );
}
