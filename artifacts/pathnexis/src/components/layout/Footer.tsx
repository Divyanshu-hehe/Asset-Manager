import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="border-t bg-background py-12 px-4 md:px-6">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1 space-y-4">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              PathNexis AI
            </span>
          </Link>
          <p className="text-sm text-muted-foreground">
            The career GPS for overlooked talent. Bridging talent to opportunity through AI-powered tools.
          </p>
        </div>
        
        <div className="space-y-4">
          <h4 className="font-semibold">Product</h4>
          <ul className="space-y-2">
            <li>
              <Link href="/features" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Features
              </Link>
            </li>
            <li>
              <Link href="/pricing" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Pricing
              </Link>
            </li>
          </ul>
        </div>
        
        <div className="space-y-4">
          <h4 className="font-semibold">Resources</h4>
          <ul className="space-y-2">
            <li>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Blog
              </a>
            </li>
            <li>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Success Stories
              </a>
            </li>
            <li>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Career Guide
              </a>
            </li>
          </ul>
        </div>
        
        <div className="space-y-4">
          <h4 className="font-semibold">Company</h4>
          <ul className="space-y-2">
            <li>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                About Us
              </a>
            </li>
            <li>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Contact
              </a>
            </li>
            <li>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Privacy Policy
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="container mx-auto mt-12 pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} PathNexis AI. All rights reserved.
        </p>
        <div className="flex gap-4">
          <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
            Twitter
          </a>
          <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
            LinkedIn
          </a>
          <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
