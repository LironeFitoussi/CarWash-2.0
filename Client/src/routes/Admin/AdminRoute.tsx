import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Car, Sparkles, DollarSign, BarChart2, Activity, PieChart } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const analytics = [
  {
    title: "admin.analytics.totalUsers",
    value: 1240,
    icon: Users,
    color: "text-blue-600",
  },
  {
    title: "admin.analytics.totalCars",
    value: 860,
    icon: Car,
    color: "text-green-600",
  },
  {
    title: "admin.analytics.totalWashes",
    value: 3120,
    icon: Sparkles,
    color: "text-yellow-600",
  },
  {
    title: "admin.analytics.revenue",
    value: "$18,400",
    icon: DollarSign,
    color: "text-emerald-600",
  },
];

const recentActivity = [
  { type: "admin.activity.user", desc: "admin.activity.newUser", time: "2 min ago" },
  { type: "admin.activity.wash", desc: "admin.activity.washCompleted", time: "10 min ago" },
  { type: "admin.activity.revenue", desc: "admin.activity.paymentReceived", time: "30 min ago" },
  { type: "admin.activity.car", desc: "admin.activity.newCar", time: "1 hr ago" },
  { type: "admin.activity.user", desc: "admin.activity.upgraded", time: "2 hr ago" },
];

const pieData = [
  { label: "admin.pie.express", value: 50, color: "#2563eb" }, // blue
  { label: "admin.pie.premium", value: 30, color: "#facc15" }, // yellow
  { label: "admin.pie.deluxe", value: 20, color: "#10b981" }, // green
];

// Dummy revenue data for the current month (generate based on month length)
function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}
const now = new Date();
const daysInMonth = getDaysInMonth(now.getFullYear(), now.getMonth());
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const revenueData = Array.from({ length: daysInMonth }, (_, _i) => 200 + Math.round(Math.random() * 350));

function PieChartSVG() {
  // Pie chart math
  const total = pieData.reduce((sum, d) => sum + d.value, 0);
  let cumulative = 0;
  const radius = 48;
  const cx = 60;
  const cy = 60;
  return (
    <svg width="120" height="120" viewBox="0 0 120 120">
      {pieData.map((slice, i) => {
        const startAngle = (cumulative / total) * 2 * Math.PI;
        const endAngle = ((cumulative + slice.value) / total) * 2 * Math.PI;
        const x1 = cx + radius * Math.sin(startAngle);
        const y1 = cy - radius * Math.cos(startAngle);
        const x2 = cx + radius * Math.sin(endAngle);
        const y2 = cy - radius * Math.cos(endAngle);
        const largeArc = slice.value / total > 0.5 ? 1 : 0;
        const pathData = `M${cx},${cy} L${x1},${y1} A${radius},${radius} 0 ${largeArc} 1 ${x2},${y2} Z`;
        cumulative += slice.value;
        return (
          <path key={i} d={pathData} fill={slice.color} stroke="#fff" strokeWidth="2" />
        );
      })}
    </svg>
  );
}

