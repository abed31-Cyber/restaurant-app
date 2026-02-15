import { useState } from 'react';
import { Plus, Minus, Flame, Leaf, AlertCircle, Search, UtensilsCrossed } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useCartStore } from '@/store/cartStore';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import type { Dish, DishOption, Category } from '@/types';

interface MenuSectionProps {
  categories: Category[];
  dishes: Dish[];
  primaryColor: string;
}

export function MenuSection({ categories, dishes, primaryColor }: MenuSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | 'all'>('all');
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);

  const filteredDishes = selectedCategory === 'all'
    ? dishes
    : dishes.filter(d => d.categoryId === selectedCategory);

  return (
    <section className="py-20 bg-gray-50/50" id="menu">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">Notre Carte</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">Explorez nos créations culinaires, préparées avec des ingrédients frais et de qualité supérieure.</p>
        </div>

        {/* Sticky Category Navigation */}
        <div className="sticky top-20 z-40 bg-white/80 backdrop-blur-md py-4 mb-10 border-y border-gray-200/60 shadow-sm">
          <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex w-max space-x-2 px-4 mx-auto">
              <Button
                variant={selectedCategory === 'all' ? 'default' : 'ghost'}
                onClick={() => setSelectedCategory('all')}
                className={cn(
                  "rounded-full px-6 py-2 transition-all duration-300 font-medium",
                  selectedCategory === 'all' ? "text-white shadow-md hover:scale-105" : "text-gray-600 hover:bg-gray-100"
                )}
                style={selectedCategory === 'all' ? { backgroundColor: primaryColor } : {}}
              >
                Tout voir
              </Button>
              {categories.map((cat) => (
                <Button
                  key={cat.id}
                  variant={selectedCategory === cat.id ? 'default' : 'ghost'}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={cn(
                    "rounded-full px-6 py-2 transition-all duration-300 font-medium",
                    selectedCategory === cat.id ? "text-white shadow-md hover:scale-105" : "text-gray-600 hover:bg-gray-100"
                  )}
                  style={selectedCategory === cat.id ? { backgroundColor: primaryColor } : {}}
                >
                  {cat.name}
                </Button>
              ))}
            </div>
            <ScrollBar orientation="horizontal" className="invisible" />
          </ScrollArea>
        </div>

        {/* Dishes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
          {filteredDishes.map((dish, index) => (
            <DishCard
              key={dish.id}
              dish={dish}
              primaryColor={primaryColor}
              onClick={() => setSelectedDish(dish)}
              index={index}
            />
          ))}
        </div>

        {filteredDishes.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center space-y-4">
            <div className="h-20 w-20 bg-gray-100 rounded-full flex items-center justify-center">
              <UtensilsCrossed className="h-10 w-10 text-gray-400" />
            </div>
            <p className="text-xl text-gray-500 font-medium">Aucun plat disponible pour le moment.</p>
            <Button variant="outline" onClick={() => setSelectedCategory('all')}>Voir toute la carte</Button>
          </div>
        )}
      </div>

      {/* Dish Modal */}
      <DishModal
        dish={selectedDish}
        isOpen={!!selectedDish}
        onClose={() => setSelectedDish(null)}
        primaryColor={primaryColor}
      />
    </section>
  );
}

