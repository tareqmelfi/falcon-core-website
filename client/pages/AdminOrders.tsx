import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Package, Search, Filter, Clock, CheckCircle, AlertCircle,
  Eye, Edit, Mail, Phone, Building2, MessageSquare, Globe,
  ArrowUpDown, MoreHorizontal, User, Calendar, DollarSign
} from 'lucide-react';
import { AdminLayout } from '@/components/AdminLayout';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from '@/components/ui/card';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Dialog, DialogContent, DialogDescription, DialogHeader,
  DialogTitle, DialogTrigger, DialogFooter
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

// Order status types
type OrderStatus = 'new' | 'data_received' | 'in_progress' | 'review' | 'completed' | 'cancelled';

// Product icons mapping
const productIcons: Record<string, React.ComponentType<any>> = {
  'FC-ADV-001': MessageSquare,
  'FC-FORM-001': Building2,
  'FC-WEB-001': Globe,
};

// Status colors
const statusColors: Record<OrderStatus, string> = {
  new: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  data_received: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  in_progress: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  review: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  completed: 'bg-green-500/10 text-green-500 border-green-500/20',
  cancelled: 'bg-red-500/10 text-red-500 border-red-500/20',
};

// Status labels
const statusLabels: Record<OrderStatus, string> = {
  new: 'New',
  data_received: 'Data Received',
  in_progress: 'In Progress',
  review: 'Under Review',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

// Mock orders data (would come from API)
const mockOrders = [
  {
    id: 'ORD-2026-001',
    customerName: 'Ahmed Al-Rashid',
    customerEmail: 'ahmed@example.com',
    customerPhone: '+966 50 123 4567',
    productCode: 'FC-FORM-001',
    productName: 'US LLC Formation',
    amount: 1200,
    status: 'in_progress' as OrderStatus,
    createdAt: '2026-01-20T10:30:00Z',
    updatedAt: '2026-01-22T14:45:00Z',
    dataSubmitted: true,
    formData: {
      companyName1: 'Rashid Holdings LLC',
      companyName2: 'Rashid Ventures LLC',
      companyName3: 'Rashid Group LLC',
      businessType: 'E-commerce',
      businessPurpose: 'Online retail and wholesale trading',
      needEIN: true,
      needBankAccount: true,
    },
    notes: 'Name search completed. Proceeding with filing.',
  },
  {
    id: 'ORD-2026-002',
    customerName: 'Sarah Johnson',
    customerEmail: 'sarah@example.com',
    customerPhone: '+1 555 123 4567',
    productCode: 'FC-WEB-001',
    productName: 'Website Package',
    amount: 3500,
    status: 'data_received' as OrderStatus,
    createdAt: '2026-01-21T08:15:00Z',
    updatedAt: '2026-01-21T16:30:00Z',
    dataSubmitted: true,
    formData: {
      projectDescription: 'E-commerce website for fashion brand',
      referenceWebsites: 'zara.com, hm.com',
      preferredColors: 'Black, White, Gold',
      hasLogo: true,
    },
    notes: '',
  },
  {
    id: 'ORD-2026-003',
    customerName: 'Mohammed Hassan',
    customerEmail: 'mhassn@example.com',
    customerPhone: '+966 55 987 6543',
    productCode: 'FC-ADV-001',
    productName: 'Advisory Session',
    amount: 250,
    status: 'new' as OrderStatus,
    createdAt: '2026-01-23T09:00:00Z',
    updatedAt: '2026-01-23T09:00:00Z',
    dataSubmitted: false,
    formData: {},
    notes: '',
  },
];

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  productCode: string;
  productName: string;
  amount: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  dataSubmitted: boolean;
  formData: Record<string, any>;
  notes: string;
}

