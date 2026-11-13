import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button, Badge } from './ui-primitives';
import { ArrowUpRight, ArrowDownRight, Plus, Download, Calendar, Activity, Clock } from 'lucide-react';

export interface KpiCardData {
  title: string;
  value: string | number;
  changePercent: number; // e.g. +12.5 or -4.2
  trendLabel?: string; // e.g. "vs last month"
  icon?: React.ReactNode;
}

export interface ActivityItem {
  id: string;
  actor: string;
  action: string;
  target: string;
  timestamp: string;
  status?: 'success' | 'warning' | 'info';
}

export interface DashboardProps {
  userName: string;
  roleTitle?: string;
  kpis: KpiCardData[];
  activities: ActivityItem[];
  onQuickAction?: (actionId: string) => void;
  chartNode?: React.ReactNode;
}

export function DashboardTemplate({
  userName,
  roleTitle = 'Department Administrator',
  kpis,
  activities,
  onQuickAction,
  chartNode,
}: DashboardProps) {
  // Compute time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="space-y-6">
      {/* 1. Header with Greeting & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-border">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {getGreeting()}, {userName}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Here is what requires your review today across your {roleTitle} portal.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => onQuickAction?.('export')}>
            <Download className="w-4 h-4 mr-1.5" />
            Export Report
          </Button>
          <Button variant="primary" size="sm" onClick={() => onQuickAction?.('create')}>
            <Plus className="w-4 h-4 mr-1.5" />
            New Entry
          </Button>
        </div>
      </div>

      {/* 2. KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => {
          const isPositive = kpi.changePercent >= 0;
          return (
            <Card key={kpi.title} className="p-5 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {kpi.title}
                </span>
                {kpi.icon && <div className="text-muted-foreground">{kpi.icon}</div>}
              </div>
              <div className="mt-3">
                <div className="text-2xl font-bold text-foreground">{kpi.value}</div>
                <div className="flex items-center gap-1.5 mt-1 text-xs">
                  <Badge variant={isPositive ? 'success' : 'danger'}>
                    <span className="inline-flex items-center gap-0.5 font-semibold">
                      {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                      {Math.abs(kpi.changePercent)}%
                    </span>
                  </Badge>
                  <span className="text-muted-foreground">{kpi.trendLabel || 'vs previous cycle'}</span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* 3. Charts Area & Recent Activity Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart Column (2 Cols on Desktop) */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>Operational Throughput</CardTitle>
              <CardDescription>Real-time metrics tracking across key lifecycle indicators</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                Last 30 Days
              </span>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            {chartNode || (
              <div className="h-64 rounded-md border border-dashed border-border flex items-center justify-center text-muted-foreground text-sm bg-muted/20">
                <div className="text-center space-y-1">
                  <Activity className="w-8 h-8 mx-auto opacity-40 text-primary" />
                  <p>Chart data visualizer stream</p>
                  <p className="text-xs opacity-60">(Connect Recharts or Chart.js here)</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity Column (1 Col on Desktop) */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Live audit stream of platform events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activities.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-6">No recent logs recorded.</p>
              ) : (
                activities.slice(0, 5).map((act) => (
                  <div key={act.id} className="flex items-start gap-3 text-xs border-b border-border/50 pb-3 last:border-none last:pb-0">
                    <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
                    <div className="flex-1 space-y-0.5">
                      <p className="text-foreground">
                        <span className="font-semibold">{act.actor}</span> {act.action}{' '}
                        <span className="font-medium text-primary">{act.target}</span>
                      </p>
                      <p className="text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {act.timestamp}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
