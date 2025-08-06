import { useState, useEffect, useRef } from "react";
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
  const [activeModel, setActiveModel] = useState("fullstack");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [navBackground, setNavBackground] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const { toast } = useToast();

  // Refs for scroll animations
  const heroRef = useRef<HTMLDivElement>(null);
  const platformRef = useRef<HTMLDivElement>(null);
  const solutionsRef = useRef<HTMLDivElement>(null);
  const researchRef = useRef<HTMLDivElement>(null);
  const companyRef = useRef<HTMLDivElement>(null);

  const models = [
    {
      id: "fullstack",
      name: "Fullstack",
      title: "Fullstack Development",
      description: "End-to-end web and mobile applications using React, Node.js, Python, and modern cloud infrastructure. From MVP to enterprise scale.",
      gradient: "from-purple-400 via-pink-400 to-orange-400"
    },
    {
      id: "automation", 
      name: "Automation",
      title: "Intelligent Automation",
      description: "Complex workflow automation using n8n and LangGraph. AI-powered processes that integrate with your existing tools and systems.",
      gradient: "from-blue-400 via-purple-400 to-pink-400"
    },
    {
      id: "lectures",
      name: "Lectures", 
      title: "n8n Training & Consulting",
      description: "Official n8n lecturing and training programs. Transform your team into automation experts with hands-on workshops and consulting.",
      gradient: "from-green-400 via-blue-400 to-purple-400"
    }
  ];

  const currentModel = models.find(m => m.id === activeModel) || models[0];

  // Advanced scroll animation system
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min(scrollY / documentHeight, 1);
      
      setScrollProgress(progress);
      setNavBackground(scrollY > 20);
      
      // Advanced reveal animations with precise timing
      const reveals = document.querySelectorAll('.reveal:not(.revealed)');
      reveals.forEach((element, index) => {
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const elementTop = rect.top;
        const elementHeight = rect.height;
        
        // Calculate reveal threshold based on element position
        const revealPoint = windowHeight * 0.8;
        const progressPoint = windowHeight * 0.6;
        
        if (elementTop < revealPoint) {
          // Add delay based on index for sequential reveals
          setTimeout(() => {
            element.classList.add('revealed');
          }, index * 150);
        }
        
        // Progressive animation based on scroll progress
        if (elementTop < progressPoint && elementTop > -elementHeight) {
          const elementProgress = Math.max(0, Math.min(1, (progressPoint - elementTop) / elementHeight));
          (element as HTMLElement).style.setProperty('--scroll-progress', elementProgress.toString());
        }
      });
      
      // Stagger animations with improved timing
      const staggerItems = document.querySelectorAll('.stagger-item:not(.animate)');
      staggerItems.forEach((element, index) => {
        const rect = element.getBoundingClientRect();
        const triggerPoint = window.innerHeight * 0.85;
        
        if (rect.top < triggerPoint) {
          // Staggered timing based on position and index
          setTimeout(() => {
            element.classList.add('animate');
          }, index * 100 + Math.random() * 50);
        }
      });

      // Parallax effects for sections
      updateParallaxEffects(scrollY);
    };

    const updateParallaxEffects = (scrollY: number) => {
      const sections = [heroRef, platformRef, solutionsRef, researchRef, companyRef];
      
      sections.forEach((ref, index) => {
        if (ref.current) {
          const rect = ref.current.getBoundingClientRect();
          const speed = 0.5 + (index * 0.1); // Different speeds for each section
          const yPos = -(scrollY * speed);
          const opacity = Math.max(0, Math.min(1, 1 - Math.abs(rect.top) / window.innerHeight));
          
          // Apply subtle parallax effects only on desktop
          if (window.innerWidth > 768) {
            ref.current.style.transform = `translateY(${yPos * 0.05}px)`;
          }
          // Keep opacity normal for mobile
          ref.current.style.opacity = window.innerWidth > 768 ? opacity.toString() : '1';
        }
      });
    };

    // Throttled scroll handler for better performance
    let ticking = false;
    const throttledHandleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledHandleScroll, { passive: true });
    handleScroll(); // Initial call
    
    return () => window.removeEventListener('scroll', throttledHandleScroll);
  }, []);

  // Handle click outside dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const dropdown = document.querySelector('.dropdown-container');
      if (dropdown && !dropdown.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsDropdownOpen(false);
      }
      if (event.key === 'ArrowLeft') {
        const currentIndex = models.findIndex(m => m.id === activeModel);
        const newIndex = currentIndex > 0 ? currentIndex - 1 : models.length - 1;
        setActiveModel(models[newIndex].id);
      }
      if (event.key === 'ArrowRight') {
        const currentIndex = models.findIndex(m => m.id === activeModel);
        const newIndex = currentIndex < models.length - 1 ? currentIndex + 1 : 0;
        setActiveModel(models[newIndex].id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModel, models]);

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

      {/* Scroll Progress Indicator */}
      <div 
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 z-50 transition-all duration-300"
        style={{ width: `${scrollProgress * 100}%` }}
      />

      {/* Hero Section */}
      <section id="hero" className="pt-24 pb-16 px-4 sm:px-6 lg:px-8" ref={heroRef}>
        <div className="max-w-4xl mx-auto text-center">
          {/* Trusted by companies badge */}
          <div className="mb-8 fade-in">
            <p className="text-sm text-gray-600 mb-4">Trusted by startups and enterprises worldwide</p>
            <div className="flex justify-center items-center space-x-4 md:space-x-8 opacity-60 text-sm md:text-base">
              <span className="font-semibold stagger-item">TechCorp</span>
              <span className="font-semibold stagger-item">InnovateLabs</span>
              <span className="font-semibold stagger-item">DataFlow Inc</span>
            </div>
          </div>
          
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 max-w-4xl mx-auto fade-in-delay-1 leading-tight">
            Expert Software Development & Automation Solutions
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto fade-in-delay-2 leading-relaxed">
            82 Labs delivers complex fullstack applications for web and mobile, powered by cutting-edge automation 
            technologies including n8n and LangGraph. Official n8n lecturers with enterprise-grade expertise.
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
      <section id="platform" className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50" ref={platformRef}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 reveal">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Core Services
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Three specialized domains where we excel — delivering comprehensive solutions from concept to deployment.
            </p>
          </div>

          {/* Model Selector */}
          <div className="mb-8 reveal">
            <div className="flex justify-center">
              <div className="relative dropdown-container z-50">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="inline-flex items-center px-4 py-2 font-medium text-gray-900 border-b-2 border-orange-200 transition-all duration-300 hover:border-orange-300 focus:outline-none focus:border-orange-400"
                  aria-haspopup="true"
                  aria-expanded={isDropdownOpen}
                >
                  {currentModel.name}
                  <ChevronDown className={`w-5 h-5 text-gray-400 ml-2 transition-transform duration-300 ${
                    isDropdownOpen ? 'rotate-180' : ''
                  }`} />
                </button>
                
                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute dropdown-menu top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl min-w-[200px] animate-in fade-in slide-in-from-top-2 duration-200">
                    {models.map((model) => (
                      <button
                        key={model.id}
                        onClick={() => {
                          setActiveModel(model.id);
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors duration-200 first:rounded-t-lg last:rounded-b-lg focus:outline-none focus:bg-gray-50 ${
                          activeModel === model.id ? 'bg-gray-50 text-gray-900' : 'text-gray-600'
                        }`}
                      >
                        {model.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* Navigation hint */}
            <div className="text-center mt-4">
              <p className="text-xs text-gray-400">Use arrow keys to navigate • Swipe on mobile</p>
            </div>
          </div>

          {/* Model Card with Touch Support */}
          <div className="max-w-md mx-auto reveal touch-pan-x relative z-10">
            <div 
              className="model-card-container"
              onTouchStart={(e) => {
                const touch = e.touches[0];
                e.currentTarget.setAttribute('data-start-x', touch.clientX.toString());
              }}
              onTouchEnd={(e) => {
                const startX = parseFloat(e.currentTarget.getAttribute('data-start-x') || '0');
                const endX = e.changedTouches[0].clientX;
                const diff = startX - endX;
                
                if (Math.abs(diff) > 50) { // Threshold for swipe
                  const currentIndex = models.findIndex(m => m.id === activeModel);
                  if (diff > 0 && currentIndex < models.length - 1) {
                    // Swipe left - next
                    setActiveModel(models[currentIndex + 1].id);
                  } else if (diff < 0 && currentIndex > 0) {
                    // Swipe right - previous
                    setActiveModel(models[currentIndex - 1].id);
                  }
                }
              }}
            >
              <div className="bg-gray-900 text-white rounded-t-2xl p-6 relative overflow-hidden">
                <h3 className="text-xl font-semibold mb-4 transition-all duration-500">{currentModel.title}</h3>
                <p className="text-gray-300 mb-6 transition-all duration-500">
                  {currentModel.description}
                </p>
                <button className="flex items-center text-white hover:text-gray-300 transition-all duration-300 group">
                  Learn more 
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
              
              {/* Gradient Background */}
              <div 
                key={currentModel.id}
                className={`h-64 bg-gradient-to-br ${currentModel.gradient} rounded-b-2xl relative overflow-hidden transition-all duration-700 ease-in-out`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-white/20"></div>
                
                {/* Abstract Shapes */}
                <div className="absolute inset-0">
                  <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white/20 rounded-full blur-xl shape-pulse"></div>
                  <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-white/30 rounded-full blur-lg shape-pulse" style={{ animationDelay: '1s' }}></div>
                  <div className="absolute top-1/2 right-1/3 w-16 h-16 bg-white/25 rounded-full blur-md shape-pulse" style={{ animationDelay: '2s' }}></div>
                </div>
                
                {/* Interactive Demo Card */}
                <div className="absolute bottom-4 left-4 right-4 bg-white rounded-xl p-4 shadow-lg transition-all duration-500">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-gray-700">{currentModel.title}</span>
                  </div>
                  <p className="text-xs text-gray-500">
                    {currentModel.id === 'fullstack' && 'React + Node.js + Cloud Infrastructure'}
                    {currentModel.id === 'automation' && 'n8n + LangGraph + AI Integration'}
                    {currentModel.id === 'lectures' && 'Official n8n Certification Program'}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Navigation Dots */}
            <div className="flex justify-center space-x-2 mt-4">
              {models.map((model, index) => (
                <button
                  key={model.id}
                  onClick={() => setActiveModel(model.id)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    activeModel === model.id ? 'bg-gray-700 w-6' : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`View ${model.name}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="solutions" className="py-16 px-4 sm:px-6 lg:px-8" ref={solutionsRef}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 reveal">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose 82 Labs
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our approach combines technical excellence with proven methodologies to deliver exceptional results.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Scalable */}
            <div className="text-center stagger-item fade-in-left">
              <div className="w-12 h-12 mx-auto mb-4 transition-all hover:scale-110 hover:rotate-12 duration-500 group">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-full h-full text-purple-600 group-hover:text-purple-700 transition-colors">
                  <rect x="3" y="3" width="7" height="7" rx="1"/>
                  <rect x="14" y="3" width="7" height="7" rx="1"/>
                  <rect x="14" y="14" width="7" height="7" rx="1"/>
                  <rect x="3" y="14" width="7" height="7" rx="1"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3 transition-colors hover:text-purple-700 duration-300">Enterprise-Ready</h3>
              <p className="text-gray-600 transition-all duration-300 hover:text-gray-800">
                From rapid prototypes to production-scale applications. We build robust, maintainable solutions 
                that grow with your business using modern cloud-native architectures.
              </p>
            </div>

            {/* Accurate */}
            <div className="text-center stagger-item scale-in">
              <div className="w-12 h-12 mx-auto mb-4 transition-all hover:scale-110 hover:-rotate-6 duration-500 group">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-full h-full text-blue-600 group-hover:text-blue-700 transition-colors">
                  <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3 transition-colors hover:text-blue-700 duration-300">Automation Experts</h3>
              <p className="text-gray-600 transition-all duration-300 hover:text-gray-800">
                Specialized in n8n and LangGraph workflows. We create intelligent automation systems that 
                reduce manual work and integrate seamlessly with your existing business processes.
              </p>
            </div>

            {/* Secure */}
            <div className="text-center stagger-item fade-in-right">
              <div className="w-12 h-12 mx-auto mb-4 transition-all hover:scale-110 hover:rotate-6 duration-500 group">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-full h-full text-green-600 group-hover:text-green-700 transition-colors">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <circle cx="12" cy="16" r="1"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3 transition-colors hover:text-green-700 duration-300">Training & Support</h3>
              <p className="text-gray-600 transition-all duration-300 hover:text-gray-800">
                Official n8n lecturers providing comprehensive training programs. We don't just build solutions — 
                we empower your team with the knowledge to maintain and extend them.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Industries Section */}
      <section id="research" className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50" ref={researchRef}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 reveal">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">
              Industries We Serve
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From fintech to healthcare, we deliver specialized solutions across complex industries.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Technology */}
            <div className="minimal-card bg-cover bg-center h-64 relative overflow-hidden group stagger-item" 
                 style={{backgroundImage: "url('https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400')"}}>
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-all duration-300"></div>
              <div className="absolute bottom-6 left-6 text-white transform group-hover:translate-y-1 transition-transform duration-300">
                <h3 className="text-2xl font-semibold mb-2">Fintech & SaaS</h3>
                <p className="text-sm opacity-90">Complex financial applications and enterprise software</p>
              </div>
            </div>

            {/* Finance */}
            <div className="minimal-card bg-cover bg-center h-64 relative overflow-hidden group stagger-item" 
                 style={{backgroundImage: "url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400')"}}>
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-all duration-300"></div>
              <div className="absolute bottom-6 left-6 text-white transform group-hover:translate-y-1 transition-transform duration-300">
                <h3 className="text-2xl font-semibold mb-2">Healthcare & AI</h3>
                <p className="text-sm opacity-90">Intelligent automation and data processing solutions</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Company Section */}
      <section id="company" className="py-16 px-4 sm:px-6 lg:px-8" ref={companyRef}>
        <div className="max-w-4xl mx-auto text-center reveal">
          <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-6">
            Ready to transform your business with intelligent automation and expert development?
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              onClick={() => setIsContactModalOpen(true)}
              className="minimal-button minimal-button-primary"
              data-testid="button-get-started"
            >
              Get Started Today
            </Button>
            <button className="flex items-center text-gray-900 hover:text-gray-600 transition-all duration-300 font-medium group">
              View Our Work 
              <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
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