import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useLanguage } from "@/contexts/LanguageContext";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Heart } from "lucide-react";

export default function Auth() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSignUp, setIsSignUp] = useState(true);
  const [showConsent, setShowConsent] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dataSharing, setDataSharing] = useState(false);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignUp) {
      setShowConsent(true);
    } else {
      // Simulate login
      toast({
        title: t('checkin.success'),
      });
      navigate('/dashboard');
    }
  };

  const handleConsent = () => {
    // Simulate account creation
    toast({
      title: t('checkin.success'),
    });
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-subtle p-4">
      <Card className="w-full max-w-md shadow-card">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-2">
            <div className="w-16 h-16 rounded-full bg-gradient-calm flex items-center justify-center">
              <Heart className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl">{isSignUp ? t('auth.signup') : t('auth.signin')}</CardTitle>
          <CardDescription>
            {isSignUp ? t('auth.noAccount') : t('auth.haveAccount')}
            <Button
              variant="link"
              className="p-0 ml-2"
              onClick={() => setIsSignUp(!isSignUp)}
            >
              {isSignUp ? t('auth.signin') : t('auth.signup')}
            </Button>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAuth} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t('auth.email')}</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t('auth.password')}</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">{t('auth.confirmPassword')}</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  required
                />
              </div>
            )}
            <Button type="submit" className="w-full bg-gradient-calm hover:opacity-90">
              {isSignUp ? t('auth.signup') : t('auth.signin')}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Dialog open={showConsent} onOpenChange={setShowConsent}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{t('auth.consent.title')}</DialogTitle>
            <DialogDescription className="text-base">
              {t('auth.consent.description')}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  </div>
                  <p className="text-sm">{t(`auth.consent.point${i}`)}</p>
                </div>
              ))}
            </div>
            
            <div className="flex items-start gap-3 p-4 border border-border rounded-lg">
              <Checkbox
                id="dataSharing"
                checked={dataSharing}
                onCheckedChange={(checked) => setDataSharing(checked as boolean)}
              />
              <label htmlFor="dataSharing" className="text-sm cursor-pointer">
                {t('auth.consent.optional')}
              </label>
            </div>

            <div className="p-4 bg-warning/10 border border-warning/30 rounded-lg">
              <p className="text-sm font-medium text-warning-foreground">
                ⚠️ {t('auth.consent.disclaimer')}
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowConsent(false)}
              >
                {t('auth.consent.decline')}
              </Button>
              <Button
                className="flex-1 bg-gradient-calm hover:opacity-90"
                onClick={handleConsent}
              >
                {t('auth.consent.accept')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
