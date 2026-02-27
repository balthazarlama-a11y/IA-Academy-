import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { BrainCircuit, LogIn, LogOut, User } from "lucide-react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Navbar() {
  const { user, isLoading, isAuthenticated } = useAuth();

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="sticky top-0 z-50 w-full glass-panel border-b-0 border-b-white/5"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="p-2 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight">
              Aprende<span className="text-primary">IA</span>
            </span>
          </Link>

          {/* Auth Actions */}
          <div className="flex items-center gap-4">
            {!isLoading && (
              isAuthenticated && user ? (
                <div className="flex items-center gap-4">
                  <div className="hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-full bg-secondary/50 border border-white/5">
                    <Avatar className="w-8 h-8 border border-white/10">
                      <AvatarImage src={user.profileImageUrl || undefined} />
                      <AvatarFallback className="bg-primary/20 text-primary text-xs">
                        {user.firstName?.[0] || user.email?.[0]?.toUpperCase() || <User className="w-4 h-4" />}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium text-muted-foreground truncate max-w-[120px]">
                      {user.firstName || "Usuario"}
                    </span>
                  </div>
                  <a 
                    href="/api/logout"
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-white transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline">Salir</span>
                  </a>
                </div>
              ) : (
                <a 
                  href="/api/login"
                  className="flex items-center gap-2 px-6 py-2.5 rounded-full font-semibold bg-white text-black hover:bg-gray-200 hover:scale-105 active:scale-95 transition-all duration-200 shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)]"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Iniciar Sesión</span>
                </a>
              )
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
}
