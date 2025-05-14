
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import Layout from '@/components/Layout';
import Index from '@/pages/Index';
import ProductCatalog from '@/pages/ProductCatalog';
import ProductDetail from '@/pages/ProductDetail';
import AdminLogin from '@/pages/AdminLogin';
import AdminDashboard from '@/pages/AdminDashboard';
import Contact from '@/pages/Contact';
import About from '@/pages/About';
import NotFound from '@/pages/NotFound';
import ContactOptions from '@/pages/ContactOptions';
import { ThemeProvider } from '@/components/ThemeProvider';
import { isAdminLoggedIn } from '@/data/adminAuth';

// Protected route component
const ProtectedAdminRoute = ({ children }: { children: React.ReactNode }) => {
  if (!isAdminLoggedIn()) {
    return <Navigate to="/admin" replace />;
  }
  return <>{children}</>;
};

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/products" element={<ProductCatalog />} />
            <Route path="/products/:productId" element={<ProductDetail />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route 
              path="/admin/dashboard" 
              element={
                <ProtectedAdminRoute>
                  <AdminDashboard />
                </ProtectedAdminRoute>
              } 
            />
            <Route path="/contact" element={<Contact />} />
            <Route path="/contact-options" element={<ContactOptions />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
        <Toaster />
      </Router>
    </ThemeProvider>
  );
}

export default App;
