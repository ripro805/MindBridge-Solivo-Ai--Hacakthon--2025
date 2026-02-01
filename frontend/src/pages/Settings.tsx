import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";
import { Download, Trash2, Languages } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const { t, language, setLanguage } = useLanguage();
  const { toast } = useToast();
  const [dataSharing, setDataSharing] = useState(false);

  const handleExportData = () => {
    toast({
      title: "Data exported",
      description: "Your data has been downloaded as JSON",
    });
  };

  const handleDeleteData = () => {
    toast({
      title: "Delete data",
      description: "This action requires confirmation",
      variant: "destructive",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-mesh relative">
      {/* Decorative gradients */}
      <div className="absolute top-20 left-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-blob" />
      <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-blob animation-delay-2000" />
      
      <div className="container max-w-2xl mx-auto px-4 py-8 space-y-6 relative z-10">
      <div className="animate-fade-in-down">
        <h1 className="text-3xl md:text-4xl font-bold gradient-text">{t('settings.title')}</h1>
      </div>

      <Card className="shadow-card card-hover animate-scale-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Languages className="h-5 w-5 text-primary" />
            {t('settings.language')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-teal-50 to-blue-50 dark:from-teal-950 dark:to-blue-950">
            <span className="font-medium">English</span>
            <Switch
              checked={language === 'en'}
              onCheckedChange={(checked) => setLanguage(checked ? 'en' : 'bn')}
            />
          </div>
          <div className="flex items-center justify-between">
            <span>বাংলা (Bangla)</span>
            <Switch
              checked={language === 'bn'}
              onCheckedChange={(checked) => setLanguage(checked ? 'bn' : 'en')}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>{t('settings.privacy')}</CardTitle>
          <CardDescription>Manage your data and privacy preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="dataSharing">{t('settings.dataSharing')}</Label>
              <p className="text-sm text-muted-foreground">{t('settings.dataSharing.desc')}</p>
            </div>
            <Switch
              id="dataSharing"
              checked={dataSharing}
              onCheckedChange={setDataSharing}
            />
          </div>

          <div className="space-y-3 pt-4 border-t">
            <Button
              onClick={handleExportData}
              variant="outline"
              className="w-full justify-start"
            >
              <Download className="mr-2 h-4 w-4" />
              {t('settings.exportData')}
            </Button>

            <Button
              onClick={handleDeleteData}
              variant="destructive"
              className="w-full justify-start hover-scale"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {t('settings.deleteData')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>

    </div>
  );
}
