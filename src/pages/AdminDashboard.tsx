import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Utensils, 
  ShoppingBag, 
  Calendar, 
  Star, 
  Settings, 
  LogOut,
  TrendingUp,
  Clock,
  Users,
  DollarSign
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { useToast } from '@/hooks/useToast';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import type { DashboardStats, Order, Reservation } from '@/types';

export function AdminDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [recentReservations, setRecentReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
      return;
    }
    if (user) {
      fetchDashboardData();
    }
  }, [user, authLoading]);

  const fetchDashboardData = async () => {
    try {
      // Fetch stats
      const today = new Date().toISOString().split('T')[0];
      
      const restaurantId = user?.restaurantId || '';

      // Today's orders
      const { data: todayOrders } = await supabase
        .from('Order')
        .select('*')
        .gte('createdAt', today)
        .eq('restaurantId', restaurantId);

      // Pending orders
      const { data: pendingOrders } = await supabase
        .from('Order')
        .select('*')
        .eq('status', 'PENDING')
        .eq('restaurantId', restaurantId);

      // Today's reservations
      const { data: todayReservations } = await supabase
        .from('Reservation')
        .select('*')
        .eq('date', today)
        .eq('restaurantId', restaurantId);

      // Recent orders
      const { data: orders } = await supabase
        .from('Order')
        .select('*')
        .eq('restaurantId', restaurantId)
        .order('createdAt', { ascending: false })
        .limit(10);

      // Recent reservations
      const { data: reservations } = await supabase
        .from('Reservation')
        .select('*')
        .eq('restaurantId', restaurantId)
        .order('createdAt', { ascending: false })
        .limit(10);

      const todayRevenue = (todayOrders as any[])?.reduce((sum, o) => sum + Number(o.totalPrice), 0) || 0;

      setStats({
        todayRevenue,
        todayOrders: todayOrders?.length || 0,
        pendingOrders: pendingOrders?.length || 0,
        todayReservations: todayReservations?.length || 0,
        weeklyRevenue: todayRevenue * 7, // Simplified
        weeklyOrders: (todayOrders?.length || 0) * 7,
        popularDishes: [],
      });

      setRecentOrders(orders || []);
      setRecentReservations(reservations || []);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success('Déconnecté');
    navigate('/login');
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-950">
        <div className="animate-spin h-8 w-8 border-4 border-[#F5761A] border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-neutral-900 border-r border-white/10 z-50">
        <div className="p-6">
          <div className="flex items-center gap-2 font-bold text-xl text-[#F5761A]">
            <LayoutDashboard className="h-6 w-6" />
            <span>Admin</span>
          </div>
        </div>

        <nav className="px-4 space-y-1">
          <NavButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={TrendingUp} label="Vue d'ensemble" />
          <NavButton active={activeTab === 'orders'} onClick={() => setActiveTab('orders')} icon={ShoppingBag} label="Commandes" />
          <NavButton active={activeTab === 'menu'} onClick={() => setActiveTab('menu')} icon={Utensils} label="Menu" />
          <NavButton active={activeTab === 'reservations'} onClick={() => setActiveTab('reservations')} icon={Calendar} label="Réservations" />
          <NavButton active={activeTab === 'reviews'} onClick={() => setActiveTab('reviews')} icon={Star} label="Avis" />
          <NavButton active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} icon={Settings} label="Paramètres" />
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-red-500 hover:text-red-400 hover:bg-neutral-800"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Déconnexion
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-64 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white">Tableau de bord</h1>
              <p className="text-gray-400">Bienvenue, {user?.name || user?.email}</p>
            </div>
          </div>

          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats cards */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                  title="CA Aujourd'hui"
                  value={`${stats?.todayRevenue.toFixed(2) || '0.00'} €`}
                  icon={DollarSign}
                  color="text-emerald-500"
                  bgColor="bg-emerald-500/10"
                />
                <StatCard
                  title="Commandes"
                  value={String(stats?.todayOrders || 0)}
                  icon={ShoppingBag}
                  color="text-blue-500"
                  bgColor="bg-blue-500/10"
                />
                <StatCard
                  title="En attente"
                  value={String(stats?.pendingOrders || 0)}
                  icon={Clock}
                  color="text-[#F5761A]"
                  bgColor="bg-[#F5761A]/10"
                />
                <StatCard
                  title="Réservations"
                  value={String(stats?.todayReservations || 0)}
                  icon={Users}
                  color="text-purple-500"
                  bgColor="bg-purple-500/10"
                />
              </div>

              {/* Recent activity */}
              <div className="grid lg:grid-cols-2 gap-6">
                <Card className="bg-neutral-900 border-white/10 text-white">
                  <CardHeader>
                    <CardTitle className="text-white">Commandes récentes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {recentOrders.slice(0, 5).map((order) => (
                        <div key={order.id} className="flex justify-between items-center p-3 bg-neutral-800/50 rounded-lg border border-white/5">
                          <div>
                            <p className="font-medium text-white">Commande #{order.id.slice(-6)}</p>
                            <p className="text-sm text-gray-400">{order.customerName || 'Client'}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-[#F5761A]">{Number(order.totalPrice).toFixed(2)} €</p>
                            <StatusBadge status={order.status} />
                          </div>
                        </div>
                      ))}
                      {recentOrders.length === 0 && (
                        <p className="text-gray-500 text-center py-4">Aucune commande</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-neutral-900 border-white/10 text-white">
                  <CardHeader>
                    <CardTitle className="text-white">Réservations récentes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {recentReservations.slice(0, 5).map((reservation) => (
                        <div key={reservation.id} className="flex justify-between items-center p-3 bg-neutral-800/50 rounded-lg border border-white/5">
                          <div>
                            <p className="font-medium text-white">{reservation.name}</p>
                            <p className="text-sm text-gray-400">
                              {reservation.guests} pers. - {reservation.time}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-400">{new Date(reservation.date).toLocaleDateString('fr-FR')}</p>
                            <StatusBadge status={reservation.status} />
                          </div>
                        </div>
                      ))}
                      {recentReservations.length === 0 && (
                        <p className="text-gray-500 text-center py-4">Aucune réservation</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'orders' && <OrdersTab orders={recentOrders} />}
          {activeTab === 'menu' && <MenuTab />}
          {activeTab === 'reservations' && <ReservationsTab reservations={recentReservations} />}
          {activeTab === 'reviews' && <ReviewsTab />}
          {activeTab === 'settings' && <SettingsTab />}
        </div>
      </main>
    </div>
  );
}

function NavButton({ active, onClick, icon: Icon, label }: any) {
    return (
        <Button
            variant={active ? 'secondary' : 'ghost'}
            className={`w-full justify-start gap-2 ${active ? 'bg-[#F5761A] text-white hover:bg-[#F5761A]/90' : 'text-gray-400 hover:text-white hover:bg-neutral-800'}`}
            onClick={onClick}
        >
            <Icon className="h-4 w-4" />
            {label}
        </Button>
    )
}

function StatCard({ title, value, icon: Icon, color, bgColor }: { title: string; value: string; icon: any; color: string, bgColor: string }) {
  return (
    <Card className="bg-neutral-900 border-white/10 text-white">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400">{title}</p>
            <p className="text-2xl font-bold mt-1 text-white">{value}</p>
          </div>
          <div className={`p-3 rounded-xl ${bgColor}`}>
            <Icon className={`h-6 w-6 ${color}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    PENDING: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    CONFIRMED: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    PREPARING: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    READY: 'bg-green-500/10 text-green-500 border-green-500/20',
    COMPLETED: 'bg-neutral-800 text-gray-400 border-neutral-700',
    CANCELLED: 'bg-red-500/10 text-red-500 border-red-500/20',
  };

  const labels: Record<string, string> = {
    PENDING: 'En attente',
    CONFIRMED: 'Confirmée',
    PREPARING: 'En préparation',
    READY: 'Prête',
    COMPLETED: 'Terminée',
    CANCELLED: 'Annulée',
  };

  return (
    <span className={`text-xs px-2 py-1 rounded-full border ${styles[status] || 'bg-neutral-800 text-gray-400'}`}>
      {labels[status] || status}
    </span>
  );
}

function OrdersTab({ orders }: { orders: Order[] }) {
  return (
    <Card className="bg-neutral-900 border-white/10">
      <CardHeader>
        <CardTitle className="text-white">Toutes les commandes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {orders.map((order) => (
            <div key={order.id} className="flex justify-between items-center p-4 bg-neutral-800/50 border border-white/5 rounded-lg">
              <div>
                <p className="font-medium text-white">Commande #{order.id.slice(-6)}</p>
                <p className="text-sm text-gray-400">{order.customerName || 'Client'}</p>
                <p className="text-xs text-gray-500">
                  {new Date(order.createdAt).toLocaleString('fr-FR')}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium text-[#F5761A]">{Number(order.totalPrice).toFixed(2)} €</p>
                <StatusBadge status={order.status} />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function MenuTab() {
  return (
    <Card className="bg-neutral-900 border-white/10">
      <CardHeader>
        <CardTitle className="text-white">Gestion du menu</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-500">Fonctionnalité en cours de développement...</p>
      </CardContent>
    </Card>
  );
}

function ReservationsTab({ reservations }: { reservations: Reservation[] }) {
  return (
    <Card className="bg-neutral-900 border-white/10">
      <CardHeader>
        <CardTitle className="text-white">Toutes les réservations</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {reservations.map((reservation) => (
            <div key={reservation.id} className="flex justify-between items-center p-4 bg-neutral-800/50 border border-white/5 rounded-lg">
              <div>
                <p className="font-medium text-white">{reservation.name}</p>
                <p className="text-sm text-gray-400">
                  {reservation.guests} pers. - {reservation.time}
                </p>
                <p className="text-xs text-gray-500">{reservation.phone}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-400">{new Date(reservation.date).toLocaleDateString('fr-FR')}</p>
                <StatusBadge status={reservation.status} />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function ReviewsTab() {
  return (
    <Card className="bg-neutral-900 border-white/10">
      <CardHeader>
        <CardTitle className="text-white">Gestion des avis</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-500">Fonctionnalité en cours de développement...</p>
      </CardContent>
    </Card>
  );
}

function SettingsTab() {
  return (
    <Card className="bg-neutral-900 border-white/10">
      <CardHeader>
        <CardTitle className="text-white">Paramètres du restaurant</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-500">Fonctionnalité en cours de développement...</p>
      </CardContent>
    </Card>
  );
}