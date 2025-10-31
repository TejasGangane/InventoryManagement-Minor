import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../lib/api';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/Dialog';
import { Plus, Trash2, Edit, History, BarChart3, Settings, Package, AlertCircle } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    quantity: '',
    category: '',
    price: '',
    minStockLevel: ''
  });

  useEffect(() => {
    if (user?.role === 'admin') {
      navigate('/analytics');
      return;
    }
    fetchItems();
    fetchHistory();
  }, [user, navigate]);

  const fetchItems = async () => {
    try {
      const response = await api.get('/inventory');
      setItems(response.data);
      checkLowStock(response.data);
    } catch (error) {
      showToast('Failed to fetch inventory', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    try {
      const response = await api.get('/inventory/history/all');
      setHistory(response.data);
    } catch (error) {
      console.error('Failed to fetch history:', error);
    }
  };

  const checkLowStock = (items) => {
    items.forEach(item => {
      if (item.quantity <= item.minStockLevel && item.quantity > 0) {
        showToast(`${item.name} is running low!`, 'warning');
      } else if (item.quantity === 0) {
        showToast(`${item.name} is out of stock!`, 'error');
      }
    });
  };

  const handleOpenDialog = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name,
        description: item.description || '',
        quantity: item.quantity.toString(),
        category: item.category || '',
        price: item.price?.toString() || '',
        minStockLevel: item.minStockLevel?.toString() || '0'
      });
    } else {
      setEditingItem(null);
      setFormData({
        name: '',
        description: '',
        quantity: '',
        category: '',
        price: '',
        minStockLevel: ''
      });
    }
    setDialogOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        quantity: parseInt(formData.quantity),
        price: formData.price ? parseFloat(formData.price) : undefined,
        minStockLevel: parseInt(formData.minStockLevel || '0')
      };

      if (editingItem) {
        await api.put(`/inventory/${editingItem._id}`, payload);
        showToast('Item updated successfully', 'success');
      } else {
        await api.post('/inventory', payload);
        showToast('Item added successfully', 'success');
      }

      setDialogOpen(false);
      fetchItems();
      fetchHistory();
      setFormData({
        name: '',
        description: '',
        quantity: '',
        category: '',
        price: '',
        minStockLevel: ''
      });
    } catch (error) {
      showToast(error.response?.data?.message || 'Operation failed', 'error');
    }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) return;

    try {
      await api.delete(`/inventory/${id}`);
      showToast('Item deleted successfully', 'success');
      fetchItems();
      fetchHistory();
    } catch (error) {
      showToast('Failed to delete item', 'error');
    }
  };

  const handleQuantityChange = async (item, change) => {
    try {
      const newQuantity = Math.max(0, item.quantity + change);
      await api.put(`/inventory/${item._id}`, {
        ...item,
        quantity: newQuantity
      });

      if (change > 0) {
        showToast(`Stock added for ${item.name}`, 'success');
      } else {
        showToast(`Stock removed for ${item.name}`, 'success');
      }

      fetchItems();
      fetchHistory();
    } catch (error) {
      showToast('Failed to update quantity', 'error');
    }
  };

  if (user?.role === 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Package className="h-6 w-6" />
            <h1 className="text-2xl font-bold">Inventory Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => navigate('/analytics')}
              className="flex items-center gap-2"
            >
              <BarChart3 className="h-4 w-4" />
              Analytics
            </Button>
            <Button
              variant="outline"
              onClick={() => setHistoryDialogOpen(true)}
              className="flex items-center gap-2"
            >
              <History className="h-4 w-4" />
              History
            </Button>
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
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Inventory Items</h2>
          <Button onClick={() => handleOpenDialog()} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Item
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : items.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No items in inventory. Add your first item!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <Card key={item._id} className={item.quantity <= item.minStockLevel ? 'border-yellow-500' : ''}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-xl">{item.name}</CardTitle>
                      {item.category && (
                        <CardDescription className="mt-1">{item.category}</CardDescription>
                      )}
                    </div>
                    {item.quantity <= item.minStockLevel && (
                      <AlertCircle className="h-5 w-5 text-yellow-500" />
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {item.description && (
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    )}
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Quantity:</span>
                      <span className={`text-lg ${item.quantity === 0 ? 'text-red-500' : item.quantity <= item.minStockLevel ? 'text-yellow-500' : 'text-green-500'}`}>
                        {item.quantity}
                      </span>
                    </div>
                    {item.minStockLevel > 0 && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Min Level:</span>
                        <span>{item.minStockLevel}</span>
                      </div>
                    )}
                    {item.price && (
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Price:</span>
                        <span className="font-semibold">${item.price}</span>
                      </div>
                    )}
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuantityChange(item, -1)}
                        className="flex-1"
                      >
                        Remove
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuantityChange(item, 1)}
                        className="flex-1"
                      >
                        Add
                      </Button>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenDialog(item)}
                        className="flex-1 flex items-center justify-center gap-2"
                      >
                        <Edit className="h-4 w-4" />
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(item._id, item.name)}
                        className="flex-1 flex items-center justify-center gap-2"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent onClose={() => setDialogOpen(false)}>
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Edit Item' : 'Add New Item'}</DialogTitle>
            <DialogDescription>
              {editingItem ? 'Update the item details below' : 'Fill in the details to add a new item'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Name *</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Description</label>
              <Input
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Quantity *</label>
                <Input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  required
                  min="0"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Category</label>
                <Input
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Price</label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  min="0"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Min Stock Level</label>
                <Input
                  type="number"
                  value={formData.minStockLevel}
                  onChange={(e) => setFormData({ ...formData, minStockLevel: e.target.value })}
                  min="0"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {editingItem ? 'Update' : 'Add'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* History Dialog */}
      <Dialog open={historyDialogOpen} onOpenChange={setHistoryDialogOpen}>
        <DialogContent onClose={() => setHistoryDialogOpen(false)} className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Stock History</DialogTitle>
            <DialogDescription>
              View all stock movements and changes
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            {history.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No history available</p>
            ) : (
              history.map((record) => (
                <Card key={record._id} className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">{record.inventoryName}</p>
                      <p className="text-sm text-muted-foreground">
                        {record.action} by {record.username}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(record.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${
                        record.action === 'added' || record.action === 'created'
                          ? 'text-green-600'
                          : record.action === 'removed' || record.action === 'deleted'
                          ? 'text-red-600'
                          : 'text-blue-600'
                      }`}>
                        {record.action === 'added' || record.action === 'created' ? '+' : '-'}
                        {record.quantity}
                      </p>
                      {record.previousQuantity !== undefined && (
                        <p className="text-xs text-muted-foreground">
                          Previous: {record.previousQuantity}
                        </p>
                      )}
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;

