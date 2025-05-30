import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingDown, Plus, RotateCcw, Search, Edit, Trash2 } from "lucide-react";
import { useExpenseTransactions, useTransactionStats } from "@/hooks/useTransactions";
import { useCategories } from "@/hooks/useCategories";
import TransactionModal from "@/components/modals/TransactionModal";

export default function ExpensesRoute() {
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Get real data from API
  const { data: expenseData, isLoading: expenseLoading } = useExpenseTransactions({
    page: 1,
    limit: 100, // Get more transactions for expense display
  });

  const { data: transactionStats, isLoading: statsLoading } = useTransactionStats({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });

  const { data: categories } = useCategories();

  // Debug: Log the actual API response
  console.log('Expense Route - Transaction Stats:', transactionStats);
  console.log('Expense Route - Expense Data:', expenseData);

  // Try multiple ways to get total expenses
  let totalExpenses = 0;
  if (transactionStats?.overview) {
    totalExpenses = transactionStats.overview.find(item => item._id === 'expense')?.total || 0;
    console.log('Expense Route - Using stats API total:', totalExpenses);
  } else if (expenseData?.transactions) {
    // Fallback: calculate from transactions list
    totalExpenses = expenseData.transactions.reduce((sum, t) => sum + t.amount, 0);
    console.log('Expense Route - Calculating from transactions:', {
      transactions: expenseData.transactions,
      amounts: expenseData.transactions.map(t => t.amount),
      total: totalExpenses
    });
  }

  // Additional fallback: If both fail, calculate from visible transactions
  if (totalExpenses === 0 && expenseData?.transactions && expenseData.transactions.length > 0) {
    totalExpenses = expenseData.transactions.reduce((sum, t) => sum + t.amount, 0);
    console.log('Expense Route - Final fallback calculation:', {
      visibleTransactions: expenseData.transactions,
      calculatedTotal: totalExpenses
    });
  }

  console.log('Expense Route - Final total expenses:', totalExpenses);

  const expenseTransactions = expenseData?.transactions || [];
  
  // Filter categories for expenses
  const expenseCategories = categories?.filter(cat => 
    cat.type === 'expense' || cat.type === 'both'
  ) || [];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Expense Management</h1>
          <p className="text-gray-600">Track and categorize your expenses</p>
        </div>
        <Button 
          onClick={() => setShowAddModal(true)}
          className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Expense
        </Button>
      </div>

      {/* Total Expenses Card */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">Total Expenses This Month</CardTitle>
        </CardHeader>
        <CardContent>
          {statsLoading ? (
            <Skeleton className="h-12 w-48" />
          ) : (
            <div className="flex items-center gap-4">
              <div className="text-4xl font-bold text-red-600">₪{totalExpenses.toLocaleString()}</div>
              <div className="flex items-center gap-1 text-red-600">
                <TrendingDown className="h-4 w-4" />
                <span className="text-sm font-medium">
                  {expenseTransactions.length} transaction{expenseTransactions.length !== 1 ? 's' : ''} this month
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Search expenses..." 
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Select defaultValue="all-categories">
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-categories">All Categories</SelectItem>
                  {expenseCategories.map((category) => (
                    <SelectItem key={category._id} value={category._id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select defaultValue="this-month">
                <SelectTrigger>
                  <SelectValue placeholder="This Month" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="this-week">This Week</SelectItem>
                  <SelectItem value="this-month">This Month</SelectItem>
                  <SelectItem value="last-month">Last Month</SelectItem>
                  <SelectItem value="this-year">This Year</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Button variant="outline" className="w-full flex items-center gap-2">
                <RotateCcw className="h-4 w-4" />
                Reset Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Expense Transactions List */}
      <div className="space-y-4">
        {expenseLoading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-8 w-24" />
                    <div className="flex gap-2">
                      <Skeleton className="h-8 w-8" />
                      <Skeleton className="h-8 w-8" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : expenseTransactions.length > 0 ? (
          expenseTransactions.map((transaction) => (
            <Card key={transaction._id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-gray-900">{transaction.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                      <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                        {typeof transaction.category === 'object' ? transaction.category.name : 'Unknown'}
                      </span>
                      <span>•</span>
                      <span>{new Date(transaction.date).toLocaleDateString()}</span>
                    </div>
                    {transaction.description && (
                      <p className="text-sm text-gray-600 mt-1">{transaction.description}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-red-600">₪{transaction.amount.toLocaleString()}</div>
                    <div className="flex items-center gap-2 mt-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-blue-600 border-blue-200 hover:bg-blue-50"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingDown className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No expense records found</h3>
              <p className="text-gray-500 mb-6">Try adjusting your filters or add your first expense entry</p>
              <Button 
                onClick={() => setShowAddModal(true)}
                className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Your First Expense
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Add Expense Modal */}
      <TransactionModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        type="expense"
      />
    </div>
  );
} 