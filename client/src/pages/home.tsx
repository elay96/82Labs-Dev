import { useState, useEffect } from "react";
import { 
  Menu,
  X,
  ChevronRight,
  ChevronDown,
  ArrowRight
} from "lucide-react";
import logoImg from "@assets/IMG_4364_1754462674951.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Modal } from "@/components/ui/modal";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  brief: z.string().min(10, "Please provide more details").max(140, "Brief must be 140 characters or less"),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

export default function Home() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeModel, setActiveModel] = useState("command");
  const [navBackground, setNavBackground] = useState(false);
  const { toast } = useToast();

  // Scroll reveal effect
  useEffect(() => {
    const handleScroll = () => {
      setNavBackground(window.scrollY > 20);
      
      // Reveal elements on scroll
      const reveals = document.querySelectorAll('.reveal');
      reveals.forEach((element) => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < windowHeight - elementVisible) {
          element.classList.add('revealed');
        }
      });
      
      // Stagger animations
      const staggerItems = document.querySelectorAll('.stagger-item:not(.animate)');
      staggerItems.forEach((element) => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 100;
        
        if (elementTop < windowHeight - elementVisible) {
          element.classList.add('animate');
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check on mount
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      brief: "",
    },
  });

  const contactMutation = useMutation({
    mutationFn: async (data: ContactFormData) => {
      return apiRequest("POST", "/api/contact", data);
    },
    onSuccess: () => {
      toast({
        title: "Message sent!",
        description: "We'll get back to you within 24 hours.",
      });
      form.reset();
      setIsContactModalOpen(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ContactFormData) => {
    contactMutation.mutate(data);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        navBackground ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-white/80 backdrop-blur-sm'
      } border-b border-gray-200`}>
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <img 
                src={logoImg} 
                alt="82 Labs" 
                className="h-8 transition-transform hover:scale-105 duration-300"
                data-testid="logo-82labs"
              />
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <button 
                onClick={() => scrollToSection("platform")} 
                className="text-gray-600 hover:text-gray-900 transition-all duration-300 font-medium hover:scale-105"
                data-testid="link-platform"
              >
                Platform
              </button>
              <button 
                onClick={() => scrollToSection("solutions")} 
                className="text-gray-600 hover:text-gray-900 transition-all duration-300 font-medium hover:scale-105"
                data-testid="link-solutions"
              >
                Solutions
              </button>
              <button 
                onClick={() => scrollToSection("research")} 
                className="text-gray-600 hover:text-gray-900 transition-all duration-300 font-medium hover:scale-105"
                data-testid="link-research"
              >
                Research
              </button>
              <button 
                onClick={() => scrollToSection("resources")} 
                className="text-gray-600 hover:text-gray-900 transition-all duration-300 font-medium hover:scale-105"
                data-testid="link-resources"
              >
                Resources
              </button>
              <button 
                onClick={() => scrollToSection("company")} 
                className="text-gray-600 hover:text-gray-900 transition-all duration-300 font-medium hover:scale-105"
                data-testid="link-company"
              >
                Company
              </button>
            </div>
            
            {/* CTA & Mobile Menu */}
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => setIsContactModalOpen(true)}
                className="minimal-button minimal-button-primary hidden md:block"
                data-testid="button-request-demo"
              >
                Request a demo
              </Button>
              
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2"
                data-testid="button-mobile-menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
          
          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-4 mobile-menu animate-in slide-in-from-top duration-300">
              <div className="space-y-4">
                <button 
                  onClick={() => scrollToSection("platform")} 
                  className="flex items-center justify-between w-full py-2 text-gray-900 hover:text-gray-600 transition-colors"
                  data-testid="mobile-link-platform"
                >
                  Platform
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
                <button 
                  onClick={() => scrollToSection("solutions")} 
                  className="flex items-center justify-between w-full py-2 text-gray-900 hover:text-gray-600 transition-colors"
                  data-testid="mobile-link-solutions"
                >
                  Solutions
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
                <button 
                  onClick={() => scrollToSection("research")} 
                  className="flex items-center justify-between w-full py-2 text-gray-900 hover:text-gray-600 transition-colors"
                  data-testid="mobile-link-research"
                >
                  Research
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
                <button 
                  onClick={() => scrollToSection("resources")} 
                  className="flex items-center justify-between w-full py-2 text-gray-900 hover:text-gray-600 transition-colors"
                  data-testid="mobile-link-resources"
                >
                  Resources
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
                <button 
                  onClick={() => scrollToSection("company")} 
                  className="flex items-center justify-between w-full py-2 text-gray-900 hover:text-gray-600 transition-colors"
                  data-testid="mobile-link-company"
                >
                  Company
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
                <Button
                  onClick={() => setIsContactModalOpen(true)}
                  className="minimal-button minimal-button-primary w-full mt-4"
                  data-testid="mobile-button-request-demo"
                >
                  Request a demo
                </Button>
                <button 
                  className="w-full py-2 text-gray-600 hover:text-gray-900 transition-colors"
                  data-testid="mobile-button-sign-in"
                >
                  Sign in
                </button>
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Hero Section */}
      <section id="hero" className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Trusted by companies badge */}
          <div className="mb-8 fade-in">
            <p className="text-sm text-gray-600 mb-4">Trusted by industry leaders and developers worldwide</p>
            <div className="flex justify-center items-center space-x-8 opacity-60">
              <span className="text-lg font-semibold stagger-item">ext</span>
              <span className="text-lg font-semibold stagger-item">ENSEMBLE</span>
              <span className="text-lg font-semibold stagger-item">TD Bank</span>
            </div>
          </div>
          
          <h1 className="heading-xl text-gray-900 mb-6 max-w-3xl mx-auto fade-in-delay-1">
            The all-in-one platform for private and secure AI
          </h1>
          
          <p className="body-lg text-gray-600 mb-8 max-w-2xl mx-auto fade-in-delay-2">
            82 Labs brings you cutting-edge multilingual models, advanced retrieval, and an AI workspace 
            tailored for the modern enterprise — all within a single, secure platform.
          </p>
          
          <div className="fade-in-delay-3">
            <Button
              onClick={() => setIsContactModalOpen(true)}
              className="minimal-button minimal-button-primary text-lg px-8 py-4"
              data-testid="button-request-demo-hero"
            >
              Request a demo
            </Button>
          </div>
        </div>
      </section>

      {/* Models Section */}
      <section id="platform" className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 reveal">
            <h2 className="heading-lg text-gray-900 mb-4">
              State-of-the-art generative and retrieval models
            </h2>
            <p className="body-lg text-gray-600 max-w-2xl mx-auto">
              Unlock the unlimited potential of AI with our three model families — designed to meet the diverse needs of enterprises.
            </p>
          </div>

          {/* Model Selector */}
          <div className="mb-8 reveal">
            <div className="flex justify-center">
              <div className="inline-flex items-center border-b-2 border-orange-200">
                <button
                  onClick={() => setActiveModel("command")}
                  className={`px-4 py-2 font-medium transition-all duration-300 ${
                    activeModel === "command" 
                      ? "text-gray-900 border-b-2 border-gray-900 -mb-0.5" 
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  Command
                </button>
                <ChevronDown className="w-5 h-5 text-gray-400 ml-2 transition-transform hover:rotate-180 duration-300" />
              </div>
            </div>
          </div>

          {/* Model Card */}
          <div className="minimal-card max-w-md mx-auto bg-gray-900 text-white reveal">
            <h3 className="text-xl font-semibold mb-4">Command</h3>
            <p className="text-gray-300 mb-6">
              Streamline your workflows with advanced language models for generating text, 
              analyzing documents, and building AI assistants
            </p>
            <button className="flex items-center text-white hover:text-gray-300 transition-all duration-300 group">
              Learn more 
              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="solutions" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 reveal">
            <h2 className="heading-lg text-gray-900 mb-4">
              Build high-impact applications grounded in your proprietary data
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Scalable */}
            <div className="text-center stagger-item">
              <div className="w-12 h-12 mx-auto mb-4 transition-transform hover:scale-110 duration-300">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-full h-full">
                  <rect x="3" y="3" width="7" height="7" rx="1"/>
                  <rect x="14" y="3" width="7" height="7" rx="1"/>
                  <rect x="14" y="14" width="7" height="7" rx="1"/>
                  <rect x="3" y="14" width="7" height="7" rx="1"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Scalable</h3>
              <p className="text-gray-600">
                Take applications from proof of concept to full production with our compressed, enterprise-focused 
                models — built to limit costs while maximizing performance.
              </p>
            </div>

            {/* Accurate */}
            <div className="text-center stagger-item">
              <div className="w-12 h-12 mx-auto mb-4 transition-transform hover:scale-110 duration-300">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-full h-full">
                  <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Accurate</h3>
              <p className="text-gray-600">
                Fine-tune our models to your company data with built-in retrieval-augmented generation (RAG), 
                providing verifiable outputs grounded in your sources of truth.
              </p>
            </div>

            {/* Secure */}
            <div className="text-center stagger-item">
              <div className="w-12 h-12 mx-auto mb-4 transition-transform hover:scale-110 duration-300">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-full h-full">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <circle cx="12" cy="16" r="1"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Secure</h3>
              <p className="text-gray-600">
                Keep your critical data protected with enterprise-grade security, advanced access controls, 
                and private deployment options.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Industries Section */}
      <section id="research" className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 reveal">
            <h2 className="heading-lg text-gray-900 mb-4">
              AI solutions for the world's most complex industries
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Technology */}
            <div className="minimal-card bg-cover bg-center h-64 relative overflow-hidden group stagger-item" 
                 style={{backgroundImage: "url('https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400')"}}>
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-all duration-300"></div>
              <div className="absolute bottom-6 left-6 text-white transform group-hover:translate-y-1 transition-transform duration-300">
                <h3 className="text-2xl font-semibold mb-2">Technology</h3>
              </div>
            </div>

            {/* Finance */}
            <div className="minimal-card bg-cover bg-center h-64 relative overflow-hidden group stagger-item" 
                 style={{backgroundImage: "url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400')"}}>
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-all duration-300"></div>
              <div className="absolute bottom-6 left-6 text-white transform group-hover:translate-y-1 transition-transform duration-300">
                <h3 className="text-2xl font-semibold mb-2">Finance</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Company Section */}
      <section id="company" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center reveal">
          <h2 className="heading-lg text-gray-900 mb-6">
            Transform the way you work with secure AI agents, advanced search, and leading generative AI - all in one place.
          </h2>
          <button className="flex items-center justify-center mx-auto text-gray-900 hover:text-gray-600 transition-all duration-300 font-medium group">
            Learn more 
            <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </section>

      {/* Contact Modal */}
      <Modal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)}>
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Request a Demo</h2>
          <p className="text-gray-600">Tell us about your project and we'll get back to you within 24 hours</p>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-900">Name</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      className="border-gray-300 focus:border-gray-900 focus:ring-gray-900" 
                      placeholder="Your name"
                      data-testid="input-name"
                    />
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
                  <FormLabel className="text-gray-900">Email</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      type="email"
                      className="border-gray-300 focus:border-gray-900 focus:ring-gray-900" 
                      placeholder="your@email.com"
                      data-testid="input-email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="brief"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-900">Project Brief (140 chars max)</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      className="border-gray-300 focus:border-gray-900 focus:ring-gray-900 resize-none" 
                      placeholder="Tell us about your project..."
                      rows={4}
                      maxLength={140}
                      data-testid="textarea-brief"
                    />
                  </FormControl>
                  <FormMessage />
                  <p className="text-sm text-gray-500">{field.value?.length || 0}/140 characters</p>
                </FormItem>
              )}
            />
            
            <Button
              type="submit"
              disabled={contactMutation.isPending}
              className="minimal-button minimal-button-primary w-full"
              data-testid="button-submit-contact"
            >
              {contactMutation.isPending ? "Sending..." : "Send Message"}
            </Button>
          </form>
        </Form>
      </Modal>
    </div>
  );
}