
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Phone, Mail, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ContactOptions = () => {
  const navigate = useNavigate();
  
  const handlePhoneCall = () => {
    const phoneNumber = '+919876543210';
    window.location.href = `tel:${phoneNumber}`;
  };
  
  const handleEmail = () => {
    window.location.href = 'mailto:sales@manishaenterprises.com';
  };
  
  const handleWhatsApp = () => {
    const phoneNumber = '919876543210';
    const message = 'Hello, I am interested in your LED light housings.';
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };
  
  const handleInquiryForm = () => {
    navigate('/contact', { state: { fromContactOptions: true } });
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-4 text-primary">Contact Sales</h1>
      <p className="text-lg text-center text-gray-600 mb-12 max-w-3xl mx-auto">
        Choose your preferred method to get in touch with our sales team
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-center">
              <Phone className="mr-2 h-5 w-5" /> Phone Call
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-gray-600 mb-4">Speak directly with our sales representative</p>
            <Button onClick={handlePhoneCall} className="w-full">
              Call Now
            </Button>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-center">
              <Mail className="mr-2 h-5 w-5" /> Email
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-gray-600 mb-4">Send us an email with your requirements</p>
            <Button onClick={handleEmail} className="w-full">
              Send Email
            </Button>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-center">
              <MessageSquare className="mr-2 h-5 w-5" /> WhatsApp
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-gray-600 mb-4">Chat with us on WhatsApp for quick responses</p>
            <Button onClick={handleWhatsApp} className="w-full">
              WhatsApp Chat
            </Button>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-center">
              <MessageSquare className="mr-2 h-5 w-5" /> Inquiry Form
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-gray-600 mb-4">Fill our inquiry form with detailed requirements</p>
            <Button onClick={handleInquiryForm} className="w-full">
              Submit Inquiry
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ContactOptions;
