
import React, { useState } from "react";
import NavBar from "@/components/NavBar";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Mail, Send } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  subject: z.string().min(5, {
    message: "Subject must be at least 5 characters.",
  }),
  message: z.string().min(10, {
    message: "Message must be at least 10 characters.",
  }),
});

const ContactPage = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    try {
      // In a real app, we would send this data to an API
      console.log("Form submitted:", values);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Message Sent",
        description: "Thank you for your feedback. We'll get back to you soon.",
      });
      
      form.reset();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: "There was a problem sending your message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <NavBar />
      
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold text-mindease mb-6 text-center">Contact Us</h1>
        
        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="contact" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="contact" className="data-[state=active]:bg-mindease data-[state=active]:text-white">
                <Mail className="mr-2 h-4 w-4" />
                Contact Form
              </TabsTrigger>
              <TabsTrigger value="support" className="data-[state=active]:bg-mindease data-[state=active]:text-white">
                <Send className="mr-2 h-4 w-4" />
                Support Resources
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="contact">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Get in Touch</h2>
                <p className="text-gray-600 mb-6">
                  Fill out the form below to send us your feedback, questions, or suggestions.
                  Our team will get back to you as soon as possible.
                </p>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Your name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="Your email address" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subject</FormLabel>
                          <FormControl>
                            <Input placeholder="Message subject" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Enter your message here" 
                              className="min-h-32" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                          <FormDescription>
                            Please provide as much detail as possible.
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full md:w-auto bg-mindease hover:bg-mindease-mid"
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
                </Form>
              </Card>
            </TabsContent>
            
            <TabsContent value="support">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Support Resources</h2>
                
                <div className="space-y-6">
                  <div className="border-b pb-4">
                    <h3 className="font-medium text-lg mb-2">Mental Health Crisis Support</h3>
                    <p className="text-gray-600 mb-2">
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
                    <p className="text-gray-600 mb-2">
                      For help with the Mindease app or account issues:
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Email: <span className="font-medium">support@mindease.example.com</span></li>
                      <li>Hours: Monday-Friday, 9am-5pm EST</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-lg mb-2">Frequently Asked Questions</h3>
                    <p className="text-gray-600 mb-2">
                      Check our FAQ section for answers to common questions:
                    </p>
                    <Button className="bg-mindease hover:bg-mindease-mid mt-2">
                      View FAQs
                    </Button>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
