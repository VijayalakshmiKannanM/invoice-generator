export interface LineItemInput {
  id?: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface InvoiceInput {
  invoiceNumber?: string;
  customerId: string;
  issueDate: Date;
  dueDate: Date;
  taxRate: number;
  discount: number;
  notes?: string;
  lineItems: LineItemInput[];
}

export interface CustomerInput {
  name: string;
  email: string;
  company?: string;
  address?: string;
  phone?: string;
}

export interface InvoiceWithRelations {
  id: string;
  invoiceNumber: string;
  status: string;
  issueDate: Date;
  dueDate: Date;
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discount: number;
  total: number;
  notes: string | null;
  customer: {
    id: string;
    name: string;
    email: string;
    company: string | null;
    address: string | null;
  };
  lineItems: {
    id: string;
    description: string;
    quantity: number;
    unitPrice: number;
    amount: number;
  }[];
  user: {
    name: string | null;
    email: string;
    company: string | null;
    address: string | null;
  };
}