export const AdminOrders = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, logout, email } = useAdminAuth();
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<OrderStatus>('new');
  const [statusNote, setStatusNote] = useState('');

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/admin/login');
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Stats
  const stats = {
    total: orders.length,
    new: orders.filter(o => o.status === 'new').length,
    inProgress: orders.filter(o => o.status === 'in_progress' || o.status === 'data_received').length,
    completed: orders.filter(o => o.status === 'completed').length,
  };

  const handleStatusUpdate = () => {
    if (selectedOrder) {
      setOrders(prev => prev.map(order =>
        order.id === selectedOrder.id
          ? { ...order, status: newStatus, notes: statusNote, updatedAt: new Date().toISOString() }
          : order
      ));
      setIsStatusDialogOpen(false);
      setStatusNote('');
    }
  };

  const openDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailsOpen(true);
  };

  const openStatusDialog = (order: Order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setStatusNote(order.notes);
    setIsStatusDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <AdminLayout onLogout={logout} email={email}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Order Management</h1>
            <p className="text-muted-foreground">View and manage customer orders</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Package className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.total}</p>
                  <p className="text-xs text-muted-foreground">Total Orders</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-yellow-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.new}</p>
                  <p className="text-xs text-muted-foreground">New Orders</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.inProgress}</p>
                  <p className="text-xs text-muted-foreground">In Progress</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.completed}</p>
                  <p className="text-xs text-muted-foreground">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="data_received">Data Received</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="review">Under Review</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Orders Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => {
                  const ProductIcon = productIcons[order.productCode] || Package;
                  return (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono text-sm">{order.id}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{order.customerName}</p>
                          <p className="text-xs text-muted-foreground">{order.customerEmail}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <ProductIcon className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">{order.productName}</span>
                        </div>
                      </TableCell>
                      <TableCell>${order.amount}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={statusColors[order.status]}>
                          {statusLabels[order.status]}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => openDetails(order)}>
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openStatusDialog(order)}>
                              <Edit className="w-4 h-4 mr-2" />
                              Update Status
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Mail className="w-4 h-4 mr-2" />
                              Send Email
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Order Details Dialog */}
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Order Details</DialogTitle>
              <DialogDescription>
                {selectedOrder?.id} • {selectedOrder?.productName}
              </DialogDescription>
            </DialogHeader>
            {selectedOrder && (
              <div className="space-y-6">
                {/* Customer Info */}
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Customer Information
                  </h4>
                  <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-muted/50">
                    <div>
                      <p className="text-xs text-muted-foreground">Name</p>
                      <p className="font-medium">{selectedOrder.customerName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Email</p>
                      <p className="font-medium">{selectedOrder.customerEmail}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Phone</p>
                      <p className="font-medium">{selectedOrder.customerPhone}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Amount</p>
                      <p className="font-medium">${selectedOrder.amount}</p>
                    </div>
                  </div>
                </div>

                {/* Form Data */}
                {selectedOrder.dataSubmitted && Object.keys(selectedOrder.formData).length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Package className="w-4 h-4" />
                      Submitted Information
                    </h4>
                    <div className="p-4 rounded-lg bg-muted/50 space-y-3">
                      {Object.entries(selectedOrder.formData).map(([key, value]) => (
                        <div key={key}>
                          <p className="text-xs text-muted-foreground capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </p>
                          <p className="font-medium">
                            {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Status & Notes */}
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Status & Notes
                  </h4>
                  <div className="p-4 rounded-lg bg-muted/50 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Current Status</span>
                      <Badge variant="outline" className={statusColors[selectedOrder.status]}>
                        {statusLabels[selectedOrder.status]}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Notes</p>
                      <p className="text-sm">{selectedOrder.notes || 'No notes added'}</p>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground pt-2 border-t">
                      <span>Created: {new Date(selectedOrder.createdAt).toLocaleString()}</span>
                      <span>Updated: {new Date(selectedOrder.updatedAt).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>
                Close
              </Button>
              <Button onClick={() => {
                setIsDetailsOpen(false);
                openStatusDialog(selectedOrder!);
              }}>
                Update Status
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Update Status Dialog */}
        <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Order Status</DialogTitle>
              <DialogDescription>
                {selectedOrder?.id} • {selectedOrder?.customerName}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>New Status</Label>
                <Select value={newStatus} onValueChange={(v) => setNewStatus(v as OrderStatus)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="data_received">Data Received</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="review">Under Review</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Notes (Internal)</Label>
                <Textarea
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  placeholder="Add notes about this status update..."
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsStatusDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleStatusUpdate}>
                Update Status
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminOrders;
