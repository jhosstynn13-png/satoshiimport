/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Product {
  id: string;
  name: string;
  sku: string;
  image: string;
  price: number;
  description: string;
  createdAt: number;
  sizes: string[];
  status: 'active' | 'discontinued';
}

export interface Model {
  id: string;
  name: string;
  products: Product[];
}

export interface Subcategory {
  id: string;
  name: string;
  models: Model[];
  products?: Product[]; // For backward compatibility migration
}

export interface Category {
  id: string;
  name: string;
  subcategories: Subcategory[];
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: number;
  createdAt: number;
}

export interface OrderItem {
  productId: string;
  name: string;
  sku?: string;
  quantity: number;
  price: number;
}

export type OrderStatus = 'pending' | 'picking' | 'packing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';

export type PaymentMethod = 'yape' | 'dale' | 'cash' | 'transfer' | 'card' | 'other';
export type BillingType = 'boleta' | 'factura' | 'ticket';

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  paymentMethod?: PaymentMethod;
  billingType?: BillingType;
  trackingNumber?: string;
  notes?: string;
  shippingDetails?: {
    departamento: string;
    localidad: string;
    zip: string;
    calle: string;
    numero: string;
    sinNumero: boolean;
    piso: string;
    calle1: string;
    calle2: string;
    sinEntrecalles: boolean;
    indicaciones: string;
    tel: string;
  };
  createdAt: number;
  updatedAt: number;
}

export type UserRole = 'admin' | 'client' | 'guest' | 'staff';

export interface User {
  id: string;
  name: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  secondLastName?: string;
  dni: string;
  email: string;
  phone: string;
  password?: string;
  role: UserRole;
  createdAt: number;
  lastLogin?: number;
}

export type View = 'dashboard' | 'catalog' | 'orders' | 'customers' | 'bulk' | 'backup' | 'settings' | 'users';

export interface CatalogData {
  categories: Category[];
  orders: Order[];
  customers: Customer[];
  users: User[];
}
