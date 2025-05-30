import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Receipt, 
  PieChart, 
  CreditCard,
  Wallet,
  Settings
} from "lucide-react";
import { Link } from "react-router-dom";
import { useTransactionStats } from "@/hooks/useTransactions";
import { useAccounts } from "@/hooks/useAccounts";
import { useCategories } from "@/hooks/useCategories";
import { useTransactions } from "@/hooks/useTransactions";

export default function AdminRoute() {
  // Get data for admin overview
  const { data: accounts } = useAccounts();
  const { data: categories } = useCategories();
  const { data: transactionStats } = useTransactionStats({
    startDate: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0], // Start of year
    endDate: new Date().toISOString().split('T')[0], // Today
  });

  // Also get all transactions for fallback calculation
  const { data: allTransactions } = useTransactions({ limit: 1000 });

  // Debug: Log the actual API response
  console.log('Admin Route - Transaction Stats:', transactionStats);
  console.log('Admin Route - All Transactions:', allTransactions);

  // Calculate metrics with fallback
  const totalUsers = 1; // For now, could be extended to show all users
  const totalAccounts = accounts?.length || 0;
  const totalCategories = categories?.length || 0;
  
  // Try to get totals from stats API first, then fallback to calculating from transactions
  let totalIncome = 0;
  let totalExpenses = 0;
  let totalTransactions = 0;

  if (transactionStats?.overview) {
    totalIncome = transactionStats.overview.find(item => item._id === 'income')?.total || 0;
    totalExpenses = transactionStats.overview.find(item => item._id === 'expense')?.total || 0;
    totalTransactions = transactionStats.overview.reduce((sum, item) => sum + item.count, 0) || 0;
  } else if (allTransactions?.transactions) {
    // Fallback: calculate from all transactions
    const transactions = allTransactions.transactions;
    totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    totalTransactions = transactions.length;
  }

  console.log('Admin Route - Calculated totals:', { totalIncome, totalExpenses, totalTransactions });

  const adminMetrics = [
    {
      title: "Total Users",
      value: totalUsers,
    icon: Users,
    color: "text-blue-600",
      description: "Registered users"
  },
  {
      title: "Active Accounts",
      value: totalAccounts,
      icon: CreditCard,
    color: "text-green-600",
      description: "Financial accounts"
  },
  {
      title: "Categories",
      value: totalCategories,
      icon: Receipt,
    color: "text-purple-600",
      description: "Income & expense categories"
  },
  {
      title: "Total Transactions",
      value: totalTransactions,
      icon: TrendingUp,
      color: "text-orange-600",
      description: "All time transactions"
    },
  ];

  const financialOverview = [
    {
      title: "Total Income",
      value: `₪${totalIncome.toLocaleString()}`,
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      title: "Total Expenses", 
      value: `₪${totalExpenses.toLocaleString()}`,
      icon: TrendingDown,
      color: "text-red-600",
      bgColor: "bg-red-100"
    },
    {
      title: "Net Income",
      value: `₪${(totalIncome - totalExpenses).toLocaleString()}`,
      icon: DollarSign,
      color: totalIncome - totalExpenses >= 0 ? "text-green-600" : "text-red-600",
      bgColor: totalIncome - totalExpenses >= 0 ? "bg-green-100" : "bg-red-100"
    },
  ];

  const quickActions = [
    {
      title: "Manage Categories",
      description: "Add, edit, or delete transaction categories",
      href: "/admin/categories",
      icon: Receipt,
      color: "bg-blue-600 hover:bg-blue-700"
    },
    {
      title: "Manage Accounts",
      description: "Oversee user financial accounts",
      href: "/admin/accounts",
      icon: Wallet,
      color: "bg-green-600 hover:bg-green-700"
    },
    {
      title: "User Management",
      description: "Manage user accounts and permissions",
      href: "/admin/users",
      icon: Users,
      color: "bg-purple-600 hover:bg-purple-700"
    },
    {
      title: "System Analytics",
      description: "View detailed reports and analytics",
      href: "/admin/analytics",
      icon: PieChart,
      color: "bg-orange-600 hover:bg-orange-700"
    },
  ];

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 space-y-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 text-gray-900">ExpenseFlow Admin</h1>
        <p className="text-gray-600 text-lg">System administration and financial management dashboard</p>
      </div>

      {/* System Metrics */}
      <div className="grid gap-6 md:grid-cols-4">
        {adminMetrics.map((metric, idx) => (
          <Card key={idx} className="hover:shadow-lg transition-shadow">
            <CardContent className="flex flex-col items-center py-6">
              <div className={`mb-4 rounded-full bg-gray-100 p-3 ${metric.color}`}>
                <metric.icon className="w-7 h-7" />
            </div>
              <CardTitle className="text-2xl font-bold mb-1">{metric.value}</CardTitle>
              <CardDescription className="text-center">
                <div className="font-medium">{metric.title}</div>
                <div className="text-sm text-gray-500">{metric.description}</div>
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Financial Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-blue-600" />
            Financial Overview
          </CardTitle>
          <CardDescription>System-wide financial metrics and performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {financialOverview.map((item, idx) => (
              <div key={idx} className={`p-4 rounded-lg ${item.bgColor}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{item.title}</p>
                    <p className={`text-2xl font-bold ${item.color}`}>{item.value}</p>
          </div>
                  <item.icon className={`h-8 w-8 ${item.color}`} />
        </div>
            </div>
          ))}
        </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-blue-600" />
            Quick Actions
          </CardTitle>
          <CardDescription>Common administrative tasks and management options</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {quickActions.map((action, idx) => (
              <Link key={idx} to={action.href}>
                <div className="group cursor-pointer">
                  <div className={`${action.color} text-white p-6 rounded-lg transition-all group-hover:shadow-lg`}>
                    <action.icon className="h-8 w-8 mb-3" />
                    <h3 className="font-semibold mb-2">{action.title}</h3>
                    <p className="text-sm opacity-90">{action.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            System Status
          </CardTitle>
          <CardDescription>Current system health and recent activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="font-medium">System Status</span>
              </div>
              <Badge className="bg-green-100 text-green-800">Operational</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="font-medium">Database</span>
              </div>
              <Badge className="bg-blue-100 text-blue-800">Connected</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="font-medium">Backup Status</span>
              </div>
              <Badge className="bg-yellow-100 text-yellow-800">Scheduled</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
