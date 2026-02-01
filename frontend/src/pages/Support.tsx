import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Wind, Brain, Phone, Calendar, AlertCircle, Loader2 } from "lucide-react";
import { supportAPI } from "@/services/api";

export default function Support() {
  const { t, language } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [helplines, setHelplines] = useState<any[]>([]);

  useEffect(() => {
    loadSupportResources();
  }, [language]);

  const loadSupportResources = async () => {
    setLoading(true);
    try {
      const data = await supportAPI.getAll(null, language);
      setHelplines(data.resources);
    } catch (error) {
      console.error('Failed to load support resources:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-mesh relative">
      {/* Decorative elements */}
      <div className="absolute top-10 right-10 w-80 h-80 bg-green-500/10 rounded-full blur-3xl animate-blob" />
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-blob animation-delay-3000" />
      
      <div className="container max-w-4xl mx-auto px-4 py-8 space-y-6 relative z-10">
      <div className="animate-fade-in-down">
        <h1 className="text-3xl md:text-4xl font-bold gradient-text">{t('support.title')}</h1>
      </div>

      <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950 border border-warning/30 rounded-lg flex items-start gap-3 animate-scale-in shadow-lg">
        <AlertCircle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5 animate-pulse" />
        <p className="text-sm font-medium">{t('support.emergency')}</p>
      </div>

      <div className="animate-fade-in-up animation-delay-200">
        <h2 className="text-2xl font-semibold mb-4">{t('support.immediate')}</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="shadow-card card-hover cursor-pointer group animate-scale-in">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-gradient-calm flex items-center justify-center mb-2 group-hover:scale-110 transition-transform shadow-lg animate-pulse-glow">
                <Wind className="h-6 w-6 text-primary-foreground" />
              </div>
              <CardTitle>{t('support.breathing.title')}</CardTitle>
              <CardDescription>{t('support.breathing.desc')}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                {t('support.breathing.start')}
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-lg transition-all cursor-pointer group">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-gradient-warm flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Brain className="h-6 w-6 text-accent-foreground" />
              </div>
              <CardTitle>{t('support.mindfulness.title')}</CardTitle>
              <CardDescription>{t('support.mindfulness.desc')}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                {t('support.mindfulness.start')}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            {t('support.helplines.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : helplines.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No helplines available</p>
          ) : (
            <div className="space-y-4">
              {helplines.map((helpline: any) => (
                <div key={helpline.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                  <div>
                    <h3 className="font-semibold">{helpline.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {helpline.available247 ? '24/7 Available' : 'Limited hours'}
                    </p>
                    {helpline.description && (
                      <p className="text-sm text-muted-foreground mt-1">{helpline.description}</p>
                    )}
                  </div>
                  <Button asChild variant="secondary">
                    <a href={`tel:${helpline.phone}`} className="font-mono">
                      {helpline.phone}
                    </a>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-card border-accent/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {t('support.teleconsult')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button className="w-full bg-gradient-warm hover:opacity-90">
            {t('support.teleconsult')}
          </Button>
        </CardContent>
      </Card>
    </div>
    </div>
  );
}
