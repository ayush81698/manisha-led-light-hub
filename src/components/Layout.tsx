
import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Phone } from 'lucide-react';

const Layout = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.includes('/admin');

  return (
    <div className="flex flex-col min-h-screen">
      {!isAdminRoute && (
        <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-primary">Manisha Enterprises</span>
            </Link>

            <nav className="hidden md:flex space-x-6">
              <Link to="/" className={`font-medium hover:text-primary ${location.pathname === '/' ? 'text-primary' : 'text-gray-600'}`}>
                Home
              </Link>
              <Link to="/products" className={`font-medium hover:text-primary ${location.pathname === '/products' ? 'text-primary' : 'text-gray-600'}`}>
                Products
              </Link>
              <a href="#about" className="font-medium text-gray-600 hover:text-primary">
                About
              </a>
              <a href="#contact" className="font-medium text-gray-600 hover:text-primary">
                Contact
              </a>
              <Link to="/admin" className="font-medium text-gray-600 hover:text-primary">
                Admin
              </Link>
            </nav>

            <div className="hidden md:flex items-center space-x-2">
              <Phone size={18} className="text-primary" />
              <span className="text-gray-700 font-medium">+91 9876543210</span>
            </div>

            <button className="md:hidden text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </header>
      )}

      <main className="flex-grow">
        <Outlet />
      </main>

      {!isAdminRoute && (
        <footer className="bg-gray-900 text-white">
          <div className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4">Manisha Enterprises</h3>
                <p className="text-gray-400">
                  Specializing in high-quality LED light housings for industrial and commercial applications.
                </p>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
                <ul className="space-y-2">
                  <li><Link to="/" className="text-gray-400 hover:text-white">Home</Link></li>
                  <li><Link to="/products" className="text-gray-400 hover:text-white">Products</Link></li>
                  <li><a href="#about" className="text-gray-400 hover:text-white">About Us</a></li>
                  <li><a href="#contact" className="text-gray-400 hover:text-white">Contact</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4">Products</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white">Round Housings</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Square Housings</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Street Light Casings</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Custom Designs</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4">Contact</h4>
                <address className="text-gray-400 not-italic">
                  123 Industrial Area, <br />
                  Mumbai, India <br />
                  <a href="tel:+919876543210" className="hover:text-white">+91 9876543210</a> <br />
                  <a href="mailto:info@manishaenterprises.com" className="hover:text-white">info@manishaenterprises.com</a>
                </address>
              </div>
            </div>
            <div className="mt-12 pt-8 border-t border-gray-800 text-gray-400 text-center">
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
