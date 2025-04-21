import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Phone, Menu, X, Lightbulb } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { themeColors } from '@/lib/theme-colors';

const Layout = () => {
  const location = useLocation();
  
  const handleContactSales = () => {
    const phoneNumber = '+919876543210';
    window.location.href = `tel:${phoneNumber}`;
  };

  return (
    <div className="flex flex-col min-h-screen">
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
            <Link to="/admin" className={`font-medium hover:text-primary ${location.pathname.startsWith('/admin') ? 'text-primary' : 'text-gray-600'}`}>
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

      <main className="flex-grow">
        <Outlet />
      </main>

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
    </div>
  );
};

export default Layout;
