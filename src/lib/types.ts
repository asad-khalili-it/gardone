export interface StoreConfig {
  id: number;
  slug: string;
  name: string;
  logo: string | null;
  phone: string;
  instagram: string;
  address: string;
  isActive: boolean;
  theme: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
}

export interface Prize {
  id: number;
  label: string;
  color: string;
  probability: number;
  discountCode: string | null;
  isActive: boolean;
}

export interface SpinResult {
  prize: Prize;
  discountCode: string;
  message: string;
}

export interface CustomerForm {
  name: string;
  phone: string;
}
