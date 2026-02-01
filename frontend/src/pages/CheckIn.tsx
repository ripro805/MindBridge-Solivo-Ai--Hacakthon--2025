import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { Mic, Video, Loader2, CheckCircle2, X } from "lucide-react";
import { checkInAPI } from "@/services/api";

export default function CheckIn() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [textEntry, setTextEntry] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isVideoRecording, setIsVideoRecording] = useState(false);
  const [onDeviceProcessing, setOnDeviceProcessing] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [recordingTime, setRecordingTime] = useState(0);
  const [videoRecordingTime, setVideoRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const videoRecorderRef = useRef<MediaRecorder | null>(null);
  const videoStreamRef = useRef<MediaStream | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);
  const videoPreviewRef = useRef<HTMLVideoElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const videoTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      stopAllRecordings();
    };
  }, []);

  const stopAllRecordings = () => {
    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach(track => track.stop());
    }
    if (videoStreamRef.current) {
      videoStreamRef.current.getTracks().forEach(track => track.stop());
    }
    if (timerRef.current) clearInterval(timerRef.current);
    if (videoTimerRef.current) clearInterval(videoTimerRef.current);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Convert audio blob to base64 or send as text transcript
      let voiceData = transcript || null;
      
      const response = await checkInAPI.create(
        textEntry ? 'text' : (audioBlob ? 'voice' : 'video'),
        textEntry || null,
        voiceData
      );
      
      if (response && response.analysis) {
        toast({
          title: t('checkin.success'),
          description: `Mood Score: ${response.analysis.moodScore}/10 - ${response.analysis.sentiment}`,
        });
      } else {
        toast({
          title: t('checkin.success'),
          description: "Check-in recorded successfully!",
        });
      }
      
      // Reset form
      setTextEntry("");
      setTranscript("");
      setAudioBlob(null);
      setVideoBlob(null);
      setRecordingTime(0);
      setVideoRecordingTime(0);
    } catch (error: any) {
      toast({
        title: "Check-in failed",
        description: error.message || "Could not record check-in",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleVoiceRecording = async () => {
    if (isRecording) {
      // Stop recording
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
      if (audioStreamRef.current) {
        audioStreamRef.current.getTracks().forEach(track => track.stop());
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      setIsRecording(false);
    } else {
      // Start recording
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioStreamRef.current = stream;
        
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        const chunks: BlobPart[] = [];
        
        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            chunks.push(e.data);
          }
        };
        
        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: 'audio/webm' });
          setAudioBlob(blob);
          // Transcription will happen during analysis
          setTranscript(`[Voice recording captured - ${recordingTime}s. Analysis will include emotional tone and content.]`);
        };
        
        mediaRecorder.start();
        setIsRecording(true);
        setRecordingTime(0);
        
        timerRef.current = setInterval(() => {
          setRecordingTime(prev => prev + 1);
        }, 1000);
        
        toast({
          title: "Recording started",
          description: "Speak clearly into your microphone"
        });
      } catch (error) {
        console.error('Error accessing microphone:', error);
        toast({
          title: "Microphone access denied",
          description: "Please allow microphone access to record audio",
          variant: "destructive"
        });
      }
    }
  };

  const toggleVideoRecording = async () => {
    if (isVideoRecording) {
      // Stop recording
      if (videoRecorderRef.current && videoRecorderRef.current.state === 'recording') {
        videoRecorderRef.current.stop();
      }
      if (videoStreamRef.current) {
        videoStreamRef.current.getTracks().forEach(track => track.stop());
      }
      if (videoTimerRef.current) {
        clearInterval(videoTimerRef.current);
      }
      if (videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = null;
      }
      setIsVideoRecording(false);
    } else {
      // Start recording
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: true, 
          audio: true 
        });
        videoStreamRef.current = stream;
        
        if (videoPreviewRef.current) {
          videoPreviewRef.current.srcObject = stream;
          videoPreviewRef.current.play();
        }
        
        const mediaRecorder = new MediaRecorder(stream);
        videoRecorderRef.current = mediaRecorder;
        const chunks: BlobPart[] = [];
        
        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            chunks.push(e.data);
          }
        };
        
        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: 'video/webm' });
          setVideoBlob(blob);
          toast({
            title: "Video recorded",
            description: `Recorded ${videoRecordingTime}s of video`,
          });
        };
        
        mediaRecorder.start();
        setIsVideoRecording(true);
        setVideoRecordingTime(0);
        
        videoTimerRef.current = setInterval(() => {
          setVideoRecordingTime(prev => prev + 1);
        }, 1000);
        
        toast({
          title: "Video recording started",
          description: "Recording video and audio..."
        });
      } catch (error) {
        console.error('Error accessing camera:', error);
        toast({
          title: "Camera access denied",
          description: "Please allow camera and microphone access",
          variant: "destructive"
        });
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-mesh relative">
      {/* Decorative gradient orbs */}
      <div className="absolute top-10 left-10 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl animate-blob" />
      <div className="absolute top-40 right-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-blob animation-delay-2000" />
      <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-blob animation-delay-4000" />
      
      <div className="container max-w-4xl mx-auto px-4 py-8 space-y-6 relative z-10">
      <div className="space-y-2 text-center animate-fade-in-down">
        <h1 className="text-3xl md:text-4xl font-bold gradient-text">{t('checkin.title')}</h1>
        <p className="text-muted-foreground text-lg">{t('checkin.subtitle')}</p>
      </div>

      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-teal-50 to-blue-50 dark:from-teal-950 dark:to-blue-950 rounded-lg shadow-md hover-lift animate-fade-in-up animation-delay-200">
        <div className="flex items-center gap-3">
          <Label htmlFor="ondevice" className="font-semibold">{t('checkin.ondevice')}</Label>
          <Switch
            id="ondevice"
            checked={onDeviceProcessing}
            onCheckedChange={setOnDeviceProcessing}
            className="data-[state=checked]:bg-primary"
          />
        </div>
        <Button size="sm" variant="secondary" className="hover-scale">
          {t('checkin.quick')}
        </Button>
      </div>

      <Card className="shadow-card card-hover animate-scale-in animation-delay-400">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            {t('checkin.text.title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder={t('checkin.text.placeholder')}
            value={textEntry}
            onChange={(e) => setTextEntry(e.target.value)}
            rows={6}
            className="resize-none transition-all focus:ring-2 focus:ring-primary/50 focus:scale-[1.01]"
          />
        </CardContent>
      </Card>

      <Card className="shadow-card card-hover animate-scale-in animation-delay-600">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mic className="h-5 w-5 text-primary animate-pulse" />
            {t('checkin.voice.title')}
          </CardTitle>
          <CardDescription>{t('checkin.voice.subtitle')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={toggleVoiceRecording}
            variant={isRecording ? "destructive" : "outline"}
            className="w-full hover-scale transition-all"
          >
            {isRecording ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('checkin.voice.stop')} ({formatTime(recordingTime)})
              </>
            ) : (
              <>
                <Mic className="mr-2 h-4 w-4" />
                {t('checkin.voice.start')}
              </>
            )}
          </Button>
          {audioBlob && !isRecording && (
            <div className="p-4 bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-950 dark:to-teal-950 rounded-lg space-y-2 animate-scale-in border border-green-200 dark:border-green-800">
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  Audio recorded: {formatTime(recordingTime)}
                </p>
                <Button
                  size="sm"
                  variant="ghost"
                  className="hover-scale"
                  onClick={() => {
                    setAudioBlob(null);
                    setTranscript("");
                    setRecordingTime(0);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <audio controls className="w-full" src={URL.createObjectURL(audioBlob)} />
            </div>
          )}
          {transcript && (
            <div className="p-4 bg-muted rounded-lg animate-fade-in-up">
              <p className="text-sm font-medium mb-2 flex items-center gap-2">
                <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                Transcript:
              </p>
              <p className="text-sm">{transcript}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-card card-hover animate-scale-in animation-delay-800 border-accent/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="h-5 w-5 text-accent animate-pulse" />
            {t('checkin.video.title')}
          </CardTitle>
          <CardDescription>{t('checkin.video.subtitle')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-3 bg-accent/10 border border-accent/30 rounded-lg hover-lift">
            <p className="text-sm text-accent-foreground">
              🔒 {t('checkin.video.privacy')}
            </p>
          </div>
          
          {isVideoRecording && (
            <div className="relative rounded-lg overflow-hidden bg-black animate-scale-in">
              <video
                ref={videoPreviewRef}
                className="w-full h-64 object-cover"
                muted
              />
              <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium animate-pulse-glow">
                ● REC {formatTime(videoRecordingTime)}
              </div>
            </div>
          )}
          
          {videoBlob && !isVideoRecording && (
            <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 rounded-lg space-y-2 animate-scale-in border border-purple-200 dark:border-purple-800">
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-600" />
                  Video recorded: {formatTime(videoRecordingTime)}
                </p>
                <Button
                  size="sm"
                  variant="ghost"
                  className="hover-scale"
                  onClick={() => {
                    setVideoBlob(null);
                    setVideoRecordingTime(0);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <video controls className="w-full rounded" src={URL.createObjectURL(videoBlob)} />
            </div>
          )}
          
          <Button
            onClick={toggleVideoRecording}
            variant={isVideoRecording ? "destructive" : "outline"}
            className="w-full hover-scale transition-all"
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
        disabled={isSubmitting || (!textEntry && !transcript && !videoBlob)}
        className="w-full bg-gradient-to-r from-teal-500 via-blue-500 to-purple-500 hover:from-teal-600 hover:via-blue-600 hover:to-purple-600 h-14 text-lg shadow-2xl hover-lift animate-fade-in-up animation-delay-1000 disabled:opacity-50 disabled:cursor-not-allowed"
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
    </div>
  );
}
