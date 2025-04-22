
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Menu, X } from 'lucide-react';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <span className="text-xl font-bold text-primary dark:text-white">
                  Manisha Enterprises
                </span>
              </Link>
            </div>
            
            <nav className="hidden md:flex space-x-6">
              <Link 
                to="/" 
                className={`text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-white ${isActive('/') ? 'font-semibold text-primary dark:text-white' : ''}`}
              >
                Home
              </Link>
              <Link 
                to="/products" 
                className={`text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-white ${isActive('/products') ? 'font-semibold text-primary dark:text-white' : ''}`}
              >
                Products
              </Link>
              <Link 
                to="/about" 
                className={`text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-white ${isActive('/about') ? 'font-semibold text-primary dark:text-white' : ''}`}
              >
                About
              </Link>
              <Link 
                to="/contact-options" 
                className={`text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-white ${isActive('/contact-options') ? 'font-semibold text-primary dark:text-white' : ''}`}
              >
                Contact
              </Link>
            </nav>
            
            <div className="flex items-center space-x-2">
              <ThemeToggle />
              <Link to="/contact-options">
                <Button
                  className="hidden md:inline-flex bg-secondary text-primary hover:bg-secondary/90"
                >
                  Contact Sales
                </Button>
              </Link>
              <button
                className="md:hidden text-gray-600 dark:text-gray-300"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
          
          {/* Mobile menu */}
          {mobileMenuOpen && (
            <nav className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-col space-y-4">
                <Link 
                  to="/"
                  className={`text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-white ${isActive('/') ? 'font-semibold text-primary dark:text-white' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link 
                  to="/products"
                  className={`text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-white ${isActive('/products') ? 'font-semibold text-primary dark:text-white' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Products
                </Link>
                <Link 
                  to="/about"
                  className={`text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-white ${isActive('/about') ? 'font-semibold text-primary dark:text-white' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  About
                </Link>
                <Link 
                  to="/contact-options"
                  className={`text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-white ${isActive('/contact-options') ? 'font-semibold text-primary dark:text-white' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Contact
                </Link>
                <Link to="/contact-options" onClick={() => setMobileMenuOpen(false)}>
                  <Button
                    className="w-full bg-secondary text-primary hover:bg-secondary/90"
                  >
                    Contact Sales
                  </Button>
                </Link>
              </div>
            </nav>
          )}
        </div>
      </header>
      
      <main className="flex-grow">{children}</main>
      
      <footer className="bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-primary dark:text-white">Manisha Enterprises</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Quality LED Housing Manufacturer
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4 text-primary dark:text-white">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-white">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/products" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-white">
                    Products
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-white">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/contact-options" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-white">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4 text-primary dark:text-white">Contact</h3>
              <address className="text-gray-600 dark:text-gray-300 not-italic">
                <p>123 Industrial Area</p>
                <p>Mumbai, India</p>
                <p className="mt-2">Email: info@manisha.com</p>
                <p>Phone: +91 9876543210</p>
              </address>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 text-center text-gray-500 dark:text-gray-400">
            <p>&copy; {new Date().getFullYear()} Manisha Enterprises. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