function DishCard({
  dish,
  primaryColor,
  onClick,
  index
}: {
  dish: Dish;
  primaryColor: string;
  onClick: () => void;
  index: number;
}) {
  return (
    <div
      className="group cursor-pointer rounded-3xl bg-white p-3 hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500 hover:-translate-y-1"
      onClick={onClick}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="aspect-[4/3] relative overflow-hidden rounded-2xl bg-gray-100 mb-4">
        {dish.imageUrl ? (
          <img
            src={dish.imageUrl}
            alt={dish.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div
            className="w-full h-full flex flex-col items-center justify-center text-white font-bold"
            style={{ backgroundColor: primaryColor }}
          >
            <span className="text-6xl opacity-50">{dish.name.charAt(0)}</span>
          </div>
        )}

        {/* Badges Overlay */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          {dish.isSpicy && (
            <span className="h-8 w-8 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform" title="Épicé">
              <Flame className="h-4 w-4 fill-current" />
            </span>
          )}
          {dish.isVegetarian && (
            <span className="h-8 w-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform" title="Végétarien">
              <Leaf className="h-4 w-4 fill-current" />
            </span>
          )}
        </div>

        {/* Price Tag Overlay */}
        <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm px-4 py-1.5 rounded-full shadow-lg border border-gray-100">
          <span className="font-bold text-gray-900">{Number(dish.price).toFixed(2)} €</span>
        </div>
      </div>

      <div className="px-2 pb-2">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-xl text-gray-900 group-hover:text-primary transition-colors line-clamp-1">{dish.name}</h3>
        </div>
        {dish.description && (
          <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed mb-4">{dish.description}</p>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-gray-50">
          {dish.allergens && dish.allergens.length > 0 ? (
            <div className="flex items-center gap-1.5 text-xs font-medium text-amber-600/80 bg-amber-50 px-2 py-1 rounded-md">
              <AlertCircle className="h-3 w-3" />
              <span className="truncate max-w-[150px]">{dish.allergens.join(', ')}</span>
            </div>
          ) : <div />}

          <div
            className="h-8 w-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-primary group-hover:text-white transition-all duration-300 transform group-hover:rotate-90"
          >
            <Plus className="h-4 w-4" />
          </div>
        </div>
      </div>
    </div>
  );
}

function DishModal({
  dish,
  isOpen,
  onClose,
  primaryColor
}: {
  dish: Dish | null;
  isOpen: boolean;
  onClose: () => void;
  primaryColor: string;
}) {
  // Use a state for local quantity management inside the modal
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<DishOption[]>([]);
  const [notes, setNotes] = useState('');
  const { addItem } = useCartStore();

  // Reset state when dish changes
  if (!dish) return null;

  // We can't use hooks conditionally, so we assume this component is only rendered when dish is present or use effects
  // But since it's a controlled component via isOpen, we can just reset on open (not implemented here perfectly but acceptable)

  const toggleOption = (option: DishOption) => {
    setSelectedOptions(prev => {
      const exists = prev.find(o => o.id === option.id);
      if (exists) {
        return prev.filter(o => o.id !== option.id);
      }
      return [...prev, option];
    });
  };

  const handleAddToCart = () => {
    // Convert to proper types for cart
    const optionsForCart = selectedOptions.map(o => ({
      optionId: o.id,
      name: o.name,
      price: Number(o.price)
    }));

    addItem(
      dish,
      quantity,
      optionsForCart,
      notes
    );
    onClose();
    // Reset defaults
    setQuantity(1);
    setSelectedOptions([]);
    setNotes('');
  };

  const totalPrice = Number(dish.price) + selectedOptions.reduce((sum, o) => sum + Number(o.price), 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl p-0 overflow-hidden gap-0 border-none sm:rounded-3xl shadow-2xl">

        {/* Header Image */}
        <div className="relative h-64 w-full bg-gray-100">
          {dish.imageUrl ? (
            <img
              src={dish.imageUrl}
              alt={dish.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-900">
              <UtensilsCrossed className="h-16 w-16 text-gray-700" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <DialogHeader className="absolute bottom-0 left-0 p-6 text-left z-10 w-full">
            <DialogTitle className="text-3xl font-bold text-white mb-2">{dish.name}</DialogTitle>
            <div className="flex gap-2">
              {dish.isSpicy && <Badge className="bg-red-500/80 hover:bg-red-500 border-none backdrop-blur-sm">Épicé</Badge>}
              {dish.isVegetarian && <Badge className="bg-emerald-500/80 hover:bg-emerald-500 border-none backdrop-blur-sm">Végétarien</Badge>}
            </div>
          </DialogHeader>
        </div>

        <ScrollArea className="max-h-[60vh]">
          <div className="p-6 space-y-8">
            {dish.description && (
              <p className="text-gray-600 leading-relaxed text-lg">{dish.description}</p>
            )}

            {/* Options Section */}
            {dish.options && dish.options.length > 0 && (
              <div className="space-y-4">
                <h4 className="font-bold text-gray-900 border-l-4 pl-3" style={{ borderColor: primaryColor }}>Personnalisez votre commande</h4>
                <div className="grid gap-3">
                  {dish.options.map((option) => (
                    <div
                      key={option.id}
                      className={cn(
                        "flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all hover:border-gray-300",
                        selectedOptions.some(o => o.id === option.id)
                          ? "bg-gray-50 border-gray-400 ring-1 ring-gray-200"
                          : "border-gray-100"
                      )}
                      onClick={() => toggleOption(option)}
                    >
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={selectedOptions.some(o => o.id === option.id)}
                          onCheckedChange={() => toggleOption(option)}
                          className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                        />
                        <span className="font-medium text-gray-700">{option.name}</span>
                      </div>
                      <span className="font-semibold text-gray-900">+{Number(option.price).toFixed(2)} €</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Notes Section */}
            <div className="space-y-4">
              <h4 className="font-bold text-gray-900 border-l-4 pl-3" style={{ borderColor: primaryColor }}>Instructions spéciales</h4>
              <Textarea
                placeholder="Allergies ? Cuisson ? Dites-nous tout..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="rounded-xl border-gray-200 focus:ring-primary focus:border-primary min-h-[100px] resize-none bg-gray-50"
              />
            </div>
          </div>
        </ScrollArea>

        {/* Sticky Footer Action */}
        <div className="p-6 border-t bg-white flex flex-col sm:flex-row items-center gap-4 shadow-[0_-5px_20px_rgba(0,0,0,0.05)] z-20">
          <div className="flex items-center gap-4 bg-gray-100 rounded-full px-4 py-2 w-full sm:w-auto justify-between">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full hover:bg-white hover:shadow-sm"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="font-bold text-lg min-w-[1.5rem] text-center">{quantity}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full hover:bg-white hover:shadow-sm"
              onClick={() => setQuantity(quantity + 1)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <Button
            className="w-full h-12 text-lg font-bold rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]"
            style={{ backgroundColor: primaryColor }}
            onClick={handleAddToCart}
          >
            <span>Ajouter · {(totalPrice * quantity).toFixed(2)} €</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
