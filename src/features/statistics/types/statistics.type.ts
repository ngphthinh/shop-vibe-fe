export interface TopProduct {
  rank: number;
  productId: string;
  productName: string;
  thumbnail: string;
  totalQuantitySold: number;
  totalRevenue: number;
}

export interface TopProductResponse {
  limit: number;
  data: TopProduct[];
}

export interface TopCustomer {
  rank: number;
  customerId: string;
  fullName: string;
  email: string;
  totalSpent: number;
}

export interface TopCustomerResponse {
  limit: number;
  data: TopCustomer[];
}

export interface OrdersByStatus {
  pending: number;
  confirmed: number;
  shipping: number;
  delivered: number;
  cancelled: number;
}
export interface TimeStats {
  revenue: number | null;
  orders: number | null;
  newCustomers: number | null;
}
export interface ThisMonthStats extends TimeStats {
  ordersByStatus: OrdersByStatus;
}
export interface AllTimeStats {
  totalProducts: number;
  totalCustomers: number;
  totalOrders: number;
}
export interface ActiveOrders {
  pending: number;
  confirmed: number;
  shipping: number;
}
export interface OverviewResponse {
  generatedAt: string;
  today: TimeStats;
  thisMonth: ThisMonthStats;
  allTime: AllTimeStats;
  activeOrders: ActiveOrders;
}
export interface RevenuePoint {
  date: string;
  revenue: number;
}
export interface RevenueResponse {
  from: string;
  to: string;
  totalRevenue: number;
  data: RevenuePoint[];
}
