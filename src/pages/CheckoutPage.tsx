import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Banknote, Truck, Store, Clock, Calendar, User, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/useToast';
import { useCartStore } from '@/store/cartStore';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export function CheckoutPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { 
    items, 
    getSubtotal, 
    orderType, 
    setOrderType, 
    pickupTime, 
    setPickupTime,
    customerInfo,
    setCustomerInfo,
    restaurantId,
    clearCart 
  } = useCartStore();
  
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'ONLINE' | 'CASH' | 'CARD_ON_SITE'>('ONLINE');

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-white">
        <div className="text-center space-y-4">
          <div className="bg-white/5 p-6 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="h-10 w-10 text-gray-400" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Votre panier est vide</h1>
          <p className="text-gray-400 max-w-md mx-auto mb-8">Il semble que vous n'ayez pas encore fait votre choix. Découvrez nos délicieux plats !</p>
          <Button onClick={() => navigate(-1)} size="lg" className="bg-[#F5761A] hover:bg-[#F5761A]/90 text-white">Retour au menu</Button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (paymentMethod === 'ONLINE') {
        // Stripe payment flow
        const response = await fetch('/api/create-payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items,
            customerInfo,
            orderType,
            pickupTime,
            restaurantId,
          }),
        });

        const { clientSecret } = await response.json();
        const stripe = await stripePromise;
        
        if (!stripe) throw new Error('Stripe not loaded');

        const { error } = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: { token: 'tok_visa' }, // Simplified for demo
            billing_details: {
              name: customerInfo.name,
              email: customerInfo.email,
              phone: customerInfo.phone,
            },
          },
        });

        if (error) throw error;
      }

      // Create order
      const orderData = {
        restaurantId,
        items: items.map(item => ({
          dishId: item.dishId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          options: item.selectedOptions,
          notes: item.notes,
        })),
        totalPrice: getSubtotal(),
        subtotal: getSubtotal(),
        orderType,
        pickupTime: pickupTime?.toISOString(),
        paymentMethod,
        paymentStatus: paymentMethod === 'ONLINE' ? 'PAID' : 'PENDING',
        customerName: customerInfo.name,
        customerPhone: customerInfo.phone,
        customerEmail: customerInfo.email,
        notes: '',
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) throw new Error('Failed to create order');

      toast.success('Commande confirmée !', {
        description: paymentMethod === 'ONLINE' 
          ? 'Votre paiement a été accepté.' 
          : 'Paiement sur place lors du retrait.',
      });

      clearCart();
      navigate('/confirmation');
    } catch (error) {
      toast.error('Erreur', {
        description: 'Impossible de finaliser la commande.',
      });
    } finally {
      setLoading(false);
    }
  };

  const generateTimeSlots = () => {
    const slots: Date[] = [];
    const now = new Date();
    const start = new Date(now);
    start.setMinutes(Math.ceil(start.getMinutes() / 15) * 15, 0, 0);
    
    for (let i = 0; i < 48; i++) {
      const slot = new Date(start);
      slot.setMinutes(slot.getMinutes() + i * 15);
      if (slot.getHours() >= 11 && slot.getHours() <= 21) {
        slots.push(slot);
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  return (
    <div className="min-h-screen bg-neutral-950 text-white pb-20">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <Button 
            variant="ghost" 
            onClick={() => navigate(-1)} 
            className="mb-8 text-gray-400 hover:text-white hover:bg-white/5 -ml-4"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Retour au menu
        </Button>

        <h1 className="text-4xl font-bold mb-10 tracking-tight">Finaliser votre commande</h1>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Form */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Order type */}
            <Card className="bg-neutral-900 border-neutral-800 shadow-xl overflow-hidden">
              <CardHeader className="border-b border-neutral-800 pb-4">
                <CardTitle className="text-xl text-white">Mode de récupération</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <RadioGroup
                  value={orderType}
                  onValueChange={(v) => setOrderType(v as any)}
                  className="grid sm:grid-cols-3 gap-4"
                >
                  <div className="relative">
                    <RadioGroupItem value="PICKUP" id="pickup" className="peer sr-only" />
                    <Label
                      htmlFor="pickup"
                      className="flex flex-col items-center justify-center p-6 border border-neutral-700 rounded-xl cursor-pointer bg-neutral-800/50 hover:bg-neutral-800 transition-all peer-data-[state=checked]:border-[#F5761A] peer-data-[state=checked]:bg-[#F5761A]/10 peer-data-[state=checked]:text-[#F5761A]"
                    >
                      <Store className="h-8 w-8 mb-3" />
                      <span className="font-semibold">À emporter</span>
                    </Label>
                  </div>
                  <div className="relative">
                    <RadioGroupItem value="DELIVERY" id="delivery" className="peer sr-only" />
                    <Label
                      htmlFor="delivery"
                      className="flex flex-col items-center justify-center p-6 border border-neutral-700 rounded-xl cursor-pointer bg-neutral-800/50 hover:bg-neutral-800 transition-all peer-data-[state=checked]:border-[#F5761A] peer-data-[state=checked]:bg-[#F5761A]/10 peer-data-[state=checked]:text-[#F5761A]"
                    >
                      <Truck className="h-8 w-8 mb-3" />
                      <span className="font-semibold">Livraison</span>
                    </Label>
                  </div>
                  <div className="relative">
                    <RadioGroupItem value="DINE_IN" id="dinein" className="peer sr-only" />
                    <Label
                      htmlFor="dinein"
                      className="flex flex-col items-center justify-center p-6 border border-neutral-700 rounded-xl cursor-pointer bg-neutral-800/50 hover:bg-neutral-800 transition-all peer-data-[state=checked]:border-[#F5761A] peer-data-[state=checked]:bg-[#F5761A]/10 peer-data-[state=checked]:text-[#F5761A]"
                    >
                      <Calendar className="h-8 w-8 mb-3" />
                      <span className="font-semibold">Sur place</span>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Pickup time */}
            {orderType === 'PICKUP' && (
              <Card className="bg-neutral-900 border-neutral-800 shadow-xl">
                <CardHeader className="border-b border-neutral-800 pb-4">
                  <CardTitle className="flex items-center gap-3 text-white text-xl">
                    <Clock className="h-5 w-5 text-[#F5761A]" />
                    Heure de retrait
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                    {timeSlots.map((slot) => {
                        const isSelected = pickupTime?.toISOString() === slot.toISOString();
                        return (
                        <Button
                            key={slot.toISOString()}
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setPickupTime(slot)}
                            className={`border-neutral-700 hover:bg-neutral-800 hover:text-white transition-colors ${isSelected ? 'bg-[#F5761A] text-white border-[#F5761A] hover:bg-[#F5761A]' : 'bg-transparent text-gray-300'}`}
                        >
                            {slot.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                        </Button>
                        )
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Customer info */}
            <Card className="bg-neutral-900 border-neutral-800 shadow-xl">
              <CardHeader className="border-b border-neutral-800 pb-4">
                <CardTitle className="flex items-center gap-3 text-white text-xl">
                  <User className="h-5 w-5 text-[#F5761A]" />
                  Vos coordonnées
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-gray-300">Nom complet <span className="text-[#F5761A]">*</span></Label>
                    <Input
                      id="name"
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                      placeholder="Jean Dupont"
                      required
                      className="bg-neutral-800 border-neutral-700 text-white placeholder:text-gray-500 focus-visible:ring-[#F5761A] focus-visible:border-[#F5761A]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-gray-300">Téléphone <span className="text-[#F5761A]">*</span></Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                      placeholder="06 12 34 56 78"
                      required
                      className="bg-neutral-800 border-neutral-700 text-white placeholder:text-gray-500 focus-visible:ring-[#F5761A] focus-visible:border-[#F5761A]"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-300">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                    placeholder="jean@exemple.com"
                    className="bg-neutral-800 border-neutral-700 text-white placeholder:text-gray-500 focus-visible:ring-[#F5761A] focus-visible:border-[#F5761A]"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Payment method */}
            <Card className="bg-neutral-900 border-neutral-800 shadow-xl">
              <CardHeader className="border-b border-neutral-800 pb-4">
                <CardTitle className="flex items-center gap-3 text-white text-xl">
                  <CreditCard className="h-5 w-5 text-[#F5761A]" />
                  Moyen de paiement
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={(v) => setPaymentMethod(v as any)}
                  className="space-y-4"
                >
                  <label htmlFor="online" className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'ONLINE' ? 'bg-[#F5761A]/10 border-[#F5761A]' : 'bg-neutral-800/50 border-neutral-700 hover:bg-neutral-800'}`}>
                    <RadioGroupItem value="ONLINE" id="online" className="mr-4 text-[#F5761A] border-gray-400" />
                    <CreditCard className={`h-6 w-6 mr-4 ${paymentMethod === 'ONLINE' ? 'text-[#F5761A]' : 'text-gray-400'}`} />
                    <div>
                      <p className={`font-semibold ${paymentMethod === 'ONLINE' ? 'text-white' : 'text-gray-300'}`}>Carte bancaire (En ligne)</p>
                      <p className="text-sm text-gray-500">Sécurisé par Stripe</p>
                    </div>
                  </label>

                  <label htmlFor="cardonsite" className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'CARD_ON_SITE' ? 'bg-[#F5761A]/10 border-[#F5761A]' : 'bg-neutral-800/50 border-neutral-700 hover:bg-neutral-800'}`}>
                    <RadioGroupItem value="CARD_ON_SITE" id="cardonsite" className="mr-4 text-[#F5761A] border-gray-400" />
                    <CreditCard className={`h-6 w-6 mr-4 ${paymentMethod === 'CARD_ON_SITE' ? 'text-[#F5761A]' : 'text-gray-400'}`} />
                    <div>
                      <p className={`font-semibold ${paymentMethod === 'CARD_ON_SITE' ? 'text-white' : 'text-gray-300'}`}>Carte bancaire (Sur place) </p>
                      <p className="text-sm text-gray-500">Paiement au comptoir</p>
                    </div>
                  </label>

                   <label htmlFor="cash" className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'CASH' ? 'bg-[#F5761A]/10 border-[#F5761A]' : 'bg-neutral-800/50 border-neutral-700 hover:bg-neutral-800'}`}>
                    <RadioGroupItem value="CASH" id="cash" className="mr-4 text-[#F5761A] border-gray-400" />
                    <Banknote className={`h-6 w-6 mr-4 ${paymentMethod === 'CASH' ? 'text-[#F5761A]' : 'text-gray-400'}`} />
                    <div>
                      <p className={`font-semibold ${paymentMethod === 'CASH' ? 'text-white' : 'text-gray-300'}`}>Espèces</p>
                      <p className="text-sm text-gray-500">Paiement au comptoir</p>
                    </div>
                  </label>
                </RadioGroup>
              </CardContent>
            </Card>
          </div>

          {/* Summary */}
          <div>
            <Card className="sticky top-8 bg-neutral-900 border-neutral-800 shadow-xl ring-1 ring-white/5">
              <CardHeader className="bg-neutral-800/50 border-b border-neutral-800 pb-4">
                <CardTitle className="text-white">Récapitulatif</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {items.map((item, index) => (
                  <div key={`${item.dishId}-${index}`} className="flex justify-between text-sm group">
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                         <span className="font-medium text-gray-200">
                            <span className="text-[#F5761A] font-bold mr-2">{item.quantity}x</span> 
                            {item.dish.name}
                        </span>
                        <span className="font-bold text-white ml-4">{(item.unitPrice * item.quantity).toFixed(2)} €</span>
                      </div>
                      
                      {item.selectedOptions.length > 0 && (
                        <span className="text-gray-500 text-xs block pl-6 mt-1">
                          + {item.selectedOptions.map(o => o.name).join(', ')}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
                </div>
                
                <Separator className="bg-neutral-800" />
                
                <div className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-400">
                        <span>Sous-total</span>
                        <span>{getSubtotal().toFixed(2)} €</span>
                    </div>
                    {/* Tax or fees could go here */}
                    <div className="flex justify-between text-xl font-bold text-white pt-2">
                        <span>Total</span>
                        <span className="text-[#F5761A]">{getSubtotal().toFixed(2)} €</span>
                    </div>
                </div>

                <Button 
                  className="w-full text-white font-bold text-lg h-14 shadow-lg hover:shadow-[#F5761A]/20 transition-all duration-300"
                  style={{ backgroundColor: '#F5761A' }}
                  onClick={handleSubmit}
                  disabled={loading || !customerInfo.name || !customerInfo.phone || (orderType === 'PICKUP' && !pickupTime)}
                >
                  {loading ? 'Traitement en cours...' : 'Confirmer la commande'}
                </Button>
                
                <p className="text-xs text-center text-gray-600 mt-4">
                    En confirmant votre commande, vous acceptez nos conditions générales de vente.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
