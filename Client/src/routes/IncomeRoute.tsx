import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, Plus, RotateCcw, Search } from "lucide-react";
import { useIncomeTransactions, useTransactionStats } from "@/hooks/useTransactions";
import { useCategories } from "@/hooks/useCategories";
import TransactionModal from "@/components/modals/TransactionModal";

export default function IncomeRoute() {
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Get real data from API
  const { data: incomeData, isLoading: incomeLoading } = useIncomeTransactions({
    page: 1,
    limit: 100, // Get more transactions for income display
  });

  const { data: transactionStats, isLoading: statsLoading } = useTransactionStats({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });

  const { data: categories } = useCategories();

  // Debug: Log the actual API response
  console.log('Income Route - Transaction Stats:', transactionStats);
  console.log('Income Route - Income Data:', incomeData);

  // Try multiple ways to get total income
  let totalIncome = 0;
  if (transactionStats?.overview) {
    totalIncome = transactionStats.overview.find(item => item._id === 'income')?.total || 0;
    console.log('Income Route - Using stats API total:', totalIncome);
  } else if (incomeData?.transactions) {
    // Fallback: calculate from transactions list
    totalIncome = incomeData.transactions.reduce((sum, t) => sum + t.amount, 0);
    console.log('Income Route - Calculating from transactions:', {
      transactions: incomeData.transactions,
      amounts: incomeData.transactions.map(t => t.amount),
      total: totalIncome
    });
  }

  // Additional fallback: If both fail, calculate from visible transactions
  if (totalIncome === 0 && incomeData?.transactions && incomeData.transactions.length > 0) {
    totalIncome = incomeData.transactions.reduce((sum, t) => sum + t.amount, 0);
    console.log('Income Route - Final fallback calculation:', {
      visibleTransactions: incomeData.transactions,
      calculatedTotal: totalIncome
    });
  }

  console.log('Income Route - Final total income:', totalIncome);

  const incomeTransactions = incomeData?.transactions || [];
  
  // Filter categories for income
  const incomeCategories = categories?.filter(cat => 
    cat.type === 'income' || cat.type === 'both'
  ) || [];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Income Management</h1>
          <p className="text-gray-600">Track and manage your income sources</p>
        </div>
        <Button 
          onClick={() => setShowAddModal(true)}
          className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Income
        </Button>
      </div>

      {/* Total Income Card */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">Total Income This Month</CardTitle>
        </CardHeader>
        <CardContent>
          {statsLoading ? (
            <Skeleton className="h-12 w-48" />
          ) : (
            <div className="flex items-center gap-4">
              <div className="text-4xl font-bold text-green-600">₪{totalIncome.toLocaleString()}</div>
              <div className="flex items-center gap-1 text-green-600">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm font-medium">
                  {incomeTransactions.length} transaction{incomeTransactions.length !== 1 ? 's' : ''} this month
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
                  placeholder="Search income..." 
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
                  {incomeCategories.map((category) => (
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

      {/* Income Transactions List */}
      <div className="space-y-4">
        {incomeLoading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                  <Skeleton className="h-8 w-24" />
                </div>
              </CardContent>
            </Card>
          ))
        ) : incomeTransactions.length > 0 ? (
          incomeTransactions.map((transaction) => (
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
                    <div className="text-2xl font-bold text-green-600">₪{transaction.amount.toLocaleString()}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No income records found</h3>
              <p className="text-gray-500 mb-6">Try adjusting your filters or add your first income entry</p>
              <Button 
                onClick={() => setShowAddModal(true)}
                className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Your First Income
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Add Income Modal */}
      <TransactionModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        type="income"
      />
    </div>
  );
} 