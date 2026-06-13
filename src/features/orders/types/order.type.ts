export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "SHIPPING"
  | "DELIVERED"
  | "CANCELLED";

export type OrderStatusFilter = OrderStatus | "ALL";

export const ORDER_STATUS_LABEL: Record<OrderStatusFilter, string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  SHIPPING: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
  ALL: "All",
};
export type PaymentMethod = "COD" | "BANK_TRANSFER" | "MOMO" | "VNPAY";

export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";

export interface OrderItem {
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Payment {
  method: PaymentMethod;
  status: PaymentStatus;
}

export interface Order {
  id: number;
  orderCode: string;
  status: OrderStatus;
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: string;
  payment: Payment;
  note: string;
  createdAt: string;
}

export interface OrderSummary {
  id: number;
  orderCode: string;
  status: OrderStatus;
  totalAmount: number;
  shippingAddress: string;
  itemCount: number;
  createdAt: string;
  customerName?: string;
  payment: {
    method: string;
    status: string;
  };
}
export interface CreateOrderRequest {
  shippingAddress: string;
  note: string;
  paymentMethod: PaymentMethod;
}

export interface OrderItem {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  thumbnailUrl: string;
}

export interface OrderDetail {
  id: number;
  orderCode: string;
  status: OrderStatus;
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: string;
  note: string;
  customerName?: string;
  createdAt: string;
  payment: {
    method: string;
    status: string;
  };
}
export const VALID_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["SHIPPING", "CANCELLED"],
  SHIPPING: ["DELIVERED", "CANCELLED"],
  DELIVERED: [],
  CANCELLED: [],
};

export const STATUS_LABEL: Record<OrderStatus, string> = {
  PENDING: "table.actions.pending",
  CONFIRMED: "table.actions.confirmed",
  SHIPPING: "table.actions.ship",
  DELIVERED: "table.actions.delivered",
  CANCELLED: "table.actions.cancel",
};
