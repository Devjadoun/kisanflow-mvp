import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { Footer } from './components/common/Footer';

// Public Pages
import { LandingPage } from './pages/public/LandingPage';
import { LoginPage } from './pages/public/LoginPage';
import { RoleSelectionPage } from './pages/public/RoleSelectionPage';

// Farmer Pages (11 pages)
import { FarmerDashboard } from './pages/farmer/FarmerDashboard';
import { BookSlot } from './pages/farmer/BookSlot';
import { AISlotRecommendationPage } from './pages/farmer/AISlotRecommendationPage';
import { BookingConfirmation } from './pages/farmer/BookingConfirmation';
import { MyBookings } from './pages/farmer/MyBookings';
import { LiveQueue } from './pages/farmer/LiveQueue';
import { ProcurementStatus } from './pages/farmer/ProcurementStatus';
import { PaymentReceipt } from './pages/farmer/PaymentReceipt';
import { Rewards } from './pages/farmer/Rewards';
import { Feedback } from './pages/farmer/Feedback';
import { FarmerProfile } from './pages/farmer/FarmerProfile';

// Centre Operator Pages (4 pages)
import { OperatorDashboard } from './pages/operator/OperatorDashboard';
import { LiveQueueManagement } from './pages/operator/LiveQueueManagement';
import { TodayBookings } from './pages/operator/TodayBookings';
import { ProcurementManagement } from './pages/operator/ProcurementManagement';

// Admin Pages (4 pages)
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { CentrePerformance } from './pages/admin/CentrePerformance';
import { Analytics } from './pages/admin/Analytics';
import { AIPredictions } from './pages/admin/AIPredictions';

// Main App Layout container
const AppLayout = ({ children }) => {
  const location = useLocation();
  const isFarmer = location.pathname.startsWith('/farmer');
  const isOperator = location.pathname.startsWith('/operator');
  const isAdmin = location.pathname.startsWith('/admin');
  const hasSidebar = isFarmer || isOperator || isAdmin;
  const role = isOperator ? 'operator' : isAdmin ? 'admin' : 'farmer';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <Navbar />

      <div className="flex-1 flex w-full max-w-7xl mx-auto">
        {hasSidebar && <Sidebar role={role} />}

        <main className={`flex-1 p-4 sm:p-6 lg:p-8 w-full overflow-x-hidden ${!hasSidebar ? 'max-w-7xl mx-auto' : ''}`}>
          {children}
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppLayout>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/roles" element={<RoleSelectionPage />} />

            {/* Farmer Routes (11 Views) */}
            <Route path="/farmer" element={<FarmerDashboard />} />
            <Route path="/farmer/book-slot" element={<BookSlot />} />
            <Route path="/farmer/ai-recommendation" element={<AISlotRecommendationPage />} />
            <Route path="/farmer/confirmation" element={<BookingConfirmation />} />
            <Route path="/farmer/bookings" element={<MyBookings />} />
            <Route path="/farmer/live-queue" element={<LiveQueue />} />
            <Route path="/farmer/procurement" element={<ProcurementStatus />} />
            <Route path="/farmer/payment" element={<PaymentReceipt />} />
            <Route path="/farmer/rewards" element={<Rewards />} />
            <Route path="/farmer/feedback" element={<Feedback />} />
            <Route path="/farmer/profile" element={<FarmerProfile />} />

            {/* Centre Operator Routes (4 Views) */}
            <Route path="/operator" element={<OperatorDashboard />} />
            <Route path="/operator/queue" element={<LiveQueueManagement />} />
            <Route path="/operator/bookings" element={<TodayBookings />} />
            <Route path="/operator/procurement" element={<ProcurementManagement />} />

            {/* Admin Routes (4 Views) */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/centres" element={<CentrePerformance />} />
            <Route path="/admin/analytics" element={<Analytics />} />
            <Route path="/admin/predictions" element={<AIPredictions />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </AppProvider>
  );
}
