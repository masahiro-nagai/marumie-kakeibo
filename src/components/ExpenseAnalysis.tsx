import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { TrendingDown, Calendar, Tag } from 'lucide-react';

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

interface ExpenseAnalysisProps {
  transactions: Transaction[];
  categories: Category[];
}

const COLORS = ['#EF4444', '#3B82F6', '#8B5CF6', '#F59E0B', '#10B981', '#EC4899', '#06B6D4', '#6B7280'];

export default function ExpenseAnalysis({ transactions, categories }: ExpenseAnalysisProps) {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');
  const [expenseData, setExpenseData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [trendData, setTrendData] = useState<any[]>([]);

  useEffect(() => {
    calculateExpenseData();
  }, [transactions, categories, timeRange]);

  const calculateExpenseData = () => {
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

    // 支出のみをフィルタリング
    const expenses = transactions.filter(t => 
      t.type === 'expense' && 
      new Date(t.date) >= startDate
    );

    // カテゴリ別支出
    const categoryMap = new Map();
    expenses.forEach(expense => {
      const category = categories.find(c => c.id === expense.category_id);
      if (category) {
        const existing = categoryMap.get(category.id) || { name: category.name, value: 0, color: category.color };
        existing.value += expense.amount;
        categoryMap.set(category.id, existing);
      }
    });

    setCategoryData(Array.from(categoryMap.values()));

    // 日別支出トレンド
    const dailyExpenses = new Map();
    expenses.forEach(expense => {
      const date = new Date(expense.date).toISOString().split('T')[0];
      const existing = dailyExpenses.get(date) || { date, amount: 0 };
      existing.amount += expense.amount;
      dailyExpenses.set(date, existing);
    });

    const trendArray = Array.from(dailyExpenses.values())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    setTrendData(trendArray);

    // 週別/月別データ
    const periodData = new Map();
    expenses.forEach(expense => {
      const date = new Date(expense.date);
      let periodKey: string;
      
      if (timeRange === 'week') {
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        periodKey = weekStart.toISOString().split('T')[0];
      } else if (timeRange === 'month') {
        periodKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      } else {
        periodKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      }
      
      const existing = periodData.get(periodKey) || { period: periodKey, amount: 0 };
      existing.amount += expense.amount;
      periodData.set(periodKey, existing);
    });

    setExpenseData(Array.from(periodData.values()).sort((a, b) => a.period.localeCompare(b.period)));
  };

  const totalExpenses = categoryData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <TrendingDown className="h-6 w-6 text-red-500" />
          支出分析
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

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">概要</TabsTrigger>
          <TabsTrigger value="category">カテゴリ別</TabsTrigger>
          <TabsTrigger value="trend">トレンド</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">総支出</p>
                  <p className="text-2xl font-bold text-red-600">
                    ¥{totalExpenses.toLocaleString()}
                  </p>
                </div>
                <TrendingDown className="h-8 w-8 text-red-500" />
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">平均支出</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ¥{expenseData.length > 0 ? Math.round(totalExpenses / expenseData.length).toLocaleString() : 0}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-blue-500" />
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">取引数</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {transactions.filter(t => t.type === 'expense').length}件
                  </p>
                </div>
                <Tag className="h-8 w-8 text-green-500" />
              </div>
            </Card>
          </div>

          {expenseData.length > 0 && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">期間別支出</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={expenseData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`¥${value.toLocaleString()}`, '支出']} />
                  <Bar dataKey="amount" fill="#EF4444" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="category" className="space-y-4">
          {categoryData.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">カテゴリ別支出</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`¥${value.toLocaleString()}`, '支出']} />
                  </PieChart>
                </ResponsiveContainer>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">カテゴリ別詳細</h3>
                <div className="space-y-3">
                  {categoryData
                    .sort((a, b) => b.value - a.value)
                    .map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-4 h-4 rounded-full" 
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="font-medium">{item.name}</span>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">¥{item.value.toLocaleString()}</p>
                          <p className="text-sm text-gray-500">
                            {((item.value / totalExpenses) * 100).toFixed(1)}%
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </Card>
            </div>
          ) : (
            <Card className="p-6 text-center">
              <p className="text-gray-500">支出データがありません</p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="trend" className="space-y-4">
          {trendData.length > 0 ? (
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">支出トレンド</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`¥${value.toLocaleString()}`, '支出']} />
                  <Line type="monotone" dataKey="amount" stroke="#EF4444" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          ) : (
            <Card className="p-6 text-center">
              <p className="text-gray-500">トレンドデータがありません</p>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
