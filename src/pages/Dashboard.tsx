import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, AlertCircle, CheckCircle } from "lucide-react";

export default function Dashboard() {
  const { t } = useLanguage();

  // Mock data
  const mockData7Days = [
    { day: 'Mon', score: 75 },
    { day: 'Tue', score: 72 },
    { day: 'Wed', score: 78 },
    { day: 'Thu', score: 80 },
    { day: 'Fri', score: 76 },
    { day: 'Sat', score: 82 },
    { day: 'Sun', score: 85 },
  ];

  const recentCheckins = [
    { date: '2025-11-06', excerpt: 'Feeling good today, had a productive morning...', score: 85 },
    { date: '2025-11-05', excerpt: 'A bit tired but managing well...', score: 76 },
    { date: '2025-11-04', excerpt: 'Great day with friends and family...', score: 90 },
  ];

  const currentScore = 85;
  const riskLevel = 'low';

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
    <div className="container max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold">{t('dashboard.title')}</h1>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>{t('dashboard.currentScore')}</CardTitle>
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
                    className="text-muted"
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 70}`}
                    strokeDashoffset={`${2 * Math.PI * 70 * (1 - currentScore / 100)}`}
                    className="text-primary transition-all duration-1000"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-4xl font-bold">{currentScore}</span>
                  <span className="text-sm text-muted-foreground">/ 100</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>{t('dashboard.riskLevel')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-full">
              <div className={`flex items-center gap-3 ${getRiskColor(riskLevel)}`}>
                {getRiskIcon(riskLevel)}
                <span className="text-3xl font-bold capitalize">
                  {t(`dashboard.risk.${riskLevel}`)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            {t('dashboard.trends')}
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">{t('dashboard.days7')}</Button>
            <Button variant="ghost" size="sm">{t('dashboard.days30')}</Button>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mockData7Days}>
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
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>{t('dashboard.timeline')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentCheckins.map((checkin, index) => (
              <div key={index} className="flex gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-gradient-calm flex items-center justify-center font-bold text-primary-foreground">
                    {checkin.score}
                  </div>
                  <span className="text-xs text-muted-foreground">{checkin.date}</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm">{checkin.excerpt}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
