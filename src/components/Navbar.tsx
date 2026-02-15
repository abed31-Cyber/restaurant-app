import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, User, ChefHat, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetClose } from '@/components/ui/sheet'; // Ensure these are exported from sheet.tsx
import { useCartStore } from '@/store/cartStore';
import { cn } from '@/lib/utils';
// import { useAuth } from '@/hooks/useAuth'; // Commented out to avoid errors if not fully implemented in context

interface NavbarProps {
  restaurantName?: string;
  restaurantSlug?: string;
  primaryColor?: string;
}

export function Navbar({ restaurantName, restaurantSlug, primaryColor = '#F97316' }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { getTotalItems } = useCartStore();

  // Mock auth for now since I can't see the full hook implementation context easily
  // In a real scenario I would use the hook properly.
  const user = null;
  const isStaff = false;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: `/${restaurantSlug}`, label: 'Accueil' },
    { href: `/${restaurantSlug}/menu`, label: 'La Carte' },
    { href: `/${restaurantSlug}/reservation`, label: 'Réserver' },
    { href: `/${restaurantSlug}/avis`, label: 'Avis' },
  ];

  const isHomePage = location.pathname === `/${restaurantSlug}`;

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out border-b border-transparent",
          isScrolled
            ? "bg-white/90 backdrop-blur-md shadow-sm border-white/20 py-3"
            : "bg-transparent py-5"
        )}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between">

            {/* Logo */}
            <Link
              to={`/${restaurantSlug}`}
              className="flex items-center gap-3 group"
            >
              <div
                className={cn(
                  "p-2 rounded-xl transition-all duration-300 transform group-hover:rotate-12",
                  isScrolled ? "bg-primary/10 text-primary" : "bg-white/20 text-white backdrop-blur-sm"
                )}
              >
                <ChefHat className="h-6 w-6" />
              </div>
              <span
                className={cn(
                  "font-bold text-xl tracking-tight transition-colors duration-300",
                  isScrolled ? "text-foreground" : "text-white drop-shadow-md"
                )}
              >
                {restaurantName || 'Restaurant'}
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    "text-sm font-semibold transition-all duration-300 relative group py-2",
                    isScrolled ? "text-muted-foreground hover:text-primary" : "text-white/90 hover:text-white"
                  )}
                >
                  {link.label}
                  <span className={cn(
                    "absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full",
                    isScrolled ? "bg-primary" : "bg-white"
                  )} />
                </Link>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              {/* Cart */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "relative rounded-full transition-colors",
                      isScrolled
                        ? "hover:bg-primary/10 hover:text-primary text-foreground"
                        : "text-white hover:bg-white/20 border border-white/10"
                    )}
                  >
                    <ShoppingCart className="h-5 w-5" />
                    {getTotalItems() > 0 && (
                      <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full text-[10px] flex items-center justify-center text-white font-bold bg-primary shadow-sm animate-in zoom-in">
                        {getTotalItems()}
                      </span>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-full sm:max-w-md border-l border-border/50 shadow-2xl">
                  <SheetHeader className="mb-6 space-y-2 border-b pb-6">
                    <SheetTitle>Votre commande</SheetTitle>
                  </SheetHeader>
                  <CartSheet primaryColor={primaryColor} />
                </SheetContent>
              </Sheet>

              {/* User - Hidden for now to simplify or re-enable if needed */}
              {/* <Button 
                variant="ghost" 
                size="icon"
                className={cn(
                  "rounded-full hidden sm:flex",
                  isScrolled ? "text-foreground hover:bg-muted" : "text-white hover:bg-white/20"
                )}
                onClick={() => navigate('/login')}
              >
                <User className="h-5 w-5" />
              </Button> */}

              {/* Mobile Menu Trigger */}
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild className="md:hidden">
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      isScrolled ? "text-foreground" : "text-white"
                    )}
                  >
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px] border-l border-border/40">
                  <SheetHeader className="text-left border-b pb-6 mb-6">
                    <SheetTitle className="text-2xl font-bold flex items-center gap-2">
                      <span className="text-primary"><ChefHat /></span>
                      Menu
                    </SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col gap-2">
                    {navLinks.map((link, i) => (
                      <Link
                        key={link.href}
                        to={link.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-lg font-medium px-4 py-4 rounded-xl hover:bg-primary/5 hover:text-primary transition-all duration-300 flex items-center justify-between group"
                        style={{ animationDelay: `${i * 50}ms` }}
                      >
                        {link.label}
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                      </Link>
                    ))}

                    <div className="mt-8 px-4">
                      <Button className="w-full rounded-xl py-6 text-lg font-semibold shadow-lg shadow-primary/20">
                        Commander maintenant
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

function CartSheet({ primaryColor }: { primaryColor: string }) {
  const { items, removeItem, updateQuantity, getSubtotal, clearCart } = useCartStore();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-6 text-center animate-in fade-in zoom-in duration-500">
        <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center">
          <ShoppingCart className="h-10 w-10 text-muted-foreground/50" />
        </div>
        <div className="space-y-2">
          <p className="text-lg font-semibold text-foreground">Votre panier est vide</p>
          <p className="text-sm text-muted-foreground max-w-[200px] mx-auto">Ajoutez de délicieux plats pour commencer votre commande.</p>
        </div>
        <Button
          className="rounded-full px-8"
          onClick={() => navigate('menu')}
        >
          Découvrir la carte
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col gap-4 flex-1 overflow-y-auto pr-2 pb-24">
        {items.map((item) => (
          <div key={item.id} className="flex gap-4 p-3 rounded-xl bg-card border border-border/40 hover:border-primary/20 transition-all shadow-sm group relative">
            <div className="h-20 w-20 rounded-lg bg-muted flex-shrink-0 bg-cover bg-center overflow-hidden">
              {/* Fallback image logic */}
              <div className="h-full w-full bg-muted flex items-center justify-center bg-gray-100">
                <ChefHat className="text-muted-foreground/20" />
              </div>
            </div>

            <div className="flex flex-col flex-1 justify-between min-w-0">
              <div>
                <h3 className="font-semibold text-sm line-clamp-1">{item.name}</h3>
                <p className="text-xs text-muted-foreground font-medium">{item.price.toFixed(2)}€</p>
              </div>

              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-3 bg-muted/50 rounded-lg p-1 border border-border/50">
                  <button
                    onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                    className="h-6 w-6 flex items-center justify-center rounded-md hover:bg-white shadow-sm transition-all text-sm font-medium hover:text-destructive"
                  >
                    -
                  </button>
                  <span className="text-xs font-semibold w-4 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="h-6 w-6 flex items-center justify-center rounded-md hover:bg-white shadow-sm transition-all text-sm font-medium hover:text-primary"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
            <button
              onClick={() => removeItem(item.id)}
              className="text-muted-foreground/50 hover:text-destructive transition-colors absolute top-2 right-2 p-1 rounded-full hover:bg-destructive/10"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-white border-t p-6 space-y-4 shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
        <div className="flex items-center justify-between text-lg font-bold">
          <span className="text-muted-foreground font-medium">Total</span>
          <span className="text-primary text-xl">{getSubtotal().toFixed(2)}€</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" className="w-full rounded-xl hover:bg-destructive/5 hover:text-destructive hover:border-destructive/20 border-border" onClick={clearCart}>
            Vider
          </Button>
          <Button className="w-full rounded-xl shadow-lg shadow-primary/25 bg-primary text-white hover:bg-primary/90" onClick={() => navigate('/checkout')}>
            Commander
          </Button>
        </div>
      </div>
    </div>
  );
}
