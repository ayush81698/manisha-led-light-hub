
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Lightbulb, Award, Zap, Factory } from 'lucide-react';

const About = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-4 text-primary">About Manisha Enterprises</h1>
      <p className="text-lg text-center text-gray-600 mb-12 max-w-4xl mx-auto">
        A leading manufacturer of high-quality LED light housings with a commitment to innovation, quality, and customer satisfaction.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <div>
          <img 
            src="/placeholder.svg" 
            alt="Company Facility" 
            className="rounded-lg shadow-lg w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col justify-center">
          <h2 className="text-2xl font-bold mb-4 text-primary">Our Story</h2>
          <p className="text-gray-700 mb-4">
            Founded in 2005, Manisha Enterprises has grown from a small workshop to a leading manufacturer of LED light housings. Our journey began with a simple vision: to create high-quality, durable products that meet the evolving needs of the lighting industry.
          </p>
          <p className="text-gray-700 mb-4">
            Today, we serve clients across various industries, from commercial lighting to industrial applications, with a focus on innovation, quality, and exceptional service.
          </p>
          <p className="text-gray-700">
            Our state-of-the-art manufacturing facility in Mumbai combines traditional craftsmanship with modern technology to create products that stand the test of time.
          </p>
        </div>
      </div>
      
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-center mb-8 text-primary">Our Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-t-4 border-t-secondary">
            <CardContent className="pt-6">
              <div className="bg-secondary/10 p-3 rounded-full w-fit mb-4">
                <Lightbulb className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="font-bold mb-2">Innovation</h3>
              <p className="text-gray-600">Constantly evolving our designs and manufacturing processes to stay ahead of industry trends.</p>
            </CardContent>
          </Card>
          
          <Card className="border-t-4 border-t-secondary">
            <CardContent className="pt-6">
              <div className="bg-secondary/10 p-3 rounded-full w-fit mb-4">
                <Award className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="font-bold mb-2">Quality</h3>
              <p className="text-gray-600">Rigorous testing and quality control to ensure every product meets our exacting standards.</p>
            </CardContent>
          </Card>
          
          <Card className="border-t-4 border-t-secondary">
            <CardContent className="pt-6">
              <div className="bg-secondary/10 p-3 rounded-full w-fit mb-4">
                <Zap className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="font-bold mb-2">Efficiency</h3>
              <p className="text-gray-600">Optimizing energy usage in our products and manufacturing processes for sustainability.</p>
            </CardContent>
          </Card>
          
          <Card className="border-t-4 border-t-secondary">
            <CardContent className="pt-6">
              <div className="bg-secondary/10 p-3 rounded-full w-fit mb-4">
                <Factory className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="font-bold mb-2">Reliability</h3>
              <p className="text-gray-600">Building products that perform consistently and exceed client expectations for longevity.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default About;
