import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChefHat, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/useToast';
import { supabase } from '@/lib/supabase';

export function LoginPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: { name: formData.name },
          },
        });
        if (error) throw error;
        toast.success('Compte créé !', {
          description: 'Vérifiez votre email pour confirmer.',
        });
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });
        if (error) throw error;
        toast.success('Connexion réussie !');
        navigate('/admin');
      }
    } catch (error: any) {
      toast.error('Erreur', {
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#F5761A] opacity-10 blur-[100px] rounded-full pointer-events-none"
      />

      <Card className="w-full max-w-md bg-white/5 backdrop-blur-sm border-white/10 relative z-10">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto w-16 h-16 bg-[#F5761A]/10 rounded-full flex items-center justify-center mb-6 ring-1 ring-[#F5761A]/20">
            <ChefHat className="h-8 w-8 text-[#F5761A]" />
          </div>
          <CardTitle className="text-3xl font-bold text-white mb-2">
            {isSignUp ? 'Créer un compte' : 'Bienvenue'}
          </CardTitle>
          <CardDescription className="text-gray-400 text-lg">
            {isSignUp
              ? 'Rejoignez notre plateforme de gestion restaurant'
              : 'Connectez-vous à votre espace'}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-300">Nom complet</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Jean Dupont"
                  required={isSignUp}
                  className="bg-neutral-900 border-white/10 text-white placeholder:text-gray-600 focus:border-[#F5761A]/50 focus:ring-[#F5761A]/20"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="jean@exemple.com"
                required
                className="bg-neutral-900 border-white/10 text-white placeholder:text-gray-600 focus:border-[#F5761A]/50 focus:ring-[#F5761A]/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300">Mot de passe</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  required
                  className="bg-neutral-900 border-white/10 text-white placeholder:text-gray-600 focus:border-[#F5761A]/50 focus:ring-[#F5761A]/20 pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#F5761A] hover:bg-[#F5761A]/90 text-white font-semibold h-11 text-lg"
              disabled={loading}
            >
              {loading ? 'Chargement...' : isSignUp ? 'Créer mon compte' : 'Se connecter'}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <Button
              variant="link"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-[#F5761A] hover:text-[#F5761A]/80"
            >
              {isSignUp
                ? 'Déjà un compte ? Se connecter'
                : 'Pas de compte ? S\'inscrire'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
