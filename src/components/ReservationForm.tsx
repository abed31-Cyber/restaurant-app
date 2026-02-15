import { useState } from 'react';
import { Calendar, Clock, Users, User, Phone, Mail, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/useToast';
import { supabase } from '@/lib/supabase';
import type { OpeningHours } from '@/types';

interface ReservationFormProps {
  restaurantId: string;
  primaryColor: string;
  openingHours: OpeningHours[];
}

export function ReservationForm({ restaurantId, primaryColor, openingHours }: ReservationFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    guests: '2',
    notes: '',
  });

  const generateTimeSlots = () => {
    const slots: string[] = [];
    const selectedDate = new Date(formData.date);
    const dayOfWeek = selectedDate.getDay();
    const hours = openingHours.find(h => h.dayOfWeek === dayOfWeek);

    if (!hours || hours.isClosed) return slots;

    const [openHour, openMin] = hours.openTime.split(':').map(Number);
    const [closeHour, closeMin] = hours.closeTime.split(':').map(Number);

    let currentHour = openHour;
    let currentMin = openMin;

    while (currentHour < closeHour || (currentHour === closeHour && currentMin < closeMin)) {
      slots.push(`${String(currentHour).padStart(2, '0')}:${String(currentMin).padStart(2, '0')}`);
      currentMin += 30;
      if (currentMin >= 60) {
        currentHour++;
        currentMin = 0;
      }
    }

    return slots;
  };

  const timeSlots = generateTimeSlots();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from('Reservation').insert({
        restaurantId,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        date: formData.date,
        time: formData.time,
        guests: parseInt(formData.guests),
        notes: formData.notes,
        status: 'PENDING',
      } as any);

      if (error) throw error;

      toast.success('Réservation envoyée !', {
        description: 'Nous vous confirmerons par email dans les plus brefs délais.',
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        date: '',
        time: '',
        guests: '2',
        notes: '',
      });
    } catch (error) {
      toast.error('Erreur', {
        description: 'Impossible de créer la réservation. Veuillez réessayer.',
      });
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];
  const maxDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  return (
    <Card className="max-w-2xl mx-auto bg-neutral-900 border-neutral-800 shadow-2xl">
      <CardHeader className="border-b border-neutral-800 pb-6">
        <CardTitle className="text-3xl text-center text-white">Réserver une table</CardTitle>
        <p className="text-center text-gray-400 mt-2">Remplissez ce formulaire pour confirmer votre venue</p>
      </CardHeader>
      <CardContent className="pt-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal info */}
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-300">
                <User className="h-4 w-4 inline mr-2 text-primary" style={{ color: primaryColor }} />
                Nom complet <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Jean Dupont"
                className="bg-neutral-800 border-neutral-700 text-white placeholder:text-gray-500 focus-visible:ring-primary h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-gray-300">
                <Phone className="h-4 w-4 inline mr-2 text-primary" style={{ color: primaryColor }} />
                Téléphone <span className="text-red-500">*</span>
              </Label>
              <Input
                id="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="06 12 34 56 78"
                className="bg-neutral-800 border-neutral-700 text-white placeholder:text-gray-500 focus-visible:ring-primary h-11"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-300">
              <Mail className="h-4 w-4 inline mr-2 text-primary" style={{ color: primaryColor }} />
              Email <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="jean@exemple.com"
              className="bg-neutral-800 border-neutral-700 text-white placeholder:text-gray-500 focus-visible:ring-primary h-11"
            />
          </div>

          {/* Reservation details */}
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="date" className="text-gray-300">
                <Calendar className="h-4 w-4 inline mr-2 text-primary" style={{ color: primaryColor }} />
                Date <span className="text-red-500">*</span>
              </Label>
              <Input
                id="date"
                type="date"
                required
                min={today}
                max={maxDate}
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value, time: '' })}
                className="bg-neutral-800 border-neutral-700 text-white placeholder:text-gray-500 focus-visible:ring-primary h-11 [color-scheme:dark]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time" className="text-gray-300">
                <Clock className="h-4 w-4 inline mr-2 text-primary" style={{ color: primaryColor }} />
                Heure <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.time}
                onValueChange={(value) => setFormData({ ...formData, time: value })}
                disabled={!formData.date || timeSlots.length === 0}
              >
                <SelectTrigger className="bg-neutral-800 border-neutral-700 text-white h-11">
                  <SelectValue placeholder={timeSlots.length === 0 ? 'Fermé' : 'Choisir'} />
                </SelectTrigger>
                <SelectContent className="bg-neutral-800 border-neutral-700 text-white">
                  {timeSlots.map((time) => (
                    <SelectItem key={time} value={time} className="focus:bg-neutral-700 focus:text-white cursor-pointer">
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="guests" className="text-gray-300">
                <Users className="h-4 w-4 inline mr-2 text-primary" style={{ color: primaryColor }} />
                Personnes <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.guests}
                onValueChange={(value) => setFormData({ ...formData, guests: value })}
              >
                <SelectTrigger className="bg-neutral-800 border-neutral-700 text-white h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-neutral-800 border-neutral-700 text-white">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                    <SelectItem key={num} value={String(num)} className="focus:bg-neutral-700 focus:text-white cursor-pointer">
                      {num} {num === 1 ? 'personne' : 'personnes'}
                    </SelectItem>
                  ))}
                  <SelectItem value="9+" className="focus:bg-neutral-700 focus:text-white cursor-pointer">9+ personnes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-gray-300">
              <MessageSquare className="h-4 w-4 inline mr-2 text-primary" style={{ color: primaryColor }} />
              Demandes spéciales
            </Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Anniversaire, allergies, table près de la fenêtre..."
              rows={3}
              className="bg-neutral-800 border-neutral-700 text-white placeholder:text-gray-500 focus-visible:ring-primary resize-none"
            />
          </div>

          <Button
            type="submit"
            className="w-full text-white font-bold text-lg h-12 shadow-lg hover:brightness-110 transition-all"
            style={{ backgroundColor: primaryColor }}
            disabled={loading || !formData.time}
          >
            {loading ? 'Envoi...' : 'Confirmer la réservation'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
