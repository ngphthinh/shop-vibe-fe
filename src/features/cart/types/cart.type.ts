export interface CartProduct {
  id: number;
  name: string;
  price: number;
  primaryImageUrl: string;
}

export interface CartItem {
  id: number;
  product: CartProduct;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Cart {
  id: number;
  totalAmount: number;
  totalItems: number;
  items: CartItem[];
}

export interface AddToCartRequest {
  productId: number;
  quantity: number;
}

