import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BarChart3, Package, TrendingUp, AlertTriangle, Settings, Home } from 'lucide-react';
import PrivateRoute from '../components/PrivateRoute';

const Analytics = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/dashboard');
      return;
    }
    fetchAnalytics();
  }, [user, navigate]);

  const fetchAnalytics = async () => {
    try {
      const response = await api.get('/analytics');
      setAnalytics(response.data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  const categoryData = analytics?.categoryData
    ? Object.entries(analytics.categoryData).map(([name, value]) => ({ name, value }))
    : [];

  const dailyChangesData = analytics?.dailyChanges
    ? Object.entries(analytics.dailyChanges)
        .map(([date, data]) => ({
          date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          added: data.added,
          removed: data.removed
        }))
        .sort((a, b) => new Date(a.date) - new Date(b.date))
    : [];

  const activityData = analytics?.activityCounts
    ? Object.entries(analytics.activityCounts)
        .filter(([_, value]) => value > 0)
        .map(([name, value]) => ({ name, value }))
    : [];

  if (user?.role !== 'admin') {
    return null;
  }

  return (
    <PrivateRoute requireAdmin={true}>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <BarChart3 className="h-6 w-6" />
              <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              {user?.role === 'admin' && (
                <Button
                  variant="outline"
                  onClick={() => navigate('/dashboard')}
                  className="flex items-center gap-2"
                >
                  <Home className="h-4 w-4" />
                  Dashboard
                </Button>
              )}
              <Button
                variant="outline"
                onClick={() => navigate('/settings')}
                className="flex items-center gap-2"
              >
                <Settings className="h-4 w-4" />
                Settings
              </Button>
            </div>
          </div>
        </nav>

        <div className="container mx-auto px-4 py-8">
          {loading ? (
            <div className="text-center py-12">Loading analytics...</div>
          ) : !analytics ? (
            <div className="text-center py-12">No data available</div>
          ) : (
            <>
              {/* Summary Cards */}
              <div className="grid md:grid-cols-4 gap-6 mb-8">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Items</CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analytics.totalItems}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Quantity</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analytics.totalQuantity}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-yellow-600">{analytics.lowStockItems}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Categories</CardTitle>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{Object.keys(analytics.categoryData || {}).length}</div>
                  </CardContent>
                </Card>
              </div>

              {/* Charts */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {/* Category Distribution */}
                <Card>
                  <CardHeader>
                    <CardTitle>Inventory by Category</CardTitle>
                    <CardDescription>Distribution of items across categories</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {categoryData.length > 0 ? (
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
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <p className="text-center text-muted-foreground py-12">No category data available</p>
                    )}
                  </CardContent>
                </Card>

                {/* Activity Distribution */}
                <Card>
                  <CardHeader>
                    <CardTitle>Activity Distribution</CardTitle>
                    <CardDescription>Recent stock activities</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {activityData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={activityData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="value" fill="#8884d8" />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <p className="text-center text-muted-foreground py-12">No activity data available</p>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Daily Changes Chart */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Stock Changes (Last 7 Days)</CardTitle>
                  <CardDescription>Daily stock additions and removals</CardDescription>
                </CardHeader>
                <CardContent>
                  {dailyChangesData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={dailyChangesData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="added" stroke="#00C49F" strokeWidth={2} />
                        <Line type="monotone" dataKey="removed" stroke="#FF8042" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-center text-muted-foreground py-12">No daily changes data available</p>
                  )}
                </CardContent>
              </Card>

              {/* Low Stock Items */}
              {analytics.lowStockItemsList && analytics.lowStockItemsList.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Low Stock Alert</CardTitle>
                    <CardDescription>Items that need restocking</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {analytics.lowStockItemsList.map((item) => (
                        <div key={item.id} className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                          <div>
                            <p className="font-semibold">{item.name}</p>
                            <p className="text-sm text-muted-foreground">
                              Current: {item.quantity} | Min: {item.minStockLevel}
                            </p>
                          </div>
                          <AlertTriangle className="h-5 w-5 text-yellow-600" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </div>
    </PrivateRoute>
  );
};

export default Analytics;

