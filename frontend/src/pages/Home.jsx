import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Package, TrendingUp, Users, BarChart3 } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Inventory Management System
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Efficiently manage your inventory with real-time tracking and analytics
          </p>
          <Button
            onClick={() => navigate('/login')}
            size="lg"
            className="text-lg px-8 py-6"
          >
            Get Started
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
          <Card>
            <CardHeader>
              <Package className="h-8 w-8 text-blue-600 mb-2" />
              <CardTitle>Stock Management</CardTitle>
              <CardDescription>
                Add, update, and remove inventory items with ease
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <TrendingUp className="h-8 w-8 text-green-600 mb-2" />
              <CardTitle>Real-time Updates</CardTitle>
              <CardDescription>
                Get instant notifications for stock changes and low inventory
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <BarChart3 className="h-8 w-8 text-purple-600 mb-2" />
              <CardTitle>Analytics Dashboard</CardTitle>
              <CardDescription>
                Visualize your inventory data with comprehensive charts and reports
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Users className="h-8 w-8 text-orange-600 mb-2" />
              <CardTitle>Role-based Access</CardTitle>
              <CardDescription>
                Secure access control with admin and staff roles
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="mt-16 text-center">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Why Choose Our System?</CardTitle>
            </CardHeader>
            <CardContent className="text-left space-y-4">
              <div>
                <h3 className="font-semibold mb-2">✓ Simple and Intuitive</h3>
                <p className="text-muted-foreground">
                  Clean interface designed for ease of use
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">✓ Complete History Tracking</h3>
                <p className="text-muted-foreground">
                  Track every stock movement with detailed history
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">✓ Smart Notifications</h3>
                <p className="text-muted-foreground">
                  Get alerted when stock is low, added, or removed
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Home;

