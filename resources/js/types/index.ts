import { LucideIcon } from 'lucide-react';

export interface Auth {
  user: User;
}

export interface BreadcrumbItem {
  title: string;
  href: string;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export interface NavItem {
  title: string;
  url: string;
  icon?: LucideIcon | null;
  isActive?: boolean;
}

export interface SharedData {
  name: string;
  quote: { message: string; author: string };
  auth: Auth;
  [key: string]: unknown;
}

export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  [key: string]: unknown; // This allows for additional properties...
}

export interface LoginResult {
  success: boolean;
  error?: string;
}

export interface RegisterResult {
  success: boolean;
  error?: string;
  errors?: any; //TODO, try to find the exact type.
}

export interface AuthorizedUserData {
  id: number;
  username: string;
  name: string;
  role_type: string;
  email: string;
}

export interface AuthContextData {
  isAuthenticated: boolean;
  currentUser: AuthorizedUserData | null;
  emailVerified: boolean;
  login: (email: string, password: string, rememberMe: boolean) => Promise<LoginResult>;
  register: (firstName: string, lastName: string, email: string, password: string, passwordConfirmation: string) => Promise<RegisterResult>;
  logout: () => Promise<void>;
  loading: boolean;
  resendVerification: () => Promise<void>;
}
