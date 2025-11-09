import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Users, Activity, AlertTriangle, Shield } from "lucide-react";

export default function Admin() {
  const { t } = useLanguage();

  const cohortData = [
    { week: 'Week 1', avgScore: 72 },
    { week: 'Week 2', avgScore: 75 },
    { week: 'Week 3', avgScore: 78 },
    { week: 'Week 4', avgScore: 76 },
  ];

  const riskDistribution = [
    { name: 'Low', value: 75, color: 'hsl(var(--success))' },
    { name: 'Medium', value: 20, color: 'hsl(var(--warning))' },
    { name: 'High', value: 5, color: 'hsl(var(--destructive))' },
  ];

  const metrics = [
    { title: t('admin.activeUsers'), value: '1,234', icon: Users, color: 'text-primary' },
    { title: t('admin.totalCheckins'), value: '8,456', icon: Activity, color: 'text-secondary' },
    { title: t('admin.flaggedUsers'), value: '62', icon: AlertTriangle, color: 'text-warning' },
  ];

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl md:text-4xl font-bold">{t('admin.title')}</h1>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Shield className="h-4 w-4" />
          {t('admin.anonymous')}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {metrics.map((metric, index) => (
          <Card key={index} className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
              <metric.icon className={`h-5 w-5 ${metric.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{metric.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>{t('admin.cohortTrends')}</CardTitle>
            <CardDescription>Average wellness scores over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={cohortData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="week" className="text-sm" />
                <YAxis domain={[0, 100]} className="text-sm" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="avgScore" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Risk Level Distribution</CardTitle>
            <CardDescription>Current cohort risk breakdown</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={riskDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label={(entry) => `${entry.name}: ${entry.value}%`}
                >
                  {riskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
