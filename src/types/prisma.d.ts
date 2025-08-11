export enum UserRole {
  BUSINESS = "BUSINESS",
  CLIENT = "CLIENT",
}

export interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  password?: string | null;
  roles: UserRole[];
  isActive: boolean;
  emailVerified?: Date | null;
  image?: string | null;

  accounts?: Account[];
  sessions?: Session[];
  stores?: Store[];  // Si es BUSINESS
  orders?: Order[];  // Si es CLIENT
}

export interface Store {
  id: string;
  name: string;
  description?: string | null;
  image?: string | null;

  business?: User;
  businessId: string;

  products?: Product[];

  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  image?: string | null;

  store?: Store;
  storeId: string;

  orderItems?: OrderItem[];

  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  id: string;

  client?: User;
  clientId: string;

  items?: OrderItem[];

  createdAt: Date;
}

export interface OrderItem {
  id: string;

  order?: Order;
  orderId: string;

  product?: Product;
  productId: string;

  quantity: number;
  unitPrice: number;
}

export interface Account {
  id: string;
  userId: string;
  type: string;
  provider: string;
  providerAccountId: string;
  refresh_token?: string | null;
  refresh_token_expires_in?: number | null;
  access_token?: string | null;
  expires_at?: number | null;
  token_type?: string | null;
  scope?: string | null;
  id_token?: string | null;
  session_state?: string | null;

  user?: User;
}

export interface Session {
  id: string;
  sessionToken: string;
  userId: string;
  expires: Date;

  user?: User;
}

export interface VerificationToken {
  identifier: string;
  token: string;
  expires: Date;
}