function RevenueLineChart() {
  const [hovered, setHovered] = useState<number | null>(null);
  const width = 800;
  const height = 200;
  const padding = 40;
  const days = revenueData.length;
  const maxRevenue = Math.max(...revenueData);
  const minRevenue = Math.min(...revenueData);
  const xLabelStep = days > 20 ? 3 : 1;
  return (
    <div className="relative w-full h-full">
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
        {/* X and Y axis */}
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#ccc" />
        <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#ccc" />
        {/* Line graph */}
        <polyline
          fill="none"
          stroke="#2563eb"
          strokeWidth="3"
          points={revenueData.map((rev, i) => {
            const x = padding + (i * (width - 2 * padding)) / (days - 1);
            const y = height - padding - ((rev - minRevenue) / (maxRevenue - minRevenue)) * (height - 2 * padding);
            return `${x},${y}`;
          }).join(' ')}
        />
        {/* Dots with hover */}
        {revenueData.map((rev, i) => {
          const x = padding + (i * (width - 2 * padding)) / (days - 1);
          const y = height - padding - ((rev - minRevenue) / (maxRevenue - minRevenue)) * (height - 2 * padding);
          return (
            <g key={i}>
              <circle
                cx={x}
                cy={y}
                r={hovered === i ? 7 : 4}
                fill={hovered === i ? "#1e40af" : "#2563eb"}
                stroke="#fff"
                strokeWidth="2"
                style={{ cursor: "pointer", transition: "r 0.1s" }}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              />
            </g>
          );
        })}
        {/* Y axis labels */}
        <text x={padding - 10} y={padding + 4} fontSize="12" textAnchor="end" fill="#888">{maxRevenue}</text>
        <text x={padding - 10} y={height - padding + 4} fontSize="12" textAnchor="end" fill="#888">{minRevenue}</text>
        {/* X axis labels (days) */}
        {revenueData.map((_, i) => {
          if (i % xLabelStep !== 0 && i !== days - 1) return null;
          const x = padding + (i * (width - 2 * padding)) / (days - 1);
          return (
            <text
              key={i}
              x={x}
              y={height - padding + 18}
              fontSize="10"
              textAnchor="middle"
              fill="#888"
            >
              {i + 1}
            </text>
          );
        })}
        {/* Legend */}
        <rect x={width - 120} y={padding - 18} width="12" height="12" fill="#2563eb" />
        <text x={width - 100} y={padding - 8} fontSize="12" fill="#2563eb">Revenue</text>
      </svg>
      {/* Tooltip */}
      {hovered !== null && (() => {
        const i = hovered;
        const rev = revenueData[i];
        const x = padding + (i * (width - 2 * padding)) / (days - 1);
        const y = height - padding - ((rev - minRevenue) / (maxRevenue - minRevenue)) * (height - 2 * padding);
        return (
          <div
            className="absolute z-10 px-3 py-2 rounded shadow-lg bg-white border text-sm font-medium text-gray-900 pointer-events-none"
            style={{
              left: `calc(${(x / width) * 100}% - 60px)`,
              top: y - 48,
              minWidth: 120,
              textAlign: "center",
              transition: "left 0.1s, top 0.1s"
            }}
          >
            <div>Day {i + 1}</div>
            <div className="font-bold text-blue-700">₪{rev}</div>
          </div>
        );
      })()}
    </div>
  );
}

export default function AdminRoute() {
  const { t } = useTranslation();
  return (
    <div className="max-w-7xl mx-auto py-10 px-4 space-y-10">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2">{t('admin.title', 'Admin Dashboard')}</h1>
        <p className="text-muted-foreground text-lg">{t('admin.subtitle', 'Overview & analytics for your car wash business')}</p>
      </div>

      {/* Analytics Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        {analytics.map((item, idx) => (
          <Card key={idx} className="flex flex-col items-center py-6">
            <div className={`mb-2 rounded-full bg-muted p-3 ${item.color}`}>
              <item.icon className="w-7 h-7" />
            </div>
            <CardTitle className="text-xl font-semibold mb-1">{item.value}</CardTitle>
            <CardDescription className="text-muted-foreground">{t(item.title)}</CardDescription>
          </Card>
        ))}
      </div>

      {/* Pie Chart Area */}
      <Card className="p-8 flex flex-col md:flex-row items-center gap-8">
        <div className="flex flex-col items-center">
          <div className="mb-2 flex items-center gap-2">
            <PieChart className="w-6 h-6 text-primary" />
            <CardTitle>{t('admin.pie.title', 'Wash Types Distribution')}</CardTitle>
            <Badge variant="outline" className="ml-2">{t('admin.pie.dummy', 'Dummy Data')}</Badge>
          </div>
          <PieChartSVG />
        </div>
        <div className="flex flex-col gap-2 mt-6 md:mt-0">
          {pieData.map((slice, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="inline-block w-4 h-4 rounded-full" style={{ background: slice.color }}></span>
              <span className="font-medium">{t(slice.label)}</span>
              <span className="text-muted-foreground">{slice.value}%</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Chart Area (Placeholder) */}
      <Card className="p-8">
        <CardHeader className="flex flex-row items-center gap-2 mb-4">
          <BarChart2 className="w-6 h-6 text-primary" />
          <CardTitle>{t('admin.revenue.title', 'Monthly Revenue')}</CardTitle>
          <Badge variant="outline" className="ml-2">{t('admin.pie.dummy', 'Dummy Data')}</Badge>
        </CardHeader>
        <CardContent>
          <div className="h-64 w-full flex items-center justify-center bg-muted rounded-lg overflow-x-auto">
            <RevenueLineChart />
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="p-8">
        <CardHeader className="flex flex-row items-center gap-2 mb-4">
          <Activity className="w-6 h-6 text-primary" />
          <CardTitle>{t('admin.activity.title', 'Recent Activity')}</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {recentActivity.map((event, idx) => (
              <li key={idx} className="flex items-center gap-3">
                <Badge variant="secondary">{t(event.type)}</Badge>
                <span className="flex-1">{t(event.desc)}</span>
                <span className="text-xs text-muted-foreground">{event.time}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
