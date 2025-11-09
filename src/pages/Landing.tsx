import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { Shield, MessageCircle, TrendingUp, Globe } from "lucide-react";
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
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-subtle" />
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
        </div>
        
        <div className="container relative mx-auto px-4 py-20 md:py-32">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-calm bg-clip-text text-transparent">
              {t('landing.title')}
            </h1>
            <p className="text-2xl md:text-3xl text-muted-foreground font-medium">
              {t('landing.subtitle')}
            </p>
            <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
              {t('landing.description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" asChild className="bg-gradient-calm hover:opacity-90 text-lg px-8">
                <Link to="/auth">{t('landing.getStarted')}</Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8">
                {t('landing.learnMore')}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            {t('landing.features.title')}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="shadow-card hover:shadow-lg transition-all duration-300 border-border/50">
                <CardContent className="pt-6 space-y-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-calm flex items-center justify-center">
                    <feature.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <h3 className="font-semibold text-lg">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-subtle">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">
              {t('landing.getStarted')}
            </h2>
            <p className="text-lg text-muted-foreground">
              {t('auth.consent.disclaimer')}
            </p>
            <Button size="lg" asChild className="bg-gradient-calm hover:opacity-90 text-lg px-8">
              <Link to="/auth">{t('auth.signup')}</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
