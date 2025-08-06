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
  const [isTransitioning, setIsTransitioning] = useState(false);
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
        setIsTransitioning(true);
        setTimeout(() => {
          setActiveModel(models[newIndex].id);
          setIsTransitioning(false);
        }, 200);
      }
      if (event.key === 'ArrowRight') {
        const currentIndex = models.findIndex(m => m.id === activeModel);
        const newIndex = currentIndex < models.length - 1 ? currentIndex + 1 : 0;
        setIsTransitioning(true);
        setTimeout(() => {
          setActiveModel(models[newIndex].id);
          setIsTransitioning(false);
        }, 200);
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
          {/* Empty space where trusted companies used to be */}
          <div className="mb-8"></div>
          
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 max-w-4xl mx-auto fade-in-delay-1 leading-tight font-space-mono">
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
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4 font-space-mono">
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
                          setIsTransitioning(true);
                          setTimeout(() => {
                            setActiveModel(model.id);
                            setIsTransitioning(false);
                          }, 200);
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
          <div className="max-w-4xl lg:max-w-5xl mx-auto reveal touch-pan-x relative z-10 lg:w-4/5">
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
                    setIsTransitioning(true);
                    setTimeout(() => {
                      setActiveModel(models[currentIndex + 1].id);
                      setIsTransitioning(false);
                    }, 200);
                  } else if (diff < 0 && currentIndex > 0) {
                    // Swipe right - previous
                    setIsTransitioning(true);
                    setTimeout(() => {
                      setActiveModel(models[currentIndex - 1].id);
                      setIsTransitioning(false);
                    }, 200);
                  }
                }
              }}
            >
              <div className="bg-gray-900 text-white rounded-t-2xl p-8 lg:p-12 relative overflow-hidden">
                {/* Moving transition element */}
                <div className={`card-moving-element ${isTransitioning ? 'active' : ''}`}></div>
                
                <h3 className="text-2xl lg:text-3xl font-semibold mb-6 card-content-transition font-space-mono">{currentModel.title}</h3>
                <p className="text-gray-300 mb-8 text-lg lg:text-xl leading-relaxed card-content-transition">
                  {currentModel.description}
                </p>
                <button className="flex items-center text-white hover:text-gray-300 transition-all duration-300 group text-lg">
                  Learn more 
                  <ArrowRight className="w-5 h-5 ml-3 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
              
              {/* Gradient Background */}
              <div 
                key={currentModel.id}
                className={`h-80 lg:h-96 bg-gradient-to-br ${currentModel.gradient} rounded-b-2xl relative overflow-hidden transition-all duration-1000 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-white/20 card-content-transition"></div>
                
                {/* Moving transition element */}
                <div className={`card-moving-element ${isTransitioning ? 'active' : ''}`}></div>
                
                {/* Abstract Shapes */}
                <div className="absolute inset-0">
                  <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white/20 rounded-full blur-xl shape-pulse"></div>
                  <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-white/30 rounded-full blur-lg shape-pulse" style={{ animationDelay: '1s' }}></div>
                  <div className="absolute top-1/2 right-1/3 w-16 h-16 bg-white/25 rounded-full blur-md shape-pulse" style={{ animationDelay: '2s' }}></div>
                </div>
                
                {/* Interactive Demo Card */}
                <div className="absolute bottom-6 left-6 right-6 bg-white rounded-xl p-6 shadow-lg card-content-transition">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-base font-semibold text-gray-700">{currentModel.title}</span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
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
                  className={`w-2 h-2 rounded-full transition-all duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${
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
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4 font-space-mono">
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
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-full h-full text-black transition-colors">
                  <rect x="3" y="3" width="7" height="7" rx="1"/>
                  <rect x="14" y="3" width="7" height="7" rx="1"/>
                  <rect x="14" y="14" width="7" height="7" rx="1"/>
                  <rect x="3" y="14" width="7" height="7" rx="1"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3 transition-colors hover:text-gray-700 duration-300">Enterprise-Ready</h3>
              <p className="text-gray-600 transition-all duration-300 hover:text-gray-800">
                From rapid prototypes to production-scale applications. We build robust, maintainable solutions 
                that grow with your business using modern cloud-native architectures.
              </p>
            </div>

            {/* Accurate */}
            <div className="text-center stagger-item scale-in">
              <div className="w-12 h-12 mx-auto mb-4 transition-all hover:scale-110 hover:-rotate-6 duration-500 group">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-full h-full text-black transition-colors">
                  <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3 transition-colors hover:text-gray-700 duration-300">Automation Experts</h3>
              <p className="text-gray-600 transition-all duration-300 hover:text-gray-800">
                Specialized in n8n and LangGraph workflows. We create intelligent automation systems that 
                reduce manual work and integrate seamlessly with your existing business processes.
              </p>
            </div>

            {/* Secure */}
            <div className="text-center stagger-item fade-in-right">
              <div className="w-12 h-12 mx-auto mb-4 transition-all hover:scale-110 hover:rotate-6 duration-500 group">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-full h-full text-black transition-colors">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <circle cx="12" cy="16" r="1"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3 transition-colors hover:text-gray-700 duration-300">Training & Support</h3>
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
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4 font-space-mono">
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
          <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-6 font-space-mono">
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
          
          {/* Technology Sliding Bar */}
          <div className="mt-16 overflow-hidden">
            <div className="tech-slider">
              <div className="tech-track">
                {/* Programming Languages */}
                <div className="tech-item">
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 18.178l4.62-1.256.623-6.778H9.026L8.822 7.89h8.626l.227-2.211H6.325l.636 6.678h7.82l-.261 2.866-2.52.667-2.52-.667-.162-1.844h-2.27l.329 3.544L12 18.178z"/>
                  </svg>
                  <span>HTML5</span>
                </div>
                
                <div className="tech-item">
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M1.5 0h21l-1.91 21.563L11.977 24l-8.565-2.438L1.5 0zm17.09 4.413L5.41 4.413l.213 2.622h10.125l-.255 2.716h-6.64l.24 2.573h6.182l-.366 3.523-2.91.804-2.956-.81-.188-2.11h-2.61l.29 3.855L12 19.288l5.373-1.53L18.59 4.414z"/>
                  </svg>
                  <span>CSS3</span>
                </div>
                
                <div className="tech-item">
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M0 0h24v24H0V0zm22.034 18.276c-.175-1.095-.888-2.015-3.003-2.873-.736-.345-1.554-.585-1.797-1.14-.091-.33-.105-.51-.046-.705.15-.646.915-.84 1.515-.66.39.12.75.42.976.9 1.034-.676 1.034-.676 1.755-1.125-.27-.42-.404-.601-.586-.78-.63-.705-1.469-1.065-2.834-1.034l-.705.089c-.676.165-1.32.525-1.71 1.005-1.14 1.291-.811 3.541.569 4.471 1.365 1.02 3.361 1.244 3.616 2.205.24 1.17-.87 1.545-1.966 1.41-.811-.18-1.26-.586-1.755-1.336l-1.83 1.051c.21.48.45.689.81 1.109 1.74 1.756 6.09 1.666 6.871-1.004.029-.09.24-.705.074-1.65l.046.067zm-8.983-7.245h-2.248c0 1.938-.009 3.864-.009 5.805 0 1.232.063 2.363-.138 2.711-.33.689-1.18.601-1.566.48-.396-.196-.597-.466-.83-.855-.063-.105-.11-.196-.127-.196l-1.825 1.125c.305.63.75 1.172 1.324 1.517.855.51 2.004.675 3.207.405.783-.226 1.458-.691 1.811-1.411.51-.93.402-2.07.397-3.346.012-2.054 0-4.109 0-6.179l.004-.056z"/>
                  </svg>
                  <span>JavaScript</span>
                </div>
                
                <div className="tech-item">
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0H1.125zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 0 0-.623.242c-.17.104-.3.229-.393.374a.888.888 0 0 0-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 0 1-1.012 1.085 4.38 4.38 0 0 1-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 0 1-1.84-.164 5.544 5.544 0 0 1-1.512-.493v-2.63a5.033 5.033 0 0 0 3.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 0 0-.074-1.089 2.12 2.12 0 0 0-.537-.5 5.597 5.597 0 0 0-.807-.444 27.72 27.72 0 0 0-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 0 1 1.47-.629 7.536 7.536 0 0 1 1.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z"/>
                  </svg>
                  <span>TypeScript</span>
                </div>
                
                <div className="tech-item">
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14.23 12.004a2.236 2.236 0 0 1-2.235 2.236 2.236 2.236 0 0 1-2.236-2.236 2.236 2.236 0 0 1 2.235-2.236 2.236 2.236 0 0 1 2.236 2.236zm2.648-10.69c-1.346 0-3.107.96-4.888 2.622-1.78-1.653-3.542-2.602-4.887-2.602-.41 0-.783.093-1.106.278-1.375.793-1.683 3.264-.973 6.365C1.98 8.917 0 10.42 0 12.004c0 1.59 1.99 3.097 5.043 4.03-.704 3.113-.39 5.588.988 6.38.32.187.69.275 1.102.275 1.345 0 3.107-.96 4.888-2.624 1.78 1.654 3.542 2.603 4.887 2.603.41 0 .783-.09 1.106-.275 1.374-.792 1.683-3.263.973-6.365C22.02 15.096 24 13.59 24 12.004c0-1.59-1.99-3.097-5.043-4.032.704-3.11.39-5.587-.988-6.38-.318-.184-.688-.277-1.092-.278zm-.005 1.09v.006c.225 0 .406.044.558.127.666.382.955 1.835.73 3.704-.054.46-.142.945-.25 1.44-.96-.236-2.006-.417-3.107-.534-.66-.905-1.345-1.727-2.035-2.447 1.592-1.48 3.087-2.292 4.105-2.295zm-9.77.02c1.012 0 2.514.808 4.11 2.28-.686.72-1.37 1.537-2.02 2.442-1.107.117-2.154.298-3.113.538-.112-.49-.195-.964-.254-1.42-.23-1.868.054-3.32.714-3.707.19-.09.4-.127.563-.132zm4.882 3.05c.455.468.91.992 1.36 1.564-.44-.02-.89-.034-1.345-.034-.46 0-.915.01-1.36.034.44-.572.895-1.096 1.345-1.565zM12 8.1c.74 0 1.477.034 2.202.093.406.582.802 1.203 1.183 1.86.372.64.71 1.29 1.018 1.946-.308.655-.646 1.31-1.013 1.95-.38.66-.773 1.288-1.18 1.87a25.64 25.64 0 0 1-4.412.005 26.64 26.64 0 0 1-1.183-1.86c-.372-.64-.71-1.29-1.018-1.946.303-.657.646-1.313 1.013-1.954.38-.66.773-1.286 1.18-1.866A25.327 25.327 0 0 1 12 8.1zm-2.133-2.754c.382.637.785 1.418 1.214 2.319-.526.063-1.022.152-1.478.268-.13-.504-.24-.986-.32-1.445-.145-.859-.070-1.614.584-1.142zm2.14 14.752c-.983 0-2.48-.807-4.078-2.28.687-.72 1.37-1.537 2.02-2.442 1.107-.118 2.154-.3 3.113-.54.112.49.195.964.254 1.42.23 1.868-.054 3.32-.714 3.708-.15.084-.33.127-.595.134zm9.73-2.747c.702.177 1.305.382 1.774.617.94.476 1.425 1.060 1.425 1.704 0 .653-.49 1.243-1.425 1.719-.469.235-1.072.44-1.774.617-.703-3.113-.392-5.587.973-6.38-.32-.187-.69-.275-1.102-.275-1.345 0-3.107.96-4.888 2.624-1.78-1.654-3.542-2.603-4.887-2.603-.41 0-.783.09-1.106.275-1.374.792-1.683 3.263-.973 6.365C1.98 15.096 0 13.59 0 12.004c0-1.59 1.99-3.097 5.043-4.032-.704-3.11-.39-5.587.988-6.38.318-.184.688-.277 1.092-.278 1.346 0 3.107.96 4.888 2.622 1.78-1.653 3.542-2.602 4.887-2.602.41 0 .783.093 1.106.278 1.375.793 1.683 3.264.973 6.365z"/>
                  </svg>
                  <span>React</span>
                </div>
                
                <div className="tech-item">
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.998,24c-0.321,0-0.641-0.084-0.922-0.247l-2.936-1.737c-0.438-0.245-0.224-0.332-0.08-0.383 c0.585-0.203,0.703-0.25,1.328-0.604c0.065-0.037,0.151-0.023,0.218,0.017l2.256,1.339c0.082,0.045,0.197,0.045,0.272,0l8.795-5.076 c0.082-0.047,0.134-0.141,0.134-0.238V6.921c0-0.099-0.053-0.192-0.137-0.242l-8.791-5.072c-0.081-0.047-0.189-0.047-0.271,0 L3.075,6.68C2.99,6.729,2.936,6.825,2.936,6.921v10.15c0,0.097,0.054,0.189,0.139,0.235l2.409,1.392 c1.307,0.654,2.108-0.116,2.108-0.89V7.787c0-0.142,0.114-0.253,0.256-0.253h1.115c0.139,0,0.255,0.112,0.255,0.253v10.021 c0,1.745-0.95,2.745-2.604,2.745c-0.508,0-0.909,0-2.026-0.551L2.28,18.675c-0.57-0.329-0.922-0.945-0.922-1.604V6.921 c0-0.659,0.353-1.275,0.922-1.603l8.795-5.082c0.557-0.315,1.296-0.315,1.848,0l8.794,5.082c0.570,0.329,0.924,0.944,0.924,1.603 v10.15c0,0.659-0.354,1.273-0.924,1.604l-8.794,5.078C12.643,23.916,12.324,24,11.998,24z M19.099,13.993 c0-1.9-1.284-2.406-3.987-2.763c-2.731-0.361-3.009-0.548-3.009-1.187c0-0.528,0.235-1.233,2.258-1.233 c1.807,0,2.473,0.389,2.747,1.607c0.024,0.115,0.129,0.199,0.247,0.199h1.141c0.071,0,0.138-0.031,0.186-0.081 c0.048-0.054,0.074-0.123,0.067-0.196c-0.177-2.098-1.571-3.076-4.388-3.076c-2.508,0-4.004,1.058-4.004,2.833 c0,1.925,1.488,2.457,3.895,2.695c2.88,0.282,3.103,0.703,3.103,1.269c0,0.983-0.789,1.402-2.642,1.402 c-2.327,0-2.839-0.584-3.011-1.742c-0.02-0.124-0.126-0.215-0.253-0.215h-1.137c-0.141,0-0.254,0.112-0.254,0.253 c0,1.482,0.806,3.248,4.655,3.248C17.501,17.007,19.099,15.91,19.099,13.993z"/>
                  </svg>
                  <span>Node.js</span>
                </div>
                
                <div className="tech-item">
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14.25.18l.9.2.73.26.59.3.45.32.34.34.25.34.16.33.1.3.04.26.02.2-.01.13V8.5l-.05-.63-.13-.26-.26-.32-.45-.32-.59-.3-.73-.26-.9-.2-.9.2-.73.26-.59.3-.45.32-.34.34-.25.34-.16.33-.1.3-.04.26-.02.2.01.13v6.17l.05.63.13.26.26.32.45.32.59.3.73.26.9.2.9-.2.73-.26.59-.3.45-.32.34-.34.25-.34.16-.33.1-.3.04-.26.02-.2-.01-.13V9.25l-.05.63-.13.26-.26.32-.45.32-.59.3-.73.26-.9.2-.9-.2-.73-.26-.59-.3-.45-.32-.34-.34-.25-.34-.16-.33-.1-.3-.04-.26-.02-.2.01-.13V2.92l.05-.63.13-.26.26-.32.45-.32.59-.3.73-.26.9-.2z"/>
                  </svg>
                  <span>Python</span>
                </div>
                
                {/* Automation Tools */}
                <div className="tech-item">
                  <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center text-white font-bold text-sm">
                    n8n
                  </div>
                  <span>n8n</span>
                </div>
                
                <div className="tech-item">
                  <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-xs">
                    LG
                  </div>
                  <span>LangGraph</span>
                </div>
                
                <div className="tech-item">
                  <div className="w-8 h-8 bg-green-600 rounded flex items-center justify-center text-white font-bold text-xs">
                    LC
                  </div>
                  <span>LangChain</span>
                </div>
                
                <div className="tech-item">
                  <div className="w-8 h-8 bg-orange-600 rounded flex items-center justify-center text-white font-bold text-xs">
                    Z
                  </div>
                  <span>Zapier</span>
                </div>
                
                <div className="tech-item">
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M13.983 11.078h2.119a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.119a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185m-2.954-5.43h2.118a.186.186 0 00.186-.186V3.574a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.186m0 2.716h2.118a.187.187 0 00.186-.186V6.29a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.887c0 .102.082.185.185.186m-2.93 0h2.12a.186.186 0 00.184-.186V6.29a.185.185 0 00-.185-.185H8.1a.185.185 0 00-.185.185v1.887c0 .102.083.185.185.186m-2.964 0h2.119a.186.186 0 00.185-.186V6.29a.185.185 0 00-.185-.185H5.136a.186.186 0 00-.186.185v1.887c0 .102.084.185.186.186m5.893 2.715h2.118a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m-2.93 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186H8.1a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185m-2.964 0h2.119a.185.185 0 00.185-.185V9.006a.185.185 0 00-.184-.186H5.136a.186.186 0 00-.186.186v1.887c0 .102.084.185.186.185m2.964 2.715h2.12a.185.185 0 00.184-.185v-1.888a.185.185 0 00-.184-.185H8.1a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185m-2.964 0h2.119a.185.185 0 00.185-.185v-1.888a.185.185 0 00-.184-.185H5.136a.186.186 0 00-.186.185v1.888c0 .102.084.185.186.185M0 0h24v24H0z"/>
                  </svg>
                  <span>Docker</span>
                </div>
                
                <div className="tech-item">
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 .5a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.6-4-1.6-.5-1.4-1.3-1.8-1.3-1.8-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-6 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17.3 4.7 18.3 5 18.3 5c.6 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .5z"/>
                  </svg>
                  <span>Git</span>
                </div>
                
                {/* Duplicate items for continuous scroll */}
                <div className="tech-item">
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 18.178l4.62-1.256.623-6.778H9.026L8.822 7.89h8.626l.227-2.211H6.325l.636 6.678h7.82l-.261 2.866-2.52.667-2.52-.667-.162-1.844h-2.27l.329 3.544L12 18.178z"/>
                  </svg>
                  <span>HTML5</span>
                </div>
                
                <div className="tech-item">
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M1.5 0h21l-1.91 21.563L11.977 24l-8.565-2.438L1.5 0zm17.09 4.413L5.41 4.413l.213 2.622h10.125l-.255 2.716h-6.64l.24 2.573h6.182l-.366 3.523-2.91.804-2.956-.81-.188-2.11h-2.61l.29 3.855L12 19.288l5.373-1.53L18.59 4.414z"/>
                  </svg>
                  <span>CSS3</span>
                </div>
                
                <div className="tech-item">
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M0 0h24v24H0V0zm22.034 18.276c-.175-1.095-.888-2.015-3.003-2.873-.736-.345-1.554-.585-1.797-1.14-.091-.33-.105-.51-.046-.705.15-.646.915-.84 1.515-.66.39.12.75.42.976.9 1.034-.676 1.034-.676 1.755-1.125-.27-.42-.404-.601-.586-.78-.63-.705-1.469-1.065-2.834-1.034l-.705.089c-.676.165-1.32.525-1.71 1.005-1.14 1.291-.811 3.541.569 4.471 1.365 1.02 3.361 1.244 3.616 2.205.24 1.17-.87 1.545-1.966 1.41-.811-.18-1.26-.586-1.755-1.336l-1.83 1.051c.21.48.45.689.81 1.109 1.74 1.756 6.09 1.666 6.871-1.004.029-.09.24-.705.074-1.65l.046.067zm-8.983-7.245h-2.248c0 1.938-.009 3.864-.009 5.805 0 1.232.063 2.363-.138 2.711-.33.689-1.18.601-1.566.48-.396-.196-.597-.466-.83-.855-.063-.105-.11-.196-.127-.196l-1.825 1.125c.305.63.75 1.172 1.324 1.517.855.51 2.004.675 3.207.405.783-.226 1.458-.691 1.811-1.411.51-.93.402-2.07.397-3.346.012-2.054 0-4.109 0-6.179l.004-.056z"/>
                  </svg>
                  <span>JavaScript</span>
                </div>
                
                <div className="tech-item">
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14.23 12.004a2.236 2.236 0 0 1-2.235 2.236 2.236 2.236 0 0 1-2.236-2.236 2.236 2.236 0 0 1 2.235-2.236 2.236 2.236 0 0 1 2.236 2.236zm2.648-10.69c-1.346 0-3.107.96-4.888 2.622-1.78-1.653-3.542-2.602-4.887-2.602-.41 0-.783.093-1.106.278-1.375.793-1.683 3.264-.973 6.365C1.98 8.917 0 10.42 0 12.004c0 1.59 1.99 3.097 5.043 4.03-.704 3.113-.39 5.588.988 6.38.32.187.69.275 1.102.275 1.345 0 3.107-.96 4.888-2.624 1.78 1.654 3.542 2.603 4.887 2.603.41 0 .783-.09 1.106-.275 1.374-.792 1.683-3.263.973-6.365C22.02 15.096 24 13.59 24 12.004c0-1.59-1.99-3.097-5.043-4.032.704-3.11.39-5.587-.988-6.38-.318-.184-.688-.277-1.092-.278zm-.005 1.09v.006c.225 0 .406.044.558.127.666.382.955 1.835.73 3.704-.054.46-.142.945-.25 1.44-.96-.236-2.006-.417-3.107-.534-.66-.905-1.345-1.727-2.035-2.447 1.592-1.48 3.087-2.292 4.105-2.295zm-9.77.02c1.012 0 2.514.808 4.11 2.28-.686.72-1.37 1.537-2.02 2.442-1.107.117-2.154.298-3.113.538-.112-.49-.195-.964-.254-1.42-.23-1.868.054-3.32.714-3.707.19-.09.4-.127.563-.132zm4.882 3.05c.455.468.91.992 1.36 1.564-.44-.02-.89-.034-1.345-.034-.46 0-.915.01-1.36.034.44-.572.895-1.096 1.345-1.565zM12 8.1c.74 0 1.477.034 2.202.093.406.582.802 1.203 1.183 1.86.372.64.71 1.29 1.018 1.946-.308.655-.646 1.31-1.013 1.95-.38.66-.773 1.288-1.18 1.87a25.64 25.64 0 0 1-4.412.005 26.64 26.64 0 0 1-1.183-1.86c-.372-.64-.71-1.29-1.018-1.946.303-.657.646-1.313 1.013-1.954.38-.66.773-1.286 1.18-1.866A25.327 25.327 0 0 1 12 8.1zm-2.133-2.754c.382.637.785 1.418 1.214 2.319-.526.063-1.022.152-1.478.268-.13-.504-.24-.986-.32-1.445-.145-.859-.070-1.614.584-1.142zm2.14 14.752c-.983 0-2.48-.807-4.078-2.28.687-.72 1.37-1.537 2.02-2.442 1.107-.118 2.154-.3 3.113-.54.112.49.195.964.254 1.42.23 1.868-.054 3.32-.714 3.708-.15.084-.33.127-.595.134zm9.73-2.747c.702.177 1.305.382 1.774.617.94.476 1.425 1.060 1.425 1.704 0 .653-.49 1.243-1.425 1.719-.469.235-1.072.44-1.774.617-.703-3.113-.392-5.587.973-6.38-.32-.187-.69-.275-1.102-.275-1.345 0-3.107.96-4.888 2.624-1.78-1.654-3.542-2.603-4.887-2.603-.41 0-.783.09-1.106.275-1.374.792-1.683 3.263-.973 6.365C1.98 15.096 0 13.59 0 12.004c0-1.59 1.99-3.097 5.043-4.032-.704-3.11-.39-5.587.988-6.38.318-.184.688-.277 1.092-.278 1.346 0 3.107.96 4.888 2.622 1.78-1.653 3.542-2.602 4.887-2.602.41 0 .783.093 1.106.278 1.375.793 1.683 3.264.973 6.365z"/>
                  </svg>
                  <span>React</span>
                </div>
              </div>
            </div>
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