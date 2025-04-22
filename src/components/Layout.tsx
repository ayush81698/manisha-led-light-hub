
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Phone } from 'lucide-react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <header className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b dark:border-gray-700 shadow-sm">
        <div className="container mx-auto px-4 flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl text-yellow-500">ManishaEnterprises</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-700 dark:text-gray-200 hover:text-yellow-500 dark:hover:text-yellow-400">
              Home
            </Link>
            <Link to="/products" className="text-gray-700 dark:text-gray-200 hover:text-yellow-500 dark:hover:text-yellow-400">
              Products
            </Link>
            <Link to="/about" className="text-gray-700 dark:text-gray-200 hover:text-yellow-500 dark:hover:text-yellow-400">
              About
            </Link>
            <Link to="/contact" className="text-gray-700 dark:text-gray-200 hover:text-yellow-500 dark:hover:text-yellow-400">
              Contact
            </Link>
          </nav>
          
          <div className="flex items-center space-x-3">
            <Button asChild variant="default" className="bg-yellow-500 hover:bg-yellow-600 text-white">
              <Link to="/contact-options">
                <Phone className="mr-2 h-4 w-4" />
                Contact Sales
              </Link>
            </Button>
            
            <ThemeToggle />
            
            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                  <Menu />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <nav className="flex flex-col gap-4 mt-8">
                  <Link to="/" className="text-lg font-medium hover:text-yellow-500 dark:hover:text-yellow-400">
                    Home
                  </Link>
                  <Link to="/products" className="text-lg font-medium hover:text-yellow-500 dark:hover:text-yellow-400">
                    Products
                  </Link>
                  <Link to="/about" className="text-lg font-medium hover:text-yellow-500 dark:hover:text-yellow-400">
                    About
                  </Link>
                  <Link to="/contact" className="text-lg font-medium hover:text-yellow-500 dark:hover:text-yellow-400">
                    Contact
                  </Link>
                  <Link to="/contact-options" className="text-lg font-medium hover:text-yellow-500 dark:hover:text-yellow-400">
                    Contact Sales
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      
      <main className="flex-1">
        {children}
      </main>
      
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">Manisha Enterprises</h3>
              <p className="text-gray-300">Premium LED Housing Manufacturer</p>
              <p className="text-gray-300 mt-2">Since 2005</p>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="text-gray-300 hover:text-yellow-400">Home</Link>
                </li>
                <li>
                  <Link to="/products" className="text-gray-300 hover:text-yellow-400">Products</Link>
                </li>
                <li>
                  <Link to="/about" className="text-gray-300 hover:text-yellow-400">About Us</Link>
                </li>
                <li>
                  <Link to="/contact" className="text-gray-300 hover:text-yellow-400">Contact</Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-4">Contact</h3>
              <p className="text-gray-300">123 Industrial Area, Delhi, India</p>
              <p className="text-gray-300">+91 9876543210</p>
              <p className="text-gray-300">info@manishaenterprises.com</p>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
            <p>© {new Date().getFullYear()} Manisha Enterprises. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
