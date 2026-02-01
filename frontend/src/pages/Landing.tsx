import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { Shield, MessageCircle, TrendingUp, Globe, Heart, Brain, Sparkles, Zap, Users, Star } from "lucide-react";
import { Link } from "react-router-dom";

export default function Landing() {
  const { t } = useLanguage();

  const features = [
    {
      icon: Shield,
      title: t('landing.features.private'),
      description: t('landing.features.private.desc'),
    },
    {
      icon: MessageCircle,
      title: t('landing.features.multimodal'),
      description: t('landing.features.multimodal.desc'),
    },
    {
      icon: TrendingUp,
      title: t('landing.features.insights'),
      description: t('landing.features.insights.desc'),
    },
    {
      icon: Globe,
      title: t('landing.features.bilingual'),
      description: t('landing.features.bilingual.desc'),
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Enhanced Hero Banner */}
      <section className="relative overflow-hidden min-h-[90vh] flex items-center">
        {/* Animated Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-teal-50 via-blue-100 to-purple-100 dark:from-gray-900 dark:via-teal-950 dark:to-blue-950" />
        
        {/* Animated Blobs */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-teal-400 to-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
          <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-gradient-to-r from-blue-400 to-teal-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000" />
        </div>

        {/* Floating Icons */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <Heart className="absolute top-20 left-10 w-8 h-8 text-teal-400 opacity-20 animate-float" />
          <Brain className="absolute top-40 right-20 w-10 h-10 text-purple-400 opacity-20 animate-float animation-delay-1000" />
          <Sparkles className="absolute bottom-32 left-20 w-6 h-6 text-blue-400 opacity-20 animate-float animation-delay-2000" />
          <Star className="absolute top-1/2 right-10 w-7 h-7 text-pink-400 opacity-20 animate-float animation-delay-3000" />
          <Zap className="absolute bottom-20 right-1/3 w-8 h-8 text-yellow-400 opacity-20 animate-float animation-delay-1500" />
          <Users className="absolute top-1/3 left-1/3 w-9 h-9 text-teal-400 opacity-20 animate-float animation-delay-2500" />
        </div>
        
        {/* Main Content */}
        <div className="container relative mx-auto px-4 py-20">
          <div className="max-w-5xl mx-auto text-center space-y-10">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-lg border border-teal-200 dark:border-teal-800 animate-fade-in-down">
              <Sparkles className="w-5 h-5 text-teal-600 animate-pulse" />
              <span className="text-sm font-semibold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                AI-Powered Mental Wellness Platform
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold animate-fade-in-up">
              <span className="bg-gradient-to-r from-teal-600 via-blue-600 to-purple-600 dark:from-teal-400 dark:via-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                {t('landing.title')}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-2xl md:text-3xl lg:text-4xl font-medium text-gray-700 dark:text-gray-300 animate-fade-in-up animation-delay-200">
              {t('landing.subtitle')}
            </p>

            {/* Description */}
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed animate-fade-in-up animation-delay-400">
              {t('landing.description')}
            </p>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto pt-6 animate-fade-in-up animation-delay-600">
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:scale-105 transition-transform">
                <div className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">24/7</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Available</div>
              </div>
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:scale-105 transition-transform">
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">AI</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Powered</div>
              </div>
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:scale-105 transition-transform">
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">100%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Private</div>
              </div>
            </div>


            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-8 pt-12 text-gray-600 dark:text-gray-400 text-sm animate-fade-in-up animation-delay-1000">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-teal-600" />
                <span>Secure & Encrypted</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-600" />
                <span>Bilingual Support</span>
              </div>
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-purple-600" />
                <span>AI Analysis</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative overflow-hidden">
        {/* Background decoration - consistent with other sections */}
        <div className="absolute inset-0 bg-gradient-to-br from-teal-50 via-blue-50 to-purple-50 dark:from-teal-950/30 dark:via-blue-950/30 dark:to-purple-950/30" />
        <div className="absolute top-1/2 left-10 w-64 h-64 bg-gradient-to-r from-teal-400/20 to-blue-500/20 rounded-full blur-3xl animate-blob" />
        <div className="absolute top-1/3 right-10 w-80 h-80 bg-gradient-to-r from-purple-400/20 to-pink-500/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16 space-y-4 animate-fade-in-down">
            <div className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
              ✨ Core Features
            </div>
            <h2 className="text-4xl md:text-5xl font-bold gradient-text">
              {t('landing.features.title')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need for comprehensive mental wellness support
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="shadow-card card-hover border-border/50 relative overflow-hidden group animate-scale-in bg-gradient-to-br from-card to-muted/30"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-accent/0 group-hover:from-primary/5 group-hover:to-accent/5 transition-all duration-500" />
                
                <CardContent className="pt-8 pb-6 space-y-4 relative z-10">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="h-7 w-7 text-primary-foreground" />
                  </div>
                  <h3 className="font-bold text-xl group-hover:text-primary transition-colors">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-teal-50 via-blue-50 to-purple-50 dark:from-teal-950/30 dark:via-blue-950/30 dark:to-purple-950/30" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-teal-400/20 to-blue-500/20 rounded-full blur-3xl animate-blob" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-500/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-3xl mx-auto space-y-8 animate-scale-in">
            {/* Icon */}
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-teal-500 to-blue-500 shadow-2xl animate-bounce-subtle">
              <Heart className="w-10 h-10 text-white" />
            </div>
            
            {/* Heading */}
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold">
              <span className="bg-gradient-to-r from-teal-600 via-blue-600 to-purple-600 dark:from-teal-400 dark:via-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                {t('landing.getStarted')}
              </span>
            </h2>
            
            {/* Disclaimer with icon */}
            <div className="flex items-start gap-3 p-6 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-lg max-w-2xl mx-auto">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-warning/20 flex items-center justify-center mt-0.5">
                <span className="text-warning text-sm">ℹ️</span>
              </div>
              <p className="text-base text-gray-600 dark:text-gray-300 text-left leading-relaxed">
                {t('auth.consent.disclaimer')}
              </p>
            </div>
            
            {/* CTA Button */}
            <div className="pt-4">
              <Button 
                size="lg" 
                asChild 
                className="bg-gradient-to-r from-teal-500 via-blue-500 to-purple-500 hover:from-teal-600 hover:via-blue-600 hover:to-purple-600 text-white text-xl px-12 py-7 shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 rounded-full"
              >
                <Link to="/auth" className="flex items-center gap-3">
                  <Sparkles className="w-6 h-6" />
                  {t('auth.signup')}
                  <span className="text-2xl">→</span>
                </Link>
              </Button>
            </div>
            
            {/* Trust badges */}
            <div className="flex flex-wrap justify-center gap-6 pt-6 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                  <span className="text-green-600 text-xs">✓</span>
                </div>
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <span className="text-blue-600 text-xs">✓</span>
                </div>
                <span>Free forever</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <span className="text-purple-600 text-xs">✓</span>
                </div>
                <span>Setup in 2 minutes</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
