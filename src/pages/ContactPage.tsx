
import React, { useState } from "react";
import NavBar from "@/components/NavBar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Send } from "lucide-react";

const ContactPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // In a real app, we would send this data to an API
      console.log("Form submitted:", formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast(`Message sent! We'll get back to you soon.`);
      
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast(`Error sending message. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <NavBar />
      
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold text-center text-mindease dark:text-white mb-6">Contact Us</h1>
        
        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="contact" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger 
                value="contact" 
                className="data-[state=active]:bg-mindease data-[state=active]:text-white"
              >
                <Mail className="mr-2 h-4 w-4" />
                Contact Form
              </TabsTrigger>
              <TabsTrigger 
                value="support" 
                className="data-[state=active]:bg-mindease data-[state=active]:text-white"
              >
                <Send className="mr-2 h-4 w-4" />
                Support Resources
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="contact" className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Get in Touch</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Fill out the form below to send us your feedback, questions, or suggestions.
                Our team will get back to you as soon as possible.
              </p>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Name
                    </label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Your email address"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Subject
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    placeholder="Message subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Enter your message here"
                    className="min-h-32"
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Please provide as much detail as possible.
                  </p>
                </div>
                
                <Button 
                  type="submit" 
                  className="bg-mindease hover:bg-mindease-dark dark:bg-mindease-mid dark:hover:bg-mindease"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="mr-2">Sending...</span>
                      <span className="animate-spin">◌</span>
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="support" className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Support Resources</h2>
              
              <div className="space-y-6">
                <div className="border-b pb-4">
                  <h3 className="font-medium text-lg mb-2">Mental Health Crisis Support</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-2">
                    If you're experiencing a mental health crisis, please contact these resources immediately:
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>National Suicide Prevention Lifeline: <span className="font-medium">988</span> or <span className="font-medium">1-800-273-8255</span></li>
                    <li>Crisis Text Line: Text <span className="font-medium">HOME</span> to <span className="font-medium">741741</span></li>
                    <li>Emergency Services: <span className="font-medium">911</span></li>
                  </ul>
                </div>
                
                <div className="border-b pb-4">
                  <h3 className="font-medium text-lg mb-2">Technical Support</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-2">
                    For help with the Mindease app or account issues:
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Email: <span className="font-medium">support@mindease.example.com</span></li>
                    <li>Hours: Monday-Friday, 9am-5pm EST</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-medium text-lg mb-2">Frequently Asked Questions</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-2">
                    Check our FAQ section for answers to common questions:
                  </p>
                  <Button className="bg-mindease hover:bg-mindease-dark dark:bg-mindease-mid dark:hover:bg-mindease mt-2">
                    View FAQs
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
