import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Wind, Brain, Phone, Calendar, AlertCircle } from "lucide-react";

export default function Support() {
  const { t } = useLanguage();

  const helplines = [
    { name: t('support.helplines.national'), number: '16263', available: '24/7' },
    { name: t('support.helplines.kaan'), number: '01779-554391', available: '10 AM - 6 PM' },
    { name: t('support.helplines.shuni'), number: '09678-222666', available: '24/7' },
  ];

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold">{t('support.title')}</h1>
      </div>

      <div className="p-4 bg-warning/10 border border-warning/30 rounded-lg flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
        <p className="text-sm">{t('support.emergency')}</p>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">{t('support.immediate')}</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="shadow-card hover:shadow-lg transition-all cursor-pointer group">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-gradient-calm flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
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
          <div className="space-y-4">
            {helplines.map((helpline, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                <div>
                  <h3 className="font-semibold">{helpline.name}</h3>
                  <p className="text-sm text-muted-foreground">{helpline.available}</p>
                </div>
                <Button asChild variant="secondary">
                  <a href={`tel:${helpline.number}`} className="font-mono">
                    {helpline.number}
                  </a>
                </Button>
              </div>
            ))}
          </div>
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
  );
}
