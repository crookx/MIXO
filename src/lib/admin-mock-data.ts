// Static mock data for the admin section

export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: 'active' | 'archived';
  createdAt: Date;
};

export const mockProducts: Product[] = [
  { id: '1', name: 'Cybernetic Hoodie', category: 'Outerwear', price: 120, stock: 50, status: 'active', createdAt: new Date('2024-01-15') },
  { id: '2', name: 'Quantum Weave Jacket', category: 'Outerwear', price: 250, stock: 30, status: 'active', createdAt: new Date('2024-01-20') },
  { id: '3', name: 'Zero-G Sneakers', category: 'Footwear', price: 180, stock: 75, status: 'active', createdAt: new Date('2024-02-01') },
  { id: '4', name: 'Plasma Mesh Tee', category: 'Tops', price: 75, stock: 120, status: 'active', createdAt: new Date('2024-02-10') },
  { id: '5', name: 'Gravity Boots', category: 'Footwear', price: 220, stock: 40, status: 'active', createdAt: new Date('2024-02-15') },
  { id: '6', name: 'Holo-Visor', category: 'Accessories', price: 95, stock: 60, status: 'active', createdAt: new Date('2024-03-01') },
  { id: '7', name: 'Stealth Cloak', category: 'Outerwear', price: 450, stock: 15, status: 'active', createdAt: new Date('2024-03-05') },
  { id: '8', name: 'Kinetic Gloves', category: 'Accessories', price: 60, stock: 90, status: 'archived', createdAt: new Date('2023-12-10') },
  { id: '9', name: 'Cryo-Cooled Vest', category: 'Tops', price: 190, stock: 55, status: 'active', createdAt: new Date('2024-03-20') },
  { id: '10', name: 'Neural Interface Band', category: 'Accessories', price: 110, stock: 0, status: 'active', createdAt: new Date('2024-04-01') },
  { id: '11', name: 'Reactive Cargo Pants', category: 'Bottoms', price: 140, stock: 65, status: 'active', createdAt: new Date('2024-04-05') },
  { id: '12', name: 'Orbital Watch', category: 'Accessories', price: 300, stock: 25, status: 'archived', createdAt: new Date('2023-11-15') },
];


export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export type Order = {
  id: string;
  customerName: string;
  customerEmail: string;
  total: number;
  status: OrderStatus;
  createdAt: Date;
};

export const mockOrders: Order[] = [
  { id: 'ORD-001', customerName: 'Alex Nova', customerEmail: 'alex.n@email.com', total: 195.50, status: 'delivered', createdAt: new Date('2024-04-20') },
  { id: 'ORD-002', customerName: 'Jara Kaito', customerEmail: 'j.kaito@email.com', total: 250.00, status: 'shipped', createdAt: new Date('2024-04-28') },
  { id: 'ORD-003', customerName: 'Rylan Synth', customerEmail: 'rsynth@email.com', total: 75.00, status: 'processing', createdAt: new Date('2024-05-01') },
  { id: 'ORD-004', customerName: 'Lyra Circuits', customerEmail: 'lyra.c@email.com', total: 450.00, status: 'pending', createdAt: new Date('2024-05-02') },
  { id: 'ORD-005', customerName: 'Zane Matrix', customerEmail: 'z.matrix@email.com', total: 180.00, status: 'delivered', createdAt: new Date('2024-04-15') },
  { id: 'ORD-006', customerName: 'Cyra Volt', customerEmail: 'cyra.v@email.com', total: 300.00, status: 'cancelled', createdAt: new Date('2024-04-10') },
  { id: 'ORD-007', customerName: 'Kael Nexus', customerEmail: 'kaeln@email.com', total: 120.00, status: 'shipped', createdAt: new Date('2024-04-25') },
  { id: 'ORD-008', customerName: 'Vesper Glitch', customerEmail: 'v_glitch@email.com', total: 95.00, status: 'processing', createdAt: new Date('2024-05-01') },
];


export type Customer = {
  id: string;
  name: string;
  email: string;
  totalOrders: number;
  totalSpent: number;
  joinedAt: Date;
};

export const mockCustomers: Customer[] = [
  { id: 'CUST-001', name: 'Alex Nova', email: 'alex.n@email.com', totalOrders: 3, totalSpent: 450.75, joinedAt: new Date('2023-10-01') },
  { id: 'CUST-002', name: 'Jara Kaito', email: 'j.kaito@email.com', totalOrders: 1, totalSpent: 250.00, joinedAt: new Date('2024-01-15') },
  { id: 'CUST-003', name: 'Rylan Synth', email: 'rsynth@email.com', totalOrders: 5, totalSpent: 1050.20, joinedAt: new Date('2023-11-20') },
  { id: 'CUST-004', name: 'Lyra Circuits', email: 'lyra.c@email.com', totalOrders: 2, totalSpent: 525.00, joinedAt: new Date('2024-03-01') },
  { id: 'CUST-005', name: 'Zane Matrix', email: 'z.matrix@email.com', totalOrders: 8, totalSpent: 1280.90, joinedAt: new Date('2023-09-05') },
  { id: 'CUST-006', name: 'Cyra Volt', email: 'cyra.v@email.com', totalOrders: 1, totalSpent: 300.00, joinedAt: new Date('2024-04-02') },
  { id: 'CUST-007', name: 'Kael Nexus', email: 'kaeln@email.com', totalOrders: 4, totalSpent: 670.00, joinedAt: new Date('2023-12-12') },
  { id: 'CUST-008', name: 'Vesper Glitch', email: 'v_glitch@email.com', totalOrders: 2, totalSpent: 190.50, joinedAt: new Date('2024-02-22') },
];

// Dashboard data
export const dashboardStats = {
  totalSales: mockOrders.filter(o => o.status !== 'cancelled').reduce((sum, order) => sum + order.total, 0),
  totalOrders: mockOrders.length,
  activeProducts: mockProducts.filter(p => p.status === 'active').length,
  totalCustomers: mockCustomers.length,
};

// Example chart data (Monthly Sales)
export const salesData = [
  { month: "Jan", sales: Math.floor(Math.random() * 5000) + 1000 },
  { month: "Feb", sales: Math.floor(Math.random() * 5000) + 1000 },
  { month: "Mar", sales: Math.floor(Math.random() * 5000) + 1000 },
  { month: "Apr", sales: Math.floor(Math.random() * 5000) + 1000 },
  { month: "May", sales: Math.floor(Math.random() * 5000) + 1000 },
  { month: "Jun", sales: Math.floor(Math.random() * 5000) + 1000 },
];

// Example chart data (Order Status Distribution)
export const orderStatusData = mockOrders.reduce((acc, order) => {
  const status = order.status;
  acc[status] = (acc[status] || 0) + 1;
  return acc;
}, {} as Record<OrderStatus, number>);

export const orderStatusChartData = Object.entries(orderStatusData).map(([status, count]) => ({
  status: status.charAt(0).toUpperCase() + status.slice(1), // Capitalize
  count: count,
  fill: `var(--chart-${Object.keys(orderStatusData).indexOf(status) + 1})` // Assign chart colors
}));


