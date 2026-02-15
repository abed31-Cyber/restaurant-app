import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { HomePage } from '@/pages/HomePage';
import { MenuPage } from '@/pages/MenuPage';
import { ReservationPage } from '@/pages/ReservationPage';
import { CheckoutPage } from '@/pages/CheckoutPage';
import { LoginPage } from '@/pages/LoginPage';
import { AdminDashboard } from '@/pages/AdminDashboard';
import { KitchenDisplay } from '@/pages/KitchenDisplay';

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" richColors />
      <Routes>
        {/* Public routes */}
        <Route path="/:slug" element={<HomePage />} />
        <Route path="/:slug/menu" element={<MenuPage />} />
        <Route path="/:slug/reservation" element={<ReservationPage />} />
        <Route path="/:slug/avis" element={<HomePage />} />
        
        {/* Checkout */}
        <Route path="/checkout" element={<CheckoutPage />} />
        
        {/* Auth */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Admin */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/:tab" element={<AdminDashboard />} />
        
        {/* Kitchen Display */}
        <Route path="/kitchen" element={<KitchenDisplay />} />
        
        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/les-saveurs-d-istanbul" replace />} />
        <Route path="*" element={<Navigate to="/les-saveurs-d-istanbul" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
