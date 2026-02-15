import { useState } from 'react';
import { Star, Quote, MessageSquarePlus, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/useToast';
import { supabase } from '@/lib/supabase';
import type { Review } from '@/types';

interface ReviewsSectionProps {
  reviews: Review[];
  restaurantId: string;
  primaryColor: string;
}

export function ReviewsSection({ reviews, restaurantId, primaryColor }: ReviewsSectionProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const approvedReviews = reviews.filter(r => r.isApproved);
  const averageRating = approvedReviews.length > 0
    ? approvedReviews.reduce((sum, r) => sum + r.rating, 0) / approvedReviews.length
    : 0;

  return (
    <section className="py-24 bg-neutral-900 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white tracking-tight">
            L'avis de nos <span style={{ color: primaryColor }}>hôtes</span>
          </h2>

          {approvedReviews.length > 0 ? (
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-1 bg-white/5 px-4 py-2 rounded-full border border-white/10 backdrop-blur-sm">
                <span className="text-2xl font-bold text-white">{averageRating.toFixed(1)}</span>
                <div className="flex gap-0.5 mx-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-5 w-5 ${star <= Math.round(averageRating)
                          ? 'fill-yellow-500 text-yellow-500'
                          : 'text-gray-600'
                        }`}
                    />
                  ))}
                </div>
                <span className="text-gray-400 text-sm">({approvedReviews.length} avis)</span>
              </div>
            </div>
          ) : (
            <p className="text-gray-400 text-lg">Découvrez ce que nos clients pensent de nous.</p>
          )}
        </div>

        {/* Reviews grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {approvedReviews.slice(0, 6).map((review) => (
            <ReviewCard key={review.id} review={review} primaryColor={primaryColor} />
          ))}
        </div>

        {approvedReviews.length === 0 && (
          <div className="text-center text-gray-500 py-12 bg-white/5 rounded-2xl mb-12 border border-white/10 border-dashed">
            <MessageSquarePlus className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium text-gray-300">Aucun avis pour le moment.</p>
            <p className="text-sm">Soyez le premier à partager votre expérience !</p>
          </div>
        )}

        {/* Add review button */}
        <div className="text-center">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                size="lg"
                className="text-lg px-8 py-6 rounded-full font-semibold shadow-lg hover:brightness-110 transition-all duration-300"
                style={{ backgroundColor: primaryColor, color: 'white' }}
              >
                Partager mon expérience
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-neutral-900 border-neutral-800 text-white">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-center">Votre avis compte</DialogTitle>
                <p className="text-center text-gray-400">Aidez-nous à nous améliorer en partageant votre ressenti.</p>
              </DialogHeader>
              <ReviewForm
                restaurantId={restaurantId}
                primaryColor={primaryColor}
                onSuccess={() => setIsDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </section>
  );
}

function ReviewCard({ review, primaryColor }: { review: Review, primaryColor: string }) {
  return (
    <Card className="h-full bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors duration-300 group">
      <CardContent className="p-8 relative">
        <Quote
          className="absolute top-6 right-6 h-10 w-10 opacity-20 transform rotate-180 transition-transform group-hover:scale-110"
          style={{ color: primaryColor }}
        />

        <div className="flex items-center gap-4 mb-6">
          <div className="h-12 w-12 rounded-full bg-neutral-800 flex items-center justify-center border border-white/10">
            <User className="h-6 w-6 text-gray-400" />
          </div>
          <div>
            <p className="font-bold text-white text-lg">{review.name}</p>
            <p className="text-xs text-gray-500 uppercase tracking-wider">{new Date(review.createdAt).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
        </div>

        <div className="flex gap-1 mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`h-4 w-4 ${star <= review.rating
                  ? 'fill-yellow-500 text-yellow-500'
                  : 'text-gray-700'
                }`}
            />
          ))}
        </div>

        {review.comment && (
          <p className="text-gray-300 leading-relaxed italic relative z-10">"{review.comment}"</p>
        )}
      </CardContent>
    </Card>
  );
}

function ReviewForm({
  restaurantId,
  primaryColor,
  onSuccess
}: {
  restaurantId: string;
  primaryColor: string;
  onSuccess: () => void;
}) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    comment: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error('Veuillez sélectionner une note');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from('Review').insert({
        restaurantId,
        name: formData.name,
        rating,
        comment: formData.comment,
        isApproved: false,
      } as any);

      if (error) throw error;

      toast.success('Merci pour votre avis !', {
        description: 'Il sera publié après modération.',
      });
      onSuccess();
    } catch (error) {
      toast.error('Erreur', {
        description: 'Impossible de soumettre votre avis.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 py-4">
      <div className="space-y-3 text-center">
        <Label className="text-base font-medium text-gray-200">Quelle note donneriez-vous ?</Label>
        <div className="flex justify-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className="focus:outline-none transition-transform hover:scale-110 active:scale-95"
            >
              <Star
                className={`h-10 w-10 transition-colors ${star <= rating
                    ? 'fill-yellow-500 text-yellow-500'
                    : 'text-gray-700 hover:text-yellow-500/50'
                  }`}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="review-name" className="text-gray-200">Votre nom <span className="text-red-500">*</span></Label>
        <Input
          id="review-name"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Jean Dupont"
          className="bg-neutral-800 border-neutral-700 text-white placeholder:text-gray-500 focus-visible:ring-primary"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="review-comment" className="text-gray-200">Votre commentaire</Label>
        <Textarea
          id="review-comment"
          value={formData.comment}
          onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
          placeholder="Racontez-nous votre expérience..."
          rows={4}
          className="bg-neutral-800 border-neutral-700 text-white placeholder:text-gray-500 focus-visible:ring-primary resize-none"
        />
      </div>

      <Button
        type="submit"
        className="w-full text-white font-semibold h-12"
        style={{ backgroundColor: primaryColor }}
        disabled={loading}
      >
        {loading ? 'Envoi en cours...' : 'Envoyer mon avis'}
      </Button>
    </form>
  );
}
