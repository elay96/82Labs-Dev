import { useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { 
  Search, 
  MessageSquare, 
  Book, 
  Building2, 
  Phone,
  Zap,
  Shield,
  BarChart3,
  Monitor,
  DollarSign,
  Heart,
  Settings,
  Package,
  Rocket,
  Menu,
  X,
  Sun,
  Moon,
  ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Modal } from "@/components/ui/modal";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import ThreeBackground from "@/components/three/background";

const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  brief: z.string().min(10, "Please provide more details").max(140, "Brief must be 140 characters or less"),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

export default function Home() {
  const [isDark, setIsDark] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("custom");
  const { toast } = useToast();

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
        title: "Success!",
        description: "Your message has been sent. We'll get back to you soon.",
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

  useEffect(() => {
    const isDarkMode = localStorage.getItem("theme") === "dark" || 
      (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches);
    
    setIsDark(isDarkMode);
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, []);

  const toggleTheme = () => {
    const newDarkMode = !isDark;
    setIsDark(newDarkMode);
    localStorage.setItem("theme", newDarkMode ? "dark" : "light");
    document.documentElement.classList.toggle("dark", newDarkMode);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const stagger = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // Refs for animations
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const industriesRef = useRef(null);
  
  const heroInView = useInView(heroRef, { once: true });
  const featuresInView = useInView(featuresRef, { once: true });
  const industriesInView = useInView(industriesRef, { once: true });

  const solutions = [
    {
      id: "custom",
      title: "Custom Software",
      description: "Enterprise-grade solutions built with modern architectures, scalable infrastructure, and best practices that grow with your business.",
      features: [
        "Microservices architecture for maximum scalability",
        "Cloud-native deployment with DevOps integration", 
        "Advanced security and compliance standards"
      ],
      image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    },
    {
      id: "ai",
      title: "AI Automation",
      description: "Intelligent automation solutions that transform your workflows and decision-making processes with cutting-edge machine learning.",
      features: [
        "Custom AI models trained on your data",
        "Workflow automation and optimization",
        "Real-time analytics and insights"
      ],
      image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    },
    {
      id: "mvp",
      title: "MVP in Weeks",
      description: "Rapid prototyping and MVP development to validate your ideas and get to market faster than ever before.",
      features: [
        "Rapid prototyping and validation",
        "Agile development methodology", 
        "Quick iteration and feedback cycles"
      ],
      image: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    }
  ];

  const features = [
    {
      icon: <Zap className="w-6 h-6 text-white" />,
      title: "Infinitely Scalable",
      description: "Our cloud-native architecture automatically scales with your business growth. From startup to enterprise, our solutions adapt to handle millions of users without missing a beat.",
      points: [
        "Auto-scaling infrastructure",
        "Load balancing & CDN optimization",
        "Global deployment capabilities"
      ],
      image: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      gradient: "from-blue-500 to-cyan-400"
    },
    {
      icon: <Shield className="w-6 h-6 text-white" />,
      title: "Enterprise Security",
      description: "Built with security-first principles, our platform implements military-grade encryption, zero-trust architecture, and compliance with international standards.",
      points: [
        "End-to-end encryption",
        "SOC 2 Type II compliance",
        "Multi-factor authentication"
      ],
      image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      gradient: "from-green-500 to-emerald-600"
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-white" />,
      title: "Precision AI",
      description: "Our AI models achieve industry-leading accuracy through advanced machine learning techniques, continuous training, and sophisticated data processing pipelines.",
      points: [
        "99.7% accuracy rate",
        "Real-time model optimization",
        "Continuous learning algorithms"
      ],
      image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      gradient: "from-orange-500 to-red-500"
    }
  ];

  const industries = [
    { icon: <Monitor className="w-8 h-8 text-white" />, title: "Technology", description: "Accelerate innovation with AI-powered development tools and automated workflows.", gradient: "from-blue-500 to-cyan-400" },
    { icon: <DollarSign className="w-8 h-8 text-white" />, title: "Finance", description: "Transform financial services with intelligent automation and risk management.", gradient: "from-green-500 to-emerald-400" },
    { icon: <Heart className="w-8 h-8 text-white" />, title: "Healthcare", description: "Improve patient outcomes with AI-driven diagnostics and treatment optimization.", gradient: "from-red-500 to-pink-400" },
    { icon: <Settings className="w-8 h-8 text-white" />, title: "Manufacturing", description: "Optimize production with predictive maintenance and quality control systems.", gradient: "from-purple-500 to-indigo-400" },
    { icon: <Package className="w-8 h-8 text-white" />, title: "Logistics", description: "Streamline supply chains with intelligent routing and demand forecasting.", gradient: "from-orange-500 to-yellow-400" },
    { icon: <Rocket className="w-8 h-8 text-white" />, title: "Startups", description: "Launch faster with MVP development and scalable AI infrastructure.", gradient: "from-pink-500 to-rose-400" }
  ];

  const testimonials = [
    {
      quote: "82 Labs transformed our entire workflow in just 3 weeks. Their AI automation reduced our processing time by 80% and the ROI was immediate.",
      author: "David Chen",
      role: "CTO, TechFlow Solutions",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150"
    },
    {
      quote: "The custom software solution they built has been running flawlessly for over a year. Their attention to detail and technical expertise is unmatched.",
      author: "Sarah Johnson",
      role: "VP Engineering, DataCore",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150"
    },
    {
      quote: "From MVP to production in record time. 82 Labs understood our vision and delivered beyond our expectations.",
      author: "Michael Rodriguez",
      role: "Founder, InnovateLab",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150"
    }
  ];

  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-volcanic">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-morphism dark:glass-morphism-dark border-b border-gray-200/20 dark:border-gray-700/20">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="text-2xl font-bold bg-gradient-to-r from-green-700 to-blue-500 bg-clip-text text-transparent">
                82 LABS
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <button 
                onClick={() => scrollToSection("home")} 
                className="text-gray-700 dark:text-gray-300 hover:text-green-700 dark:hover:text-blue-400 transition-colors"
                data-testid="link-platform"
              >
                Platform
              </button>
              <button 
                onClick={() => scrollToSection("models")} 
                className="text-gray-700 dark:text-gray-300 hover:text-green-700 dark:hover:text-blue-400 transition-colors"
                data-testid="link-solutions"
              >
                Solutions
              </button>
              <button 
                onClick={() => scrollToSection("features")} 
                className="text-gray-700 dark:text-gray-300 hover:text-green-700 dark:hover:text-blue-400 transition-colors"
                data-testid="link-research"
              >
                Research
              </button>
              <button 
                onClick={() => scrollToSection("industries")} 
                className="text-gray-700 dark:text-gray-300 hover:text-green-700 dark:hover:text-blue-400 transition-colors"
                data-testid="link-resources"
              >
                Resources
              </button>
              <button 
                onClick={() => scrollToSection("contact")} 
                className="text-gray-700 dark:text-gray-300 hover:text-green-700 dark:hover:text-blue-400 transition-colors"
                data-testid="link-company"
              >
                Company
              </button>
            </div>
            
            {/* Theme Toggle & CTA */}
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                data-testid="button-theme-toggle"
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </Button>
              
              <Button
                onClick={() => setIsContactModalOpen(true)}
                className="gradient-coral text-white px-6 py-2 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all font-medium hidden md:block"
                data-testid="button-request-demo"
              >
                Request a Demo
              </Button>
              
              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                data-testid="button-mobile-menu"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
          
          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-gray-200/20 dark:border-gray-700/20 py-4"
            >
              <div className="flex flex-col space-y-4">
                <button onClick={() => scrollToSection("home")} className="text-left text-gray-700 dark:text-gray-300">Platform</button>
                <button onClick={() => scrollToSection("models")} className="text-left text-gray-700 dark:text-gray-300">Solutions</button>
                <button onClick={() => scrollToSection("features")} className="text-left text-gray-700 dark:text-gray-300">Research</button>
                <button onClick={() => scrollToSection("industries")} className="text-left text-gray-700 dark:text-gray-300">Resources</button>
                <button onClick={() => scrollToSection("contact")} className="text-left text-gray-700 dark:text-gray-300">Company</button>
                <Button
                  onClick={() => setIsContactModalOpen(true)}
                  className="gradient-coral text-white w-full"
                  data-testid="button-request-demo-mobile"
                >
                  Request a Demo
                </Button>
              </div>
            </motion.div>
          )}
        </nav>
      </header>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* 3D Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-volcanic dark:via-gray-900 dark:to-blue-900/20">
          <ThreeBackground />
        </div>
        
        {/* Hero Content */}
        <motion.div
          ref={heroRef}
          initial="initial"
          animate={heroInView ? "animate" : "initial"}
          variants={stagger}
          className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        >
          <motion.h1 
            variants={fadeInUp}
            className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-green-700 via-blue-500 to-orange-500 bg-clip-text text-transparent leading-tight"
            data-testid="text-hero-title"
          >
            The Future of AI
            <br />
            <span className="text-4xl md:text-6xl">Development</span>
          </motion.h1>
          
          <motion.p 
            variants={fadeInUp}
            className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed"
            data-testid="text-hero-description"
          >
            Custom software, AI automation, and MVPs delivered in weeks. 
            <span className="text-green-700 dark:text-blue-400 font-medium"> Scale your business with cutting-edge technology.</span>
          </motion.p>
          
          <motion.div 
            variants={fadeInUp}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button
              onClick={() => scrollToSection("contact")}
              size="lg"
              className="gradient-coral text-white px-8 py-4 rounded-xl text-lg font-semibold hover:shadow-xl transform hover:scale-105 transition-all"
              data-testid="button-get-started"
            >
              Get Started Today
            </Button>
            <Button
              variant="ghost"
              size="lg"
              className="text-green-700 dark:text-blue-400 font-semibold text-lg hover:underline"
              data-testid="button-watch-demo"
            >
              Watch Demo →
            </Button>
          </motion.div>
        </motion.div>
        
        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-gray-400 dark:border-gray-600 rounded-full flex justify-center">
            <motion.div 
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-3 bg-gray-400 dark:bg-gray-600 rounded-full mt-2"
            />
          </div>
        </motion.div>
      </section>

      {/* Solutions Section */}
      <section id="models" className="py-24 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white" data-testid="text-solutions-title">
              Our <span className="bg-gradient-to-r from-blue-500 to-orange-500 bg-clip-text text-transparent">Solutions</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto" data-testid="text-solutions-description">
              From custom software development to AI automation, we deliver enterprise-grade solutions tailored to your needs.
            </p>
          </motion.div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 max-w-2xl mx-auto mb-12 bg-white dark:bg-gray-800 rounded-2xl p-2 shadow-lg">
              <TabsTrigger value="custom" className="rounded-xl font-semibold" data-testid="tab-custom-software">Custom Software</TabsTrigger>
              <TabsTrigger value="ai" className="rounded-xl font-semibold" data-testid="tab-ai-automation">AI Automation</TabsTrigger>
              <TabsTrigger value="mvp" className="rounded-xl font-semibold" data-testid="tab-mvp-weeks">MVP in Weeks</TabsTrigger>
            </TabsList>
            
            {solutions.map((solution) => (
              <TabsContent key={solution.id} value={solution.id}>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid lg:grid-cols-2 gap-12 items-center"
                >
                  <div className="space-y-6" data-testid={`content-${solution.id}`}>
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{solution.title}</h3>
                    <p className="text-lg text-gray-600 dark:text-gray-300">
                      {solution.description}
                    </p>
                    <ul className="space-y-4">
                      {solution.features.map((feature, index) => (
                        <li key={index} className="flex items-start space-x-3">
                          <div className="w-6 h-6 bg-green-700 rounded-full flex items-center justify-center mt-0.5">
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                            </svg>
                          </div>
                          <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="relative">
                    <img 
                      src={solution.image} 
                      alt={`${solution.title} visualization`}
                      className="rounded-2xl shadow-2xl w-full h-auto"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-orange-500/20 rounded-2xl"></div>
                  </div>
                </motion.div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white dark:bg-volcanic">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              ref={index === 0 ? featuresRef : undefined}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className={`grid lg:grid-cols-2 gap-16 items-center mb-24 ${index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''}`}
            >
              <div className={`space-y-6 ${index % 2 === 1 ? 'lg:col-start-2' : ''}`} data-testid={`feature-${index}`}>
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${feature.gradient} rounded-lg flex items-center justify-center`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{feature.title}</h3>
                </div>
                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
                <ul className="space-y-3">
                  {feature.points.map((point, pointIndex) => (
                    <li key={pointIndex} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-gray-700 dark:text-gray-300">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className={`relative ${index % 2 === 1 ? 'lg:col-start-1' : ''}`}>
                <img 
                  src={feature.image} 
                  alt={`${feature.title} visualization`}
                  className="rounded-2xl shadow-2xl w-full h-auto"
                />
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient.replace('to-', 'to-').split(' ')[1]}/10 to-transparent rounded-2xl`}></div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Industries Section */}
      <section id="industries" className="py-24 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white" data-testid="text-industries-title">
              Industries We <span className="bg-gradient-to-r from-green-700 to-blue-500 bg-clip-text text-transparent">Transform</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto" data-testid="text-industries-description">
              From startups to Fortune 500 companies, we deliver tailored AI solutions across diverse industries.
            </p>
          </motion.div>
          
          <motion.div
            ref={industriesRef}
            initial="initial"
            animate={industriesInView ? "animate" : "initial"}
            variants={stagger}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {industries.map((industry, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                data-testid={`industry-${index}`}
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${industry.gradient} rounded-xl flex items-center justify-center mb-6`}>
                  {industry.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">{industry.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{industry.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Integration Section */}
      <section id="custom" className="py-24 bg-white dark:bg-volcanic">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white" data-testid="text-integration-title">
                  Seamless <span className="bg-gradient-to-r from-blue-500 to-orange-500 bg-clip-text text-transparent">Integration</span>
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed" data-testid="text-integration-description">
                  Our platform integrates with your existing infrastructure, providing a smooth transition to AI-powered operations.
                </p>
              </div>
              
              <div className="space-y-6">
                {[
                  {
                    title: "API-First Architecture",
                    description: "Connect with any system using our comprehensive REST and GraphQL APIs with real-time webhooks.",
                    gradient: "from-blue-500 to-cyan-400"
                  },
                  {
                    title: "Zero Downtime Deployment",
                    description: "Blue-green deployments ensure your services stay online during updates and migrations.",
                    gradient: "from-green-500 to-emerald-600"
                  },
                  {
                    title: "Custom Workflow Builder",
                    description: "Visual drag-and-drop interface to create complex automation workflows without coding.",
                    gradient: "from-orange-500 to-red-500"
                  },
                  {
                    title: "Enterprise Support",
                    description: "24/7 dedicated support team with SLA guarantees and priority response times.",
                    gradient: "from-purple-500 to-indigo-400"
                  }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2 }}
                    className="flex items-start space-x-4"
                    data-testid={`integration-feature-${index}`}
                  >
                    <div className={`w-8 h-8 bg-gradient-to-r ${item.gradient} rounded-full flex items-center justify-center flex-shrink-0 mt-1`}>
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                      <p className="text-gray-600 dark:text-gray-300">{item.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <img 
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="Business team collaborating around a conference table"
                className="rounded-2xl shadow-2xl w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-transparent to-orange-500/10 rounded-2xl"></div>
              
              {/* Floating Connection Points */}
              <div className="absolute top-4 right-4 w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
              <div className="absolute bottom-8 left-8 w-3 h-3 bg-orange-500 rounded-full animate-pulse delay-500"></div>
              <div className="absolute top-1/2 right-8 w-5 h-5 bg-green-700 rounded-full animate-pulse delay-1000"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Deployment Options */}
      <section id="deploy" className="py-24 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white" data-testid="text-deployment-title">
              Deployment <span className="bg-gradient-to-r from-green-700 to-blue-500 bg-clip-text text-transparent">Options</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto" data-testid="text-deployment-description">
              Choose the deployment model that best fits your security, compliance, and operational requirements.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"></path></svg>,
                title: "Cloud SaaS",
                description: "Fully managed cloud solution with automatic updates, scaling, and maintenance included.",
                features: ["99.9% uptime SLA", "Global CDN", "Automated backups"],
                gradient: "from-blue-500 to-cyan-400"
              },
              {
                icon: <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>,
                title: "Private Cloud (VPC)",
                description: "Dedicated cloud environment with enhanced security and compliance controls.",
                features: ["Dedicated resources", "Enhanced security", "Custom compliance"],
                gradient: "from-green-500 to-emerald-600"
              },
              {
                icon: <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>,
                title: "On-Premise",
                description: "Complete control with deployment in your own data center or infrastructure.",
                features: ["Full data control", "Custom integration", "Maximum security"],
                gradient: "from-orange-500 to-red-500"
              }
            ].map((option, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 border-2 border-transparent hover:border-blue-500/20"
                data-testid={`deployment-${index}`}
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${option.gradient} rounded-xl flex items-center justify-center mb-6`}>
                  {option.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">{option.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">{option.description}</p>
                <ul className="space-y-3 mb-8">
                  {option.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-3">
                      <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                      </svg>
                      <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className={`w-full bg-gradient-to-r ${option.gradient} text-white hover:shadow-lg transition-all`}>
                  Learn More →
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="quotes" className="py-24 bg-white dark:bg-volcanic">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white" data-testid="text-testimonials-title">
              What Our <span className="bg-gradient-to-r from-blue-500 to-orange-500 bg-clip-text text-transparent">Clients Say</span>
            </h2>
          </motion.div>
          
          <div className="relative max-w-4xl mx-auto">
            <motion.div
              key={currentTestimonial}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-3xl p-8 md:p-12 shadow-2xl"
              data-testid="testimonial-current"
            >
              <div className="text-center">
                <svg className="w-12 h-12 text-blue-500 mx-auto mb-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/>
                </svg>
                <blockquote className="text-2xl md:text-3xl font-light text-gray-900 dark:text-white mb-8 leading-relaxed" data-testid="testimonial-quote">
                  "{testimonials[currentTestimonial].quote}"
                </blockquote>
                <div className="flex items-center justify-center space-x-4">
                  <img 
                    src={testimonials[currentTestimonial].image} 
                    alt={`Professional headshot of ${testimonials[currentTestimonial].author}`}
                    className="w-16 h-16 rounded-full object-cover"
                    data-testid="testimonial-avatar"
                  />
                  <div className="text-left">
                    <div className="font-semibold text-gray-900 dark:text-white" data-testid="testimonial-author">
                      {testimonials[currentTestimonial].author}
                    </div>
                    <div className="text-gray-600 dark:text-gray-300" data-testid="testimonial-role">
                      {testimonials[currentTestimonial].role}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Progress Indicator */}
            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentTestimonial ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                  data-testid={`testimonial-indicator-${index}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section id="contact" className="py-24 bg-gradient-to-br from-blue-50 via-orange-50/20 to-orange-50 dark:from-gray-900 dark:via-blue-900/10 dark:to-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-green-700 via-blue-500 to-orange-500 bg-clip-text text-transparent" data-testid="text-contact-title">
              Ready to Transform Your Business?
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed" data-testid="text-contact-description">
              Join hundreds of companies already using our AI platform to scale their operations and drive innovation.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <Button
                onClick={() => setIsContactModalOpen(true)}
                size="lg"
                className="gradient-coral text-white px-10 py-4 rounded-xl text-xl font-semibold hover:shadow-2xl transform hover:scale-105 transition-all"
                data-testid="button-get-started-cta"
              >
                Get Started Today
              </Button>
              <Button
                variant="ghost"
                size="lg"
                className="text-green-700 dark:text-blue-400 font-semibold text-xl hover:underline"
                data-testid="button-schedule-demo"
              >
                Schedule a Demo →
              </Button>
            </div>
            
            <img 
              src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=400" 
              alt="Diverse team of tech professionals collaborating in a modern office"
              className="rounded-2xl shadow-2xl w-full h-64 object-cover"
              data-testid="img-contact-team"
            />
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-volcanic text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            {/* Company */}
            <div>
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-orange-500 bg-clip-text text-transparent mb-6">
                82 LABS
              </div>
              <p className="text-gray-300 mb-6">
                AI moves fast; we'll keep you up to date with the latest innovations and solutions.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors" data-testid="link-twitter">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors" data-testid="link-linkedin">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors" data-testid="link-github">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.292 1.199-.334 1.363-.055.225-.174.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.986C24.007 5.367 18.641.001.017 0z.001z"/>
                  </svg>
                </a>
              </div>
            </div>
            
            {/* Platform */}
            <div>
              <h4 className="font-semibold text-lg mb-6">Platform</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Custom Software</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">AI Automation</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">MVP Development</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">API Integration</a></li>
              </ul>
            </div>
            
            {/* Resources */}
            <div>
              <h4 className="font-semibold text-lg mb-6">Resources</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Case Studies</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Webinars</a></li>
              </ul>
            </div>
            
            {/* Support */}
            <div>
              <h4 className="font-semibold text-lg mb-6">Support</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">System Status</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 mb-4 md:mb-0">
              © 2024 82 Labs. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Terms</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Privacy</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Cookies</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Contact Modal */}
      <Modal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)}>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6" data-testid="text-modal-title">
          Get Started
        </h3>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">Name</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder="Your full name" 
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
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
                  <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      type="email"
                      placeholder="your@email.com" 
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
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
                  <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">Project Brief</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      placeholder="Tell us about your project in 140 characters..."
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white h-24 resize-none"
                      maxLength={140}
                      data-testid="textarea-brief"
                    />
                  </FormControl>
                  <div className="text-sm text-gray-500 dark:text-gray-400 text-right mt-1">
                    <span data-testid="text-character-count">{field.value?.length || 0}</span>/140
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              className="w-full gradient-coral text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
              disabled={contactMutation.isPending}
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
