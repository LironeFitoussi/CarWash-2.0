import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, PiggyBank } from "lucide-react";
import { useTransactionStats, useTransactions } from "@/hooks/useTransactions";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardRoute() {
  const { data: transactionStats, isLoading: statsLoading } = useTransactionStats({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0], // Start of current month
    endDate: new Date().toISOString().split('T')[0], // Today
  });

  const { data: recentTransactions, isLoading: transactionsLoading } = useTransactions({
    page: 1,
    limit: 5, // Get only 5 recent transactions
  });

  // Also get all transactions for fallback calculation
  const { data: allTransactions } = useTransactions({ limit: 1000 });

  // Debug: Log the actual API response
  console.log('Dashboard - Transaction Stats:', transactionStats);
  console.log('Dashboard - All Transactions:', allTransactions);

  // Calculate metrics with fallback (same as admin route)
  let totalIncome = 0;
  let totalExpenses = 0;

  if (transactionStats?.overview) {
    totalIncome = transactionStats.overview.find(item => item._id === 'income')?.total || 0;
    totalExpenses = transactionStats.overview.find(item => item._id === 'expense')?.total || 0;
    console.log('Dashboard - Using stats API:', { totalIncome, totalExpenses });
  } else if (allTransactions?.transactions) {
    // Fallback: calculate from all transactions for current month
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const currentMonthTransactions = allTransactions.transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate.getMonth() === currentMonth && transactionDate.getFullYear() === currentYear;
    });
    
    totalIncome = currentMonthTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    totalExpenses = currentMonthTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    
    console.log('Dashboard - Fallback calculation:', {
      currentMonthTransactions,
      totalIncome,
      totalExpenses
    });
  }

  const netIncome = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? ((netIncome / totalIncome) * 100) : 0;

  // Remove hardcoded percentages and show real data instead
  const incomeTransactionCount = allTransactions?.transactions?.filter(t => 
    t.type === 'income' && 
    new Date(t.date).getMonth() === new Date().getMonth()
  ).length || 0;
  
  const expenseTransactionCount = allTransactions?.transactions?.filter(t => 
    t.type === 'expense' && 
    new Date(t.date).getMonth() === new Date().getMonth()
  ).length || 0;

  console.log('Dashboard - Final totals:', { totalIncome, totalExpenses, netIncome, savingsRate });

  // Replace hardcoded percentages with real transaction counts

  // Get comparison data (you could implement this with additional API calls for previous month)
  const incomeChange = `${incomeTransactionCount} transaction${incomeTransactionCount !== 1 ? 's' : ''}`;
  const expenseChange = `${expenseTransactionCount} transaction${expenseTransactionCount !== 1 ? 's' : ''}`;
  const netChange = netIncome >= 0 ? `+₪${netIncome.toLocaleString()}` : `-₪${Math.abs(netIncome).toLocaleString()}`;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Financial Dashboard</h1>
        <p className="text-gray-600">Track your income and expenses with ease</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Income */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Income</CardTitle>
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-24 mb-2" />
            ) : (
              <div className="text-2xl font-bold text-gray-900">₪{totalIncome.toLocaleString()}</div>
            )}
            <div className="flex items-center mt-1">
              <span className="text-xs text-green-600 font-medium">{incomeChange}</span>
              <span className="text-xs text-gray-500 ml-1">this month</span>
            </div>
          </CardContent>
        </Card>

        {/* Total Expenses */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Expenses</CardTitle>
            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
              <TrendingDown className="h-4 w-4 text-red-600" />
            </div>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-24 mb-2" />
            ) : (
              <div className="text-2xl font-bold text-gray-900">₪{totalExpenses.toLocaleString()}</div>
            )}
            <div className="flex items-center mt-1">
              <span className="text-xs text-red-600 font-medium">{expenseChange}</span>
              <span className="text-xs text-gray-500 ml-1">this month</span>
            </div>
          </CardContent>
        </Card>

        {/* Net Income */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Net Income</CardTitle>
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <DollarSign className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-24 mb-2" />
            ) : (
              <div className={`text-2xl font-bold ${netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ₪{netIncome.toLocaleString()}
              </div>
            )}
            <div className="flex items-center mt-1">
              <span className={`text-xs font-medium ${netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {netChange}
              </span>
              <span className="text-xs text-gray-500 ml-1">current balance</span>
            </div>
          </CardContent>
        </Card>

        {/* Savings Rate */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Savings Rate</CardTitle>
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <PiggyBank className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-24 mb-2" />
            ) : (
              <div className="text-2xl font-bold text-gray-900">{savingsRate.toFixed(1)}%</div>
            )}
            <div className="flex items-center mt-1">
              <span className="text-xs text-gray-600 font-medium">{savingsRate.toFixed(1)}%</span>
              <span className="text-xs text-gray-500 ml-1">of total income</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Income vs Expenses Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Income vs Expenses Trend (Last 6 Months)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-gray-500">Chart will appear here</p>
                <p className="text-sm text-gray-400">Add some transactions to see trends</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {transactionsLoading ? (
                // Loading skeleton
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <div>
                        <Skeleton className="h-4 w-20 mb-1" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </div>
                    <Skeleton className="h-5 w-16" />
                  </div>
                ))
              ) : recentTransactions && recentTransactions.transactions.length > 0 ? (
                recentTransactions.transactions.map((transaction) => (
                  <div key={transaction._id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        transaction.type === 'income' 
                          ? 'bg-green-100 text-green-600' 
                          : 'bg-red-100 text-red-600'
                      }`}>
                        {transaction.type === 'income' ? (
                          <TrendingUp className="h-4 w-4" />
                        ) : (
                          <TrendingDown className="h-4 w-4" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{transaction.title}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(transaction.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className={`text-sm font-medium ${
                      transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}₪{transaction.amount.toLocaleString()}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <DollarSign className="h-6 w-6 text-gray-400" />
                  </div>
                  <p className="text-gray-500 text-sm">No transactions yet</p>
                  <p className="text-gray-400 text-xs">Add your first transaction to get started</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 