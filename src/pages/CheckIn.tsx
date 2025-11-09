import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { Mic, Video, Loader2, CheckCircle2 } from "lucide-react";

export default function CheckIn() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [textEntry, setTextEntry] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isVideoRecording, setIsVideoRecording] = useState(false);
  const [onDeviceProcessing, setOnDeviceProcessing] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [transcript, setTranscript] = useState("");

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulated AI response
    const mockResponse = {
      score: Math.floor(Math.random() * 40) + 60, // 60-100
      category: "low",
      reasons: ["Positive sentiment detected", "Consistent mood patterns"],
      suggestions: ["Continue journaling", "Practice mindfulness"]
    };

    setIsSubmitting(false);
    toast({
      title: t('checkin.success'),
      description: `${t('dashboard.currentScore')}: ${mockResponse.score}`,
    });
    
    // Reset form
    setTextEntry("");
    setTranscript("");
  };

  const toggleVoiceRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      // Simulate recording for 2 seconds then add transcript
      setTimeout(() => {
        setIsRecording(false);
        setTranscript("This is a simulated transcript of your voice recording. In a real app, this would be processed by Whisper API.");
      }, 2000);
    }
  };

  const toggleVideoRecording = () => {
    setIsVideoRecording(!isVideoRecording);
    if (!isVideoRecording) {
      setTimeout(() => {
        setIsVideoRecording(false);
        toast({
          title: "Video analyzed on-device",
          description: "No video data was uploaded to servers",
        });
      }, 3000);
    }
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl md:text-4xl font-bold">{t('checkin.title')}</h1>
        <p className="text-muted-foreground text-lg">{t('checkin.subtitle')}</p>
      </div>

      <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
        <div className="flex items-center gap-3">
          <Label htmlFor="ondevice">{t('checkin.ondevice')}</Label>
          <Switch
            id="ondevice"
            checked={onDeviceProcessing}
            onCheckedChange={setOnDeviceProcessing}
          />
        </div>
        <Button size="sm" variant="secondary">
          {t('checkin.quick')}
        </Button>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>{t('checkin.text.title')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder={t('checkin.text.placeholder')}
            value={textEntry}
            onChange={(e) => setTextEntry(e.target.value)}
            rows={6}
            className="resize-none"
          />
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mic className="h-5 w-5" />
            {t('checkin.voice.title')}
          </CardTitle>
          <CardDescription>{t('checkin.voice.subtitle')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={toggleVoiceRecording}
            variant={isRecording ? "destructive" : "outline"}
            className="w-full"
          >
            {isRecording ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('checkin.voice.stop')}
              </>
            ) : (
              <>
                <Mic className="mr-2 h-4 w-4" />
                {t('checkin.voice.start')}
              </>
            )}
          </Button>
          {transcript && (
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm">{transcript}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-card border-accent/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="h-5 w-5" />
            {t('checkin.video.title')}
          </CardTitle>
          <CardDescription>{t('checkin.video.subtitle')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-3 bg-accent/10 border border-accent/30 rounded-lg">
            <p className="text-sm text-accent-foreground">
              🔒 {t('checkin.video.privacy')}
            </p>
          </div>
          <Button
            onClick={toggleVideoRecording}
            variant={isVideoRecording ? "destructive" : "outline"}
            className="w-full"
          >
            {isVideoRecording ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('checkin.video.stop')}
              </>
            ) : (
              <>
                <Video className="mr-2 h-4 w-4" />
                {t('checkin.video.start')}
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <Button
        onClick={handleSubmit}
        disabled={isSubmitting || (!textEntry && !transcript)}
        className="w-full bg-gradient-calm hover:opacity-90 h-12 text-lg"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            {t('checkin.submitting')}
          </>
        ) : (
          <>
            <CheckCircle2 className="mr-2 h-5 w-5" />
            {t('checkin.submit')}
          </>
        )}
      </Button>
    </div>
  );
}
