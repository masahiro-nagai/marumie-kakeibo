import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  ComposedChart,
  Area,
  AreaChart
} from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Calendar, Target } from 'lucide-react';

interface Transaction {
  id: string;
  amount: number;
  type: 'expense' | 'income';
  category_id: string;
  date: string;
  description?: string;
}

interface Category {
  id: string;
  name: string;
  color: string;
}

interface OverallAnalysisProps {
  transactions: Transaction[];
  categories: Category[];
}

export default function OverallAnalysis({ transactions, categories }: OverallAnalysisProps) {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');
  const [balanceData, setBalanceData] = useState<any[]>([]);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    transactionCount: 0
  });

  useEffect(() => {
    calculateOverallData();
  }, [transactions, timeRange]);

  const calculateOverallData = () => {
    const now = new Date();
    const startDate = new Date();
    
    switch (timeRange) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    // 期間内の取引をフィルタリング
    const periodTransactions = transactions.filter(t => 
      new Date(t.date) >= startDate
    );

    // 収支計算
    const totalIncome = periodTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpense = periodTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    setSummary({
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      transactionCount: periodTransactions.length
    });

    // 日別収支データ
    const dailyData = new Map();
    periodTransactions.forEach(transaction => {
      const date = new Date(transaction.date).toISOString().split('T')[0];
      const existing = dailyData.get(date) || { 
        date, 
        income: 0, 
        expense: 0, 
        balance: 0 
      };
      
      if (transaction.type === 'income') {
        existing.income += transaction.amount;
      } else {
        existing.expense += transaction.amount;
      }
      
      existing.balance = existing.income - existing.expense;
      dailyData.set(date, existing);
    });

    const dailyArray = Array.from(dailyData.values())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    setBalanceData(dailyArray);

    // 月別データ（過去12ヶ月）
    const monthlyMap = new Map();
    const last12Months = [];
    for (let i = 11; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      last12Months.push(monthKey);
      monthlyMap.set(monthKey, { 
        month: monthKey, 
        income: 0, 
        expense: 0, 
        balance: 0 
      });
    }

    periodTransactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const existing = monthlyMap.get(monthKey);
      if (existing) {
        if (transaction.type === 'income') {
          existing.income += transaction.amount;
        } else {
          existing.expense += transaction.amount;
        }
        existing.balance = existing.income - existing.expense;
      }
    });

    setMonthlyData(Array.from(monthlyMap.values()));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <DollarSign className="h-6 w-6 text-blue-500" />
          総合分析
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setTimeRange('week')}
            className={`px-3 py-1 rounded-md text-sm ${
              timeRange === 'week' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            週間
          </button>
          <button
            onClick={() => setTimeRange('month')}
            className={`px-3 py-1 rounded-md text-sm ${
              timeRange === 'month' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            月間
          </button>
          <button
            onClick={() => setTimeRange('year')}
            className={`px-3 py-1 rounded-md text-sm ${
              timeRange === 'year' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            年間
          </button>
        </div>
      </div>

      {/* サマリーカード */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">総収入</p>
              <p className="text-2xl font-bold text-green-600">
                ¥{summary.totalIncome.toLocaleString()}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-500" />
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">総支出</p>
              <p className="text-2xl font-bold text-red-600">
                ¥{summary.totalExpense.toLocaleString()}
              </p>
            </div>
            <TrendingDown className="h-8 w-8 text-red-500" />
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">収支</p>
              <p className={`text-2xl font-bold ${
                summary.balance >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                ¥{summary.balance.toLocaleString()}
              </p>
            </div>
            <DollarSign className={`h-8 w-8 ${
              summary.balance >= 0 ? 'text-green-500' : 'text-red-500'
            }`} />
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">取引数</p>
              <p className="text-2xl font-bold text-gray-900">
                {summary.transactionCount}件
              </p>
            </div>
            <Target className="h-8 w-8 text-blue-500" />
          </div>
        </Card>
      </div>

      <Tabs defaultValue="balance" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="balance">収支推移</TabsTrigger>
          <TabsTrigger value="monthly">月別分析</TabsTrigger>
        </TabsList>

        <TabsContent value="balance" className="space-y-4">
          {balanceData.length > 0 ? (
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">日別収支推移</h3>
              <ResponsiveContainer width="100%" height={400}>
                <ComposedChart data={balanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [
                      `¥${value.toLocaleString()}`, 
                      name === 'income' ? '収入' : name === 'expense' ? '支出' : '収支'
                    ]} 
                  />
                  <Bar dataKey="income" fill="#10B981" name="income" />
                  <Bar dataKey="expense" fill="#EF4444" name="expense" />
                  <Line type="monotone" dataKey="balance" stroke="#3B82F6" strokeWidth={2} name="balance" />
                </ComposedChart>
              </ResponsiveContainer>
            </Card>
          ) : (
            <Card className="p-6 text-center">
              <p className="text-gray-500">収支データがありません</p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="monthly" className="space-y-4">
          {monthlyData.length > 0 ? (
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">月別収支分析</h3>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [
                      `¥${value.toLocaleString()}`, 
                      name === 'income' ? '収入' : name === 'expense' ? '支出' : '収支'
                    ]} 
                  />
                  <Area type="monotone" dataKey="income" stackId="1" stroke="#10B981" fill="#10B981" />
                  <Area type="monotone" dataKey="expense" stackId="2" stroke="#EF4444" fill="#EF4444" />
                </AreaChart>
              </ResponsiveContainer>
            </Card>
          ) : (
            <Card className="p-6 text-center">
              <p className="text-gray-500">月別データがありません</p>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
