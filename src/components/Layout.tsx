
import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Phone, Menu, X, Lightbulb } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { themeColors } from '@/lib/theme-colors';

const Layout = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.includes('/admin');

  const handleContactSales = () => {
    const phoneNumber = '+919876543210';
    window.location.href = `tel:${phoneNumber}`;
  };

  return (
    <div className="flex flex-col min-h-screen">
      {!isAdminRoute && (
        <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
          <div className="container mx-auto px-4 py-3 flex justify-between items-center">
            <Link to="/" className="flex items-center space-x-2">
              <img 
                src="/lovable-uploads/d594515a-74c6-44af-923c-a56371ce48f8.png" 
                alt="Manisha Enterprises Logo" 
                className="h-14"
              />
            </Link>

            <nav className="hidden md:flex space-x-6">
              <Link to="/" className={`font-medium hover:text-primary ${location.pathname === '/' ? 'text-primary' : 'text-gray-600'}`}>
                Home
              </Link>
              <Link to="/products" className={`font-medium hover:text-primary ${location.pathname === '/products' ? 'text-primary' : 'text-gray-600'}`}>
                Products
              </Link>
              <Link to="/about" className={`font-medium hover:text-primary ${location.pathname === '/about' ? 'text-primary' : 'text-gray-600'}`}>
                About
              </Link>
              <Link to="/contact" className={`font-medium hover:text-primary ${location.pathname === '/contact' ? 'text-primary' : 'text-gray-600'}`}>
                Contact
              </Link>
              <Link to="/admin" className="font-medium text-gray-600 hover:text-primary">
                Admin
              </Link>
            </nav>

            <div className="hidden md:flex items-center space-x-4">
              <Button onClick={handleContactSales} className="bg-secondary text-primary hover:bg-secondary/90">
                <Phone size={18} className="mr-2" />
                Contact Sales
              </Button>
            </div>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu size={24} />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[80%] sm:w-[300px]">
                <div className="flex flex-col h-full py-6">
                  <div className="mb-8">
                    <img 
                      src="/lovable-uploads/d594515a-74c6-44af-923c-a56371ce48f8.png" 
                      alt="Manisha Enterprises Logo" 
                      className="h-12 mb-6"
                    />
                  </div>
                  <nav className="flex flex-col space-y-4">
                    <Link to="/" className="px-2 py-1 rounded hover:bg-gray-100">Home</Link>
                    <Link to="/products" className="px-2 py-1 rounded hover:bg-gray-100">Products</Link>
                    <Link to="/about" className="px-2 py-1 rounded hover:bg-gray-100">About</Link>
                    <Link to="/contact" className="px-2 py-1 rounded hover:bg-gray-100">Contact</Link>
                    <Link to="/admin" className="px-2 py-1 rounded hover:bg-gray-100">Admin</Link>
                  </nav>
                  <div className="mt-auto">
                    <Button onClick={handleContactSales} className="w-full bg-secondary text-primary hover:bg-secondary/90">
                      <Phone size={18} className="mr-2" />
                      Contact Sales
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </header>
      )}

      <main className="flex-grow">
        <Outlet />
      </main>

      {!isAdminRoute && (
        <footer className="bg-primary text-white">
          <div className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4">Manisha Enterprises</h3>
                <p className="text-gray-300">
                  Specializing in high-quality LED light housings for industrial and commercial applications.
                </p>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
                <ul className="space-y-2">
                  <li><Link to="/" className="text-gray-300 hover:text-white">Home</Link></li>
                  <li><Link to="/products" className="text-gray-300 hover:text-white">Products</Link></li>
                  <li><Link to="/about" className="text-gray-300 hover:text-white">About Us</Link></li>
                  <li><Link to="/contact" className="text-gray-300 hover:text-white">Contact</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4">Products</h4>
                <ul className="space-y-2">
                  <li><Link to="/products" className="text-gray-300 hover:text-white">Round Housings</Link></li>
                  <li><Link to="/products" className="text-gray-300 hover:text-white">Square Housings</Link></li>
                  <li><Link to="/products" className="text-gray-300 hover:text-white">Street Light Casings</Link></li>
                  <li><Link to="/products" className="text-gray-300 hover:text-white">Custom Designs</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4">Contact</h4>
                <address className="text-gray-300 not-italic">
                  123 Industrial Area, <br />
                  Mumbai, India <br />
                  <a href="tel:+919876543210" className="hover:text-white">+91 9876543210</a> <br />
                  <a href="mailto:info@manishaenterprises.com" className="hover:text-white">info@manishaenterprises.com</a>
                </address>
              </div>
            </div>
            <div className="mt-12 pt-8 border-t border-gray-800 text-gray-300 text-center">
              <p>&copy; {new Date().getFullYear()} Manisha Enterprises. All rights reserved.</p>
            </div>
          </div>
        </footer>
      )}

      {/* WhatsApp Chat Button */}
      {!isAdminRoute && (
        <a
          href="https://wa.me/919876543210"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-all z-50"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
            <path d="M12 0C5.373 0 0 5.373 0 12c0 6.628 5.373 12 12 12 6.628 0 12-5.373 12-12 0-6.628-5.373-12-12-12zm0 22c-5.523 0-10-4.477-10-10 0-5.523 4.477-10 10-10 5.523 0 10 4.477 10 10 0 5.523-4.477 10-10 10z" />
          </svg>
        </a>
      )}
    </div>
  );
};

export default Layout;
