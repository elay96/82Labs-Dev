import { useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { 
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
  ChevronRight,
  Play,
  ArrowRight,
  Code,
  Brain,
  Layers,
  Database,
  Cloud,
  Lock,
  FileText,
  Users,
  BookOpen,
  Award
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
import OrganicBackground from "@/components/three/background";

const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  brief: z.string().min(10, "Please provide more details").max(140, "Brief must be 140 characters or less"),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

export default function Home() {
  const [isDark, setIsDark] = useState(true); // Dark mode first
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
    const isLightMode = localStorage.getItem("theme") === "light";
    const isDarkMode = !isLightMode;
    
    setIsDark(isDarkMode);
    document.documentElement.classList.toggle("light", isLightMode);
  }, []);

  const toggleTheme = () => {
    const newDarkMode = !isDark;
    setIsDark(newDarkMode);
    localStorage.setItem("theme", newDarkMode ? "dark" : "light");
    document.documentElement.classList.toggle("light", !newDarkMode);
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
    <div className="min-h-screen bg-deep-navy light:bg-white transition-colors duration-300">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-morphism border-b border-white/10">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center">
              <div className="text-3xl font-bold kinetic-text">
                82 LABS
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <button 
                onClick={() => scrollToSection("platform")} 
                className="text-white/80 hover:text-soft-mint transition-colors duration-300 font-medium"
                data-testid="link-platform"
              >
                Platform
              </button>
              <button 
                onClick={() => scrollToSection("solutions")} 
                className="text-white/80 hover:text-soft-mint transition-colors duration-300 font-medium"
                data-testid="link-solutions"
              >
                Solutions
              </button>
              <button 
                onClick={() => scrollToSection("industries")} 
                className="text-white/80 hover:text-soft-mint transition-colors duration-300 font-medium"
                data-testid="link-industries"
              >
                Industries
              </button>
              <button 
                onClick={() => scrollToSection("research")} 
                className="text-white/80 hover:text-soft-mint transition-colors duration-300 font-medium"
                data-testid="link-research"
              >
                Research
              </button>
              <button 
                onClick={() => scrollToSection("company")} 
                className="text-white/80 hover:text-soft-mint transition-colors duration-300 font-medium"
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
                className="soft-button p-3 rounded-2xl text-white/80 hover:text-white"
                data-testid="button-theme-toggle"
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </Button>
              
              <Button
                onClick={() => scrollToSection("hero")}
                className="soft-button px-6 py-3 rounded-2xl text-white/90 hover:text-white font-medium hidden md:flex items-center gap-2"
                data-testid="button-get-started"
              >
                Get Started
                <ArrowRight className="w-4 h-4" />
              </Button>
              
              <Button
                onClick={() => setIsContactModalOpen(true)}
                className="gradient-organic text-white px-6 py-3 rounded-2xl hover:shadow-lg transform hover:scale-105 transition-all font-medium hidden md:flex items-center gap-2"
                data-testid="button-request-demo"
              >
                <Play className="w-4 h-4" />
                Watch Demo
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
      <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Organic Background */}
        <div className="absolute inset-0">
          <OrganicBackground />
        </div>
        
        {/* Hero Content */}
        <motion.div
          ref={heroRef}
          initial="initial"
          animate={heroInView ? "animate" : "initial"}
          variants={stagger}
          className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        >
          <motion.h1 
            variants={fadeInUp}
            className="text-6xl md:text-8xl font-black mb-8 kinetic-text leading-tight"
          >
            AI R&D Studio
          </motion.h1>
          <motion.p 
            variants={fadeInUp}
            className="text-xl md:text-2xl text-white/80 mb-4 max-w-4xl mx-auto font-light"
          >
            Custom AI software, intelligent automation, and rapid MVPs in weeks
          </motion.p>
          <motion.p 
            variants={fadeInUp}
            className="text-lg text-white/60 mb-12 max-w-2xl mx-auto"
          >
            We fuse organic thinking with synthetic precision to transform your business with cutting-edge AI solutions
          </motion.p>
          
          <motion.div 
            variants={fadeInUp}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <Button
              onClick={() => scrollToSection("platform")}
              className="gradient-organic text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center gap-3"
              data-testid="button-get-started-hero"
            >
              Get Started
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button
              onClick={() => setIsContactModalOpen(true)}
              className="soft-button text-white px-8 py-4 rounded-2xl text-lg font-semibold flex items-center gap-3 border border-white/20"
              data-testid="button-watch-demo-hero"
            >
              <Play className="w-5 h-5" />
              Watch Demo
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* Platform Section */}
      <section id="platform" className="py-32 bg-charcoal relative overflow-hidden">
        <div className="absolute inset-0 cell-pattern opacity-20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            ref={featuresRef}
            initial="initial"
            animate={featuresInView ? "animate" : "initial"}
            variants={stagger}
            className="text-center mb-20"
          >
            <motion.h2 
              variants={fadeInUp}
              className="text-5xl md:text-6xl font-bold mb-6 kinetic-text"
            >
              Platform
            </motion.h2>
            <motion.p 
              variants={fadeInUp}
              className="text-xl text-white/70 max-w-3xl mx-auto"
            >
              Our neural architecture scales infinitely while maintaining enterprise-grade security and precision AI capabilities
            </motion.p>
          </motion.div>

          <motion.div 
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <motion.div variants={fadeInUp} className="soft-card p-8 text-center group hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 gradient-organic rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Infinitely Scalable</h3>
              <p className="text-white/70 mb-6">Auto-scaling architecture with cloud-native deployment that grows with your business</p>
              <ul className="text-sm text-white/60 space-y-2">
                <li>• Auto-scaling infrastructure</li>
                <li>• Load balancing & CDN optimization</li>
                <li>• Global deployment capabilities</li>
              </ul>
            </motion.div>

            <motion.div variants={fadeInUp} className="soft-card p-8 text-center group hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 gradient-neural rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Enterprise Security</h3>
              <p className="text-white/70 mb-6">Military-grade encryption with zero-trust architecture and compliance standards</p>
              <ul className="text-sm text-white/60 space-y-2">
                <li>• End-to-end encryption</li>
                <li>• SOC 2 Type II compliance</li>
                <li>• Multi-factor authentication</li>
              </ul>
            </motion.div>

            <motion.div variants={fadeInUp} className="soft-card p-8 text-center group hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 gradient-synthetic rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Precision AI</h3>
              <p className="text-white/70 mb-6">Industry-leading accuracy through advanced machine learning and continuous optimization</p>
              <ul className="text-sm text-white/60 space-y-2">
                <li>• 99.7% accuracy rate</li>
                <li>• Real-time model optimization</li>
                <li>• Continuous learning algorithms</li>
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Solutions Section */}
      <section id="solutions" className="py-32 bg-deep-navy relative overflow-hidden">
        <div className="absolute inset-0 voronoi-bg opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div className="text-center mb-20">
            <motion.h2 
              variants={fadeInUp}
              className="text-5xl md:text-6xl font-bold mb-6 kinetic-text"
            >
              Solutions
            </motion.h2>
            <motion.p 
              variants={fadeInUp}
              className="text-xl text-white/70 max-w-3xl mx-auto"
            >
              From custom software to intelligent automation, we transform ideas into reality
            </motion.p>
          </motion.div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-12 bg-transparent">
              <TabsTrigger 
                value="custom" 
                className="soft-button data-[state=active]:gradient-organic data-[state=active]:text-white text-white/60 font-semibold py-4 px-8 rounded-2xl"
              >
                <Code className="w-5 h-5 mr-2" />
                Custom Software
              </TabsTrigger>
              <TabsTrigger 
                value="ai" 
                className="soft-button data-[state=active]:gradient-neural data-[state=active]:text-white text-white/60 font-semibold py-4 px-8 rounded-2xl"
              >
                <Brain className="w-5 h-5 mr-2" />
                AI Automation
              </TabsTrigger>
              <TabsTrigger 
                value="mvp" 
                className="soft-button data-[state=active]:gradient-synthetic data-[state=active]:text-white text-white/60 font-semibold py-4 px-8 rounded-2xl"
              >
                <Rocket className="w-5 h-5 mr-2" />
                MVP in Weeks
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="custom" className="mt-0">
              <div className="soft-card p-12">
                <h3 className="text-3xl font-bold text-white mb-6">Enterprise-Grade Custom Software</h3>
                <p className="text-xl text-white/80 mb-8">
                  Built with modern architectures, scalable infrastructure, and best practices that grow with your business
                </p>
                <ul className="text-white/70 space-y-4 text-lg">
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-soft-mint rounded-full"></div>
                    Microservices architecture for maximum scalability
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-electric-cyan rounded-full"></div>
                    Cloud-native deployment with DevOps integration
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-neural-purple rounded-full"></div>
                    Advanced security and compliance standards
                  </li>
                </ul>
              </div>
            </TabsContent>
            
            <TabsContent value="ai" className="mt-0">
              <div className="soft-card p-12">
                <h3 className="text-3xl font-bold text-white mb-6">Intelligent AI Automation</h3>
                <p className="text-xl text-white/80 mb-8">
                  Transform your workflows with cutting-edge machine learning and intelligent decision-making processes
                </p>
                <ul className="text-white/70 space-y-4 text-lg">
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-coral-bright rounded-full"></div>
                    Custom AI models trained on your data
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-warm-amber rounded-full"></div>
                    Workflow automation and optimization
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-neural-purple rounded-full"></div>
                    Real-time analytics and insights
                  </li>
                </ul>
              </div>
            </TabsContent>
            
            <TabsContent value="mvp" className="mt-0">
              <div className="soft-card p-12">
                <h3 className="text-3xl font-bold text-white mb-6">Rapid MVP Development</h3>
                <p className="text-xl text-white/80 mb-8">
                  Validate your ideas and get to market faster with our accelerated development methodology
                </p>
                <ul className="text-white/70 space-y-4 text-lg">
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-soft-mint rounded-full"></div>
                    Rapid prototyping and validation
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-electric-cyan rounded-full"></div>
                    Agile development methodology
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-coral-bright rounded-full"></div>
                    Quick iteration and feedback cycles
                  </li>
                </ul>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Industries Section */}
      <section id="industries" className="py-32 bg-charcoal relative overflow-hidden">
        <div className="absolute inset-0 cell-pattern opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            ref={industriesRef}
            initial="initial"
            animate={industriesInView ? "animate" : "initial"}
            variants={stagger}
            className="text-center mb-20"
          >
            <motion.h2 
              variants={fadeInUp}
              className="text-5xl md:text-6xl font-bold mb-6 kinetic-text"
            >
              Industries We Transform
            </motion.h2>
            <motion.p 
              variants={fadeInUp}
              className="text-xl text-white/70 max-w-3xl mx-auto"
            >
              From technology to healthcare, we're revolutionizing industries with intelligent automation
            </motion.p>
          </motion.div>

          <motion.div 
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {[
              { icon: <Monitor className="w-8 h-8 text-white" />, title: "Technology", description: "Accelerate innovation with AI-powered development tools", gradient: "gradient-organic" },
              { icon: <DollarSign className="w-8 h-8 text-white" />, title: "Finance", description: "Transform financial services with intelligent automation", gradient: "gradient-neural" },
              { icon: <Heart className="w-8 h-8 text-white" />, title: "Healthcare", description: "Improve patient outcomes with AI-driven diagnostics", gradient: "gradient-synthetic" },
              { icon: <Settings className="w-8 h-8 text-white" />, title: "Manufacturing", description: "Optimize production with predictive maintenance", gradient: "gradient-organic" },
              { icon: <Package className="w-8 h-8 text-white" />, title: "Logistics", description: "Streamline supply chains with intelligent routing", gradient: "gradient-neural" },
              { icon: <Rocket className="w-8 h-8 text-white" />, title: "Startups", description: "Launch faster with MVP development and AI infrastructure", gradient: "gradient-synthetic" }
            ].map((industry, index) => (
              <motion.div 
                key={industry.title}
                variants={fadeInUp}
                className="soft-card p-8 text-center group hover:-translate-y-2 transition-transform duration-300"
              >
                <div className={`w-16 h-16 ${industry.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {industry.icon}
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{industry.title}</h3>
                <p className="text-white/70">{industry.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Research & Resources Section */}
      <section id="research" className="py-32 bg-deep-navy relative overflow-hidden">
        <div className="absolute inset-0 voronoi-bg opacity-5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div className="text-center mb-20">
            <motion.h2 
              variants={fadeInUp}
              className="text-5xl md:text-6xl font-bold mb-6 kinetic-text"
            >
              Research & Resources
            </motion.h2>
            <motion.p 
              variants={fadeInUp}
              className="text-xl text-white/70 max-w-3xl mx-auto"
            >
              Insights, research, and resources to keep you at the forefront of AI innovation
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div variants={fadeInUp} className="soft-card p-8">
              <div className="w-16 h-16 gradient-organic rounded-2xl flex items-center justify-center mb-6">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Research Papers</h3>
              <p className="text-white/70 mb-6">Cutting-edge AI research and white papers from our team of experts</p>
              <Button className="soft-button text-white/80 hover:text-white px-6 py-2 rounded-xl">
                Browse Research
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>

            <motion.div variants={fadeInUp} className="soft-card p-8">
              <div className="w-16 h-16 gradient-neural rounded-2xl flex items-center justify-center mb-6">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Case Studies</h3>
              <p className="text-white/70 mb-6">Real-world examples of AI transformation across industries</p>
              <Button className="soft-button text-white/80 hover:text-white px-6 py-2 rounded-xl">
                View Cases
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>

            <motion.div variants={fadeInUp} className="soft-card p-8">
              <div className="w-16 h-16 gradient-synthetic rounded-2xl flex items-center justify-center mb-6">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">AI Tutorials</h3>
              <p className="text-white/70 mb-6">Step-by-step guides to implementing AI in your organization</p>
              <Button className="soft-button text-white/80 hover:text-white px-6 py-2 rounded-xl">
                Start Learning
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Company Section */}
      <section id="company" className="py-32 bg-charcoal relative overflow-hidden">
        <div className="absolute inset-0 cell-pattern opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <motion.h2 
              variants={fadeInUp}
              className="text-5xl md:text-6xl font-bold mb-6 kinetic-text"
            >
              Company
            </motion.h2>
            <motion.p 
              variants={fadeInUp}
              className="text-2xl text-white/80 mb-8 max-w-4xl mx-auto"
            >
              We're a team of AI researchers, engineers, and visionaries committed to pushing the boundaries of what's possible
            </motion.p>
            <motion.p 
              variants={fadeInUp}
              className="text-lg text-white/60 mb-12 max-w-3xl mx-auto"
            >
              Our mission is to democratize AI technology and make it accessible to businesses of all sizes, 
              helping them transform their operations and achieve unprecedented growth.
            </motion.p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button
                onClick={() => setIsContactModalOpen(true)}
                className="gradient-organic text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center gap-3"
                data-testid="button-contact-us"
              >
                <Users className="w-5 h-5" />
                Contact Us
              </Button>
              <Button
                className="soft-button text-white px-8 py-4 rounded-2xl text-lg font-semibold flex items-center gap-3 border border-white/20"
                data-testid="button-careers"
              >
                Careers
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-charcoal border-t border-white/10 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div>
              <div className="text-3xl font-bold kinetic-text mb-4">82 LABS</div>
              <p className="text-white/60 mb-6">AI moves fast; we'll keep you up to date with the latest.</p>
              <div className="flex space-x-4">
                <Button className="soft-button p-3 rounded-xl text-white/60 hover:text-white">
                  {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </Button>
              </div>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Platform</h3>
              <ul className="space-y-3 text-white/60">
                <li><button onClick={() => scrollToSection("platform")} className="hover:text-white transition-colors">Features</button></li>
                <li><button onClick={() => scrollToSection("solutions")} className="hover:text-white transition-colors">Solutions</button></li>
                <li><button className="hover:text-white transition-colors">Pricing</button></li>
                <li><button className="hover:text-white transition-colors">Documentation</button></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-3 text-white/60">
                <li><button onClick={() => scrollToSection("company")} className="hover:text-white transition-colors">About</button></li>
                <li><button className="hover:text-white transition-colors">Careers</button></li>
                <li><button onClick={() => scrollToSection("research")} className="hover:text-white transition-colors">Research</button></li>
                <li><button onClick={() => setIsContactModalOpen(true)} className="hover:text-white transition-colors">Contact</button></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Legal</h3>
              <ul className="space-y-3 text-white/60">
                <li><button className="hover:text-white transition-colors">Privacy Policy</button></li>
                <li><button className="hover:text-white transition-colors">Terms of Service</button></li>
                <li><button className="hover:text-white transition-colors">Security</button></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/10 mt-12 pt-8 text-center">
            <p className="text-white/40">© 2024 82 Labs. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Contact Modal */}
      <Modal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)}>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-4">Request a Demo</h2>
          <p className="text-white/70">Tell us about your project and we'll get back to you within 24 hours</p>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Name</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      className="soft-button border-white/20 text-white placeholder:text-white/50" 
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
                  <FormLabel className="text-white">Email</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      type="email"
                      className="soft-button border-white/20 text-white placeholder:text-white/50" 
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
                  <FormLabel className="text-white">Project Brief (140 chars max)</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      className="soft-button border-white/20 text-white placeholder:text-white/50 resize-none" 
                      placeholder="Tell us about your project..."
                      rows={4}
                      maxLength={140}
                      data-testid="textarea-brief"
                    />
                  </FormControl>
                  <FormMessage />
                  <p className="text-sm text-white/50">{field.value?.length || 0}/140 characters</p>
                </FormItem>
              )}
            />
            
            <Button
              type="submit"
              disabled={contactMutation.isPending}
              className="gradient-organic text-white w-full py-3 rounded-2xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
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
