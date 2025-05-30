import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  User as UserIcon, 
  DollarSign, 
  TrendingUp,
  TrendingDown,
  Calendar,
  MapPin,
  Mail,
  Phone,
  Settings,
  PieChart
} from "lucide-react";
import { useTransactionStats, useTransactions } from "@/hooks/useTransactions";
import { useAccounts } from "@/hooks/useAccounts";
import AccountModal from "@/components/modals/AccountModal";
import { useState } from "react";

export default function ProfileRoute() {
    const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
    const { firstName, lastName, email, phone, address, role, isLoading: userLoading } = useSelector((state: RootState) => state.user);
    
    // Get financial data
    const { data: transactionStats, isLoading: statsLoading } = useTransactionStats({
        startDate: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0], // Start of year
        endDate: new Date().toISOString().split('T')[0], // Today
    });

    const { data: recentTransactions, isLoading: transactionsLoading } = useTransactions({
        page: 1,
        limit: 5,
    });

    const { data: accounts, isLoading: accountsLoading } = useAccounts();

    // Calculate financial metrics
    const totalIncome = transactionStats?.overview.find(item => item._id === 'income')?.total || 0;
    const totalExpenses = transactionStats?.overview.find(item => item._id === 'expense')?.total || 0;
    const netIncome = totalIncome - totalExpenses;
    const totalTransactions = transactionStats?.overview.reduce((sum, item) => sum + item.count, 0) || 0;

    const financialStats = {
        totalIncome,
        totalExpenses,
        netIncome,
        totalTransactions,
        activeAccounts: accounts?.filter(acc => acc.isActive).length || 0,
        totalCategories: transactionStats?.byCategory.length || 0
    };

    return (
        <div className="max-w-5xl mx-auto py-10 space-y-10">
            {/* Profile Header */}
            <Card className="flex flex-col md:flex-row items-center gap-6 p-8 mx-4">
                <div className="flex-shrink-0">
                    <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center border-4 border-blue-200">
                        <UserIcon className="w-12 h-12 text-blue-600" />
                    </div>
                </div>
                <div className="flex-1 space-y-2">
                    <CardTitle className="text-2xl font-bold">
                        {userLoading ? <Skeleton className="h-6 w-40" /> : `${firstName} ${lastName}`}
                    </CardTitle>
                    <div className="flex items-center gap-2 text-gray-600">
                        <Mail className="h-4 w-4" />
                        {userLoading ? <Skeleton className="h-4 w-32" /> : email}
                    </div>
                    {phone && (
                        <div className="flex items-center gap-2 text-gray-600">
                            <Phone className="h-4 w-4" />
                            {phone}
                        </div>
                    )}
                    {address && (
                        <div className="flex items-center gap-2 text-gray-600">
                            <MapPin className="h-4 w-4" />
                            {address}
                        </div>
                    )}
                    <div className="flex gap-2 mt-3">
                        <Badge variant="outline" className="bg-blue-50 text-blue-700">
                            {role || 'User'}
                        </Badge>
                        <Badge variant="outline" className="bg-green-50 text-green-700">
                            {financialStats.activeAccounts} Active Accounts
                        </Badge>
                    </div>
                </div>
                <div className="mt-4 md:mt-0">
                    <Button variant="outline" className="gap-2">
                        <Settings className="h-4 w-4" />
                        Edit Profile
                    </Button>
                </div>
            </Card>

            {/* Financial Overview Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mx-4">
                <Card className="p-4 text-center hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-center mb-2">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                            <TrendingUp className="h-4 w-4 text-green-600" />
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-green-600">
                        {statsLoading ? <Skeleton className="h-6 w-16 mx-auto" /> : `₪${totalIncome.toLocaleString()}`}
                    </div>
                    <div className="text-sm text-gray-600">Total Income</div>
                </Card>

                <Card className="p-4 text-center hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-center mb-2">
                        <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                            <TrendingDown className="h-4 w-4 text-red-600" />
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-red-600">
                        {statsLoading ? <Skeleton className="h-6 w-16 mx-auto" /> : `₪${totalExpenses.toLocaleString()}`}
                    </div>
                    <div className="text-sm text-gray-600">Total Expenses</div>
                </Card>

                <Card className="p-4 text-center hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-center mb-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <DollarSign className="h-4 w-4 text-blue-600" />
                        </div>
                    </div>
                    <div className={`text-2xl font-bold ${netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {statsLoading ? <Skeleton className="h-6 w-16 mx-auto" /> : `₪${netIncome.toLocaleString()}`}
                    </div>
                    <div className="text-sm text-gray-600">Net Income</div>
                </Card>

                <Card className="p-4 text-center hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-center mb-2">
                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                            <PieChart className="h-4 w-4 text-purple-600" />
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-purple-600">
                        {statsLoading ? <Skeleton className="h-6 w-16 mx-auto" /> : totalTransactions}
                    </div>
                    <div className="text-sm text-gray-600">Transactions</div>
                </Card>
            </div>

            {/* Recent Activity */}
            <Card className="mx-4">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <TrendingUp className="text-blue-600" />
                            <CardTitle>Recent Financial Activity</CardTitle>
                        </div>
                        <Button variant="outline" size="sm">
                            View All Transactions
                        </Button>
                    </div>
                    <CardDescription>Your latest income and expense transactions</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {transactionsLoading ? (
                            Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                                    <div className="flex items-center gap-3">
                                        <Skeleton className="h-8 w-8 rounded-full" />
                                        <div>
                                            <Skeleton className="h-4 w-24 mb-1" />
                                            <Skeleton className="h-3 w-16" />
                                        </div>
                                    </div>
                                    <Skeleton className="h-5 w-20" />
                                </div>
                            ))
                        ) : recentTransactions && recentTransactions.transactions.length > 0 ? (
                            recentTransactions.transactions.map((transaction) => (
                                <div key={transaction._id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
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
                                            <p className="font-medium text-gray-900">{transaction.title}</p>
                                            <p className="text-sm text-gray-500 flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                {new Date(transaction.date).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className={`font-semibold ${
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
                                <p className="text-gray-500">No transactions yet</p>
                                <p className="text-gray-400 text-sm">Start adding income and expenses to see your activity here</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Account Summary */}
            <Card className="mx-4">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <DollarSign className="text-blue-600" />
                        <CardTitle>My Accounts</CardTitle>
                    </div>
                    <CardDescription>Overview of your financial accounts</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {accountsLoading ? (
                            Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="p-4 border rounded-lg">
                                    <Skeleton className="h-5 w-32 mb-2" />
                                    <Skeleton className="h-4 w-24 mb-1" />
                                    <Skeleton className="h-6 w-20" />
                                </div>
                            ))
                        ) : accounts && accounts.length > 0 ? (
                            accounts.slice(0, 4).map((account) => (
                                <div key={account._id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="font-semibold text-gray-900">{account.name}</h3>
                                        <Badge variant="outline" className={account.isActive ? "bg-green-50 text-green-700" : "bg-gray-50 text-gray-700"}>
                                            {account.isActive ? 'Active' : 'Inactive'}
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-1">{account.type.replace('_', ' ').toUpperCase()}</p>
                                    <p className="text-lg font-bold text-blue-600">
                                        ₪{account.currentBalance.toLocaleString()}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-2 text-center py-8">
                                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <DollarSign className="h-6 w-6 text-gray-400" />
                                </div>
                                <p className="text-gray-500">No accounts set up yet</p>
                                <p className="text-gray-400 text-sm mb-4">Add your first account to start tracking your finances</p>
                                <Button 
                                    onClick={() => setIsAccountModalOpen(true)}
                                    className="bg-blue-600 hover:bg-blue-700"
                                >
                                    Add Your First Account
                                </Button>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
            
            {/* Account Modal */}
            <AccountModal 
                isOpen={isAccountModalOpen} 
                onClose={() => setIsAccountModalOpen(false)} 
            />
        </div>
    );
}
