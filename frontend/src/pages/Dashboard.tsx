import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { dashboardAPI, checkInAPI } from "@/services/api";

export default function Dashboard() {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(7);
  const [summary, setSummary] = useState<any>(null);
  const [trendData, setTrendData] = useState<any[]>([]);
  const [recentCheckins, setRecentCheckins] = useState<any[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, [days]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [summaryData, trendsData, checkInsData] = await Promise.all([
        dashboardAPI.getSummary(),
        dashboardAPI.getMoodTrends(days),
        checkInAPI.getAll(5, 0)
      ]);

      setSummary(summaryData);
      setTrendData(trendsData.trends.map((t: any) => ({
        day: new Date(t.date).toLocaleDateString('en-US', { weekday: 'short' }),
        score: parseFloat(t.average_mood || 0) * 10,
        date: t.date
      })));
      setRecentCheckins(checkInsData.checkIns);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const currentScore = summary?.wellnessScore ? Math.round(summary.wellnessScore * 10) : 0;
  const riskLevel = summary?.currentRiskLevel || 'unknown';

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-success';
      case 'medium': return 'text-warning';
      case 'high': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'low': return <CheckCircle className="h-5 w-5" />;
      case 'medium': return <AlertCircle className="h-5 w-5" />;
      case 'high': return <AlertCircle className="h-5 w-5" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-mesh relative">
      {/* Decorative elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-blob" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-blob animation-delay-2000" />
      
      <div className="container max-w-6xl mx-auto px-4 py-8 space-y-6 relative z-10">
      <div className="animate-fade-in-down">
        <h1 className="text-3xl md:text-4xl font-bold gradient-text">{t('dashboard.title')}</h1>
        <p className="text-muted-foreground mt-2">Track your mental wellness journey</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="shadow-card card-hover animate-scale-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  {t('dashboard.currentScore')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center">
                  <div className="relative w-40 h-40">
                    <svg className="w-40 h-40 transform -rotate-90">
                      <circle
                        cx="80"
                        cy="80"
                        r="70"
                        stroke="currentColor"
                        strokeWidth="12"
                        fill="none"
                        className="text-muted/30"
                      />
                      <circle
                        cx="80"
                        cy="80"
                        r="70"
                        stroke="url(#gradient)"
                        strokeWidth="12"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 70}`}
                        strokeDashoffset={`${2 * Math.PI * 70 * (1 - currentScore / 100)}`}
                        className="transition-all duration-1000 ease-out"
                        strokeLinecap="round"
                      />
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="hsl(var(--primary))" />
                          <stop offset="100%" stopColor="hsl(var(--primary-glow))" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center flex-col animate-bounce-subtle">
                      <span className="text-5xl font-bold gradient-text">{currentScore}</span>
                      <span className="text-sm text-muted-foreground">/ 100</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card card-hover animate-scale-in animation-delay-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-primary" />
                  {t('dashboard.riskLevel')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-full">
                  <div className={`flex items-center gap-3 ${getRiskColor(riskLevel)} animate-pulse-glow rounded-full px-6 py-4`}>
                    {getRiskIcon(riskLevel)}
                    <span className="text-3xl font-bold capitalize">
                      {t(`dashboard.risk.${riskLevel}`)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-card hover-lift animate-fade-in-up animation-delay-400">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                {t('dashboard.trends')}
              </CardTitle>
              <div className="flex gap-2">
                <Button 
                  variant={days === 7 ? "default" : "ghost"} 
                  size="sm"
                  onClick={() => setDays(7)}
                  className="hover-scale"
                >
                  {t('dashboard.days7')}
                </Button>
                <Button 
                  variant={days === 30 ? "default" : "ghost"} 
                  size="sm"
                  onClick={() => setDays(30)}
                  className="hover-scale"
                >
                  {t('dashboard.days30')}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendData.length > 0 ? trendData : [{day: 'No data', score: 0}]}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="day" className="text-sm" />
                  <YAxis domain={[0, 100]} className="text-sm" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="hsl(var(--primary))"
                    strokeWidth={3}
                    dot={{ fill: 'hsl(var(--primary))', r: 4 }}
                    animationDuration={1500}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="shadow-card hover-lift animate-fade-in-up animation-delay-600">
            <CardHeader>
              <CardTitle>{t('dashboard.timeline')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentCheckins.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8 animate-fade-in">No check-ins yet. Create your first check-in!</p>
                ) : (
                  recentCheckins.map((checkin: any, index: number) => (
                    <div 
                      key={checkin.id} 
                      className="flex gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-all hover-lift animate-fade-in-left"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 rounded-full bg-gradient-calm flex items-center justify-center font-bold text-primary-foreground shadow-lg animate-bounce-subtle">
                          {checkin.mood_score}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(checkin.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm">
                          {checkin.text_entry?.substring(0, 100) || checkin.voice_transcript?.substring(0, 100) || 'Check-in recorded'}
                          {(checkin.text_entry?.length > 100 || checkin.voice_transcript?.length > 100) && '...'}
                        </p>
                        <div className="flex gap-2 mt-2">
                          <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary hover-scale cursor-default">
                            {checkin.sentiment}
                          </span>
                          <span className="text-xs px-2 py-1 rounded-full bg-accent/10 text-accent-foreground hover-scale cursor-default">
                            {checkin.stress_level} stress
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
    </div>
  );
}
