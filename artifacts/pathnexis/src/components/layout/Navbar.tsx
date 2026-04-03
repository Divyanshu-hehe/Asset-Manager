import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [location] = useLocation();
  const { isLoggedIn, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "Features", href: "/features" },
    { name: "Pricing", href: "/pricing" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              PathNexis AI
            </span>
          </Link>
          <nav className="hidden md:flex gap-6">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location === item.href ? "text-primary" : "text-muted-foreground"
                }`}
                data-testid={`link-nav-${item.name.toLowerCase()}`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        
        <div className="hidden md:flex items-center gap-4">
          {isLoggedIn ? (
            <>
              <Link href="/dashboard">
                <Button variant="ghost" data-testid="button-nav-dashboard">Dashboard</Button>
              </Link>
              <Button variant="outline" onClick={logout} data-testid="button-nav-logout">Log out</Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" data-testid="button-nav-login">Log in</Button>
              </Link>
              <Link href="/signup">
                <Button data-testid="button-nav-signup">Sign up</Button>
              </Link>
            </>
          )}
        </div>

        <button
          className="md:hidden p-2 text-foreground"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          data-testid="button-mobile-menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b bg-background px-4 py-4 space-y-4">
          <nav className="flex flex-col gap-4">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location === item.href ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {item.name}
              </Link>
            ))}
            {isLoggedIn ? (
              <>
                <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                  <span className="text-sm font-medium text-muted-foreground hover:text-primary">Dashboard</span>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-left text-sm font-medium text-muted-foreground hover:text-primary"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <span className="text-sm font-medium text-muted-foreground hover:text-primary">Log in</span>
                </Link>
                <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                  <span className="text-sm font-medium text-primary">Sign up</span>
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
