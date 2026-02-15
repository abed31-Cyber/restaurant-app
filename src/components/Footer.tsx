import { MapPin, Phone, Mail, Clock, Instagram, Facebook, ChefHat, Twitter, Linkedin } from 'lucide-react';
import type { OpeningHours } from '@/types';
import { Button } from '@/components/ui/button';

interface FooterProps {
  restaurantName: string;
  address?: string;
  phone?: string;
  email?: string;
  openingHours?: OpeningHours[]; // Make optional just in case
  primaryColor: string;
}

const daysOfWeek = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

export function Footer({
  restaurantName,
  address,
  phone,
  email,
  openingHours = [],
  primaryColor
}: FooterProps) {
  const currentYear = new Date().getFullYear();

  // Sort hours starting from Monday (1) to Sunday (0)
  const sortedHours = [...openingHours].sort((a, b) => {
    const dayA = a.dayOfWeek === 0 ? 7 : a.dayOfWeek;
    const dayB = b.dayOfWeek === 0 ? 7 : b.dayOfWeek;
    return dayA - dayB;
  });

  return (
    <footer className="bg-neutral-950 text-white pt-20 pb-10 overflow-hidden relative">

      {/* Decorative gradient blob */}
      <div
        className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[120px] opacity-10 pointer-events-none"
        style={{ backgroundColor: primaryColor }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">

          {/* Brand Column */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <ChefHat className="h-8 w-8" style={{ color: primaryColor }} />
              <h3 className="text-2xl font-bold tracking-tight">{restaurantName}</h3>
            </div>
            <p className="text-gray-400 leading-relaxed max-w-sm">
              L'excellence gastronomique accessible. Des produits frais, une cuisine passionnée et une ambiance chaleureuse pour vos moments précieux.
            </p>
            <div className="flex gap-4 pt-2">
              {[Instagram, Facebook, Twitter, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300 border border-white/10 hover:border-transparent group"
                >
                  <Icon className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-lg font-bold">Navigation</h4>
            <ul className="space-y-3">
              {['Accueil', 'Menu', 'Réservation', 'A propos', 'Contact'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-gray-400 hover:text-primary transition-colors hover:pl-2 duration-300 inline-block">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h4 className="text-lg font-bold">Contactez-nous</h4>
            <ul className="space-y-4">
              {address && (
                <li className="flex items-start gap-4 text-gray-400 group">
                  <MapPin className="h-5 w-5 mt-1 shrink-0 group-hover:text-primary transition-colors" />
                  <span className="text-sm font-medium">{address}</span>
                </li>
              )}
              {phone && (
                <li className="flex items-center gap-4 text-gray-400 group">
                  <Phone className="h-5 w-5 shrink-0 group-hover:text-primary transition-colors" />
                  <span className="text-sm font-medium">{phone}</span>
                </li>
              )}
              {email && (
                <li className="flex items-center gap-4 text-gray-400 group">
                  <Mail className="h-5 w-5 shrink-0 group-hover:text-primary transition-colors" />
                  <span className="text-sm font-medium">{email}</span>
                </li>
              )}
            </ul>
          </div>

          {/* Opening Hours */}
          <div className="space-y-6 bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-sm">
            <h4 className="text-lg font-bold flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              <span>Horaires</span>
            </h4>
            <div className="space-y-3">
              {sortedHours.length > 0 ? sortedHours.map((hours) => (
                <div key={hours.id} className="flex justify-between text-sm py-1 border-b border-white/5 last:border-0">
                  <span className="text-gray-400 font-medium w-12">{daysOfWeek[hours.dayOfWeek]}</span>
                  <span className={hours.isClosed ? 'text-red-400 font-semibold' : 'text-gray-200'}>
                    {hours.isClosed ? 'Fermé' : `${hours.openTime} - ${hours.closeTime}`}
                  </span>
                </div>
              )) : (
                <p className="text-gray-500 text-sm">Horaires non disponibles</p>
              )}
            </div>

            <Button className="w-full mt-4" style={{ backgroundColor: primaryColor }}>
              Réserver une table
            </Button>
          </div>

        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>© {currentYear} {restaurantName}. Tous droits réservés.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-primary transition-colors">Mentions légales</a>
            <a href="#" className="hover:text-primary transition-colors">Confidentialité</a>
            <a href="#" className="hover:text-primary transition-colors">CGV</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
