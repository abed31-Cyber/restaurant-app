import { useState, useEffect } from 'react';
import { Clock, Check, ChefHat, AlertCircle, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/useToast';
import { supabase } from '@/lib/supabase';
import type { Order } from '@/types';

export function KitchenDisplay() {
    const { toast } = useToast();
    const [orders, setOrders] = useState<Order[]>([]);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();

        // Subscribe to new orders
        const subscription = supabase
            .channel('orders')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'Order' }, (payload) => {
                const newOrder = payload.new as Order;
                if (newOrder.status === 'PENDING' || newOrder.status === 'CONFIRMED') {
                    setOrders(prev => [newOrder, ...prev]);
                    if (soundEnabled) {
                        playNotificationSound();
                    }
                    toast.info('Nouvelle commande !', {
                        description: `Commande #${newOrder.id.slice(-6)}`,
                    });
                }
            })
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, [soundEnabled]);

    const fetchOrders = async () => {
        try {
            const { data, error } = await supabase
                .from('Order')
                .select(`
          *,
          items:OrderItem(*, dish:Dish(name))
        `)
                .in('status', ['PENDING', 'CONFIRMED', 'PREPARING'])
                .order('createdAt', { ascending: false });

            if (error) throw error;
            setOrders(data || []);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const playNotificationSound = () => {
        const audio = new Audio('/notification.mp3');
        audio.play().catch(() => { });
    };

    const updateOrderStatus = async (orderId: string, status: string) => {
        try {
            const { error } = await supabase
                .from('Order')
                // @ts-expect-error - Supabase types
                .update({ status, updatedAt: new Date().toISOString() })
                .eq('id', orderId);

            if (error) throw error;

            setOrders(prev => prev.filter(o => o.id !== orderId));
            toast.success('Commande mise à jour');
        } catch (error) {
            toast.error('Erreur lors de la mise à jour');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
                <div className="animate-spin h-12 w-12 border-4 border-[#F5761A] border-t-transparent rounded-full" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-950 text-white">
            {/* Header */}
            <header className="bg-neutral-900 border-b border-white/10 p-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <ChefHat className="h-8 w-8 text-[#F5761A]" />
                    <h1 className="text-2xl font-bold">Cuisine</h1>
                </div>
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="hover:bg-neutral-800 hover:text-white"
                        onClick={() => setSoundEnabled(!soundEnabled)}
                    >
                        {soundEnabled ? <Volume2 className="h-6 w-6" /> : <VolumeX className="h-6 w-6" />}
                    </Button>
                    <div className="text-right">
                        <p className="text-2xl font-mono text-[#F5761A]">
                            {new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                        <p className="text-sm text-gray-400">
                            {orders.length} commande{orders.length !== 1 ? 's' : ''} en attente
                        </p>
                    </div>
                </div>
            </header>

            {/* Orders grid */}
            <main className="p-4">
                {orders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-96 text-gray-500">
                        <ChefHat className="h-24 w-24 mb-4 opacity-30 text-[#F5761A]" />
                        <p className="text-xl">Aucune commande en attente</p>
                        <p className="text-sm">En attente de nouvelles commandes...</p>
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-4">
                        {orders.map((order) => (
                            <OrderCard
                                key={order.id}
                                order={order}
                                onStatusChange={updateOrderStatus}
                            />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}

function OrderCard({
    order,
    onStatusChange
}: {
    order: Order;
    onStatusChange: (id: string, status: string) => void;
}) {
    const elapsed = Math.floor((Date.now() - new Date(order.createdAt).getTime()) / 1000 / 60);
    const isUrgent = elapsed > 15;

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING': return 'bg-yellow-500 hover:bg-yellow-600';
            case 'CONFIRMED': return 'bg-blue-500 hover:bg-blue-600';
            case 'PREPARING': return 'bg-orange-500 hover:bg-orange-600';
            default: return 'bg-neutral-700 hover:bg-neutral-800';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'PENDING': return 'Nouvelle';
            case 'CONFIRMED': return 'Confirmée';
            case 'PREPARING': return 'En cours';
            default: return status;
        }
    };

    const getNextStatus = (status: string) => {
        switch (status) {
            case 'PENDING': return 'CONFIRMED';
            case 'CONFIRMED': return 'PREPARING';
            case 'PREPARING': return 'READY';
            default: return 'READY';
        }
    };

    const getNextStatusLabel = (status: string) => {
        switch (status) {
            case 'PENDING': return 'Confirmer';
            case 'CONFIRMED': return 'Préparer';
            case 'PREPARING': return 'Terminer';
            default: return 'Terminer';
        }
    };

    return (
        <Card className={`${isUrgent ? 'border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'border-white/10'} bg-neutral-900 overflow-hidden relative transition-all duration-300`}>
            {isUrgent && <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-red-600" />}

            <CardContent className="p-5">
                {/* Header */}
                <div className="flex justify-between items-start mb-6 pb-4 border-b border-white/5">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h3 className="text-2xl font-bold text-white">#{order.id.slice(-6)}</h3>
                            <Badge className={getStatusColor(order.status) + " border-none"}>
                                {getStatusLabel(order.status)}
                            </Badge>
                        </div>
                        <p className="text-sm text-gray-400 font-medium">{order.customerName || 'Client'}</p>
                    </div>
                    <div className={`text-right ${isUrgent ? 'text-red-400 animate-pulse' : 'text-gray-400'}`}>
                        <div className="flex items-center gap-1.5 justify-end">
                            <Clock className="h-4 w-4" />
                            <span className="font-mono text-lg font-bold">{elapsed} min</span>
                        </div>
                        {isUrgent && <div className="flex items-center gap-1 text-xs mt-1 justify-end font-semibold"><AlertCircle className="h-3 w-3" /> RETARD</div>}
                    </div>
                </div>

                {/* Items */}
                <div className="space-y-3 mb-6">
                    {(order.items as any[])?.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-base items-center bg-white/5 p-2 rounded-lg">
                            <span className="flex items-center gap-3">
                                <span className="font-bold text-xl min-w-[30px] h-[30px] flex items-center justify-center bg-[#F5761A] text-white rounded-md text-sm">{item.quantity}</span>
                                <span className="text-gray-200">{item.dish?.name || 'Plat'}</span>
                            </span>
                        </div>
                    ))}
                </div>

                {/* Notes */}
                {order.notes && (
                    <div className="bg-yellow-500/10 border border-yellow-500/20 p-3 rounded-lg mb-6 text-sm">
                        <span className="text-yellow-500 font-bold block mb-1">Note de la salle:</span>
                        <span className="text-gray-300">{order.notes}</span>
                    </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                    <Button
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-12 text-lg"
                        onClick={() => onStatusChange(order.id, getNextStatus(order.status))}
                    >
                        <Check className="h-5 w-5 mr-2" />
                        {getNextStatusLabel(order.status)}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}