
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.phone || !formData.message) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Message Sent",
        description: "Thank you for contacting us. We'll get back to you soon!",
      });
      
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
      });
      
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-4 text-primary">Contact Us</h1>
      <p className="text-lg text-center text-gray-600 mb-12 max-w-3xl mx-auto">
        Have questions about our products or services? We're here to help! Reach out to our team using any of the methods below.
      </p>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start">
              <div className="bg-secondary/10 p-3 rounded-full mr-4">
                <Phone className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <h3 className="font-bold mb-2">Phone</h3>
                <p className="text-gray-600 mb-1">Sales: +91 9876543210</p>
                <p className="text-gray-600">Support: +91 9876543211</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start">
              <div className="bg-secondary/10 p-3 rounded-full mr-4">
                <Mail className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <h3 className="font-bold mb-2">Email</h3>
                <p className="text-gray-600 mb-1">Sales: sales@manishaenterprises.com</p>
                <p className="text-gray-600">Support: support@manishaenterprises.com</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start">
              <div className="bg-secondary/10 p-3 rounded-full mr-4">
                <Clock className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <h3 className="font-bold mb-2">Business Hours</h3>
                <p className="text-gray-600 mb-1">Monday-Friday: 9:00 AM - 6:00 PM</p>
                <p className="text-gray-600">Saturday: 9:00 AM - 2:00 PM</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <div>
          <h2 className="text-2xl font-bold mb-6 text-primary">Get In Touch</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Your Name *</label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
            
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Your Message *</label>
              <Textarea
                id="message"
                name="message"
                rows={4}
                value={formData.message}
                onChange={handleChange}
                required
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </Button>
          </form>
        </div>
        
        <div>
          <h2 className="text-2xl font-bold mb-6 text-primary">Our Location</h2>
          <Card className="mb-6">
            <CardContent className="p-0">
              <div className="h-[300px] bg-gray-200 w-full flex items-center justify-center">
                <MapPin className="h-12 w-12 text-primary/50" />
                <span className="ml-2 text-gray-500">Map loading...</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start">
                <div className="bg-secondary/10 p-3 rounded-full mr-4">
                  <MapPin className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <h3 className="font-bold mb-2">Factory & Office</h3>
                  <p className="text-gray-600">
                    123 Industrial Area, <br />
                    Mumbai, Maharashtra 400001, <br />
                    India
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Contact;
