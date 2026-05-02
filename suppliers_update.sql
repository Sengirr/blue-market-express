ALTER TABLE public.super_suppliers
ADD COLUMN bank_account TEXT,
ADD COLUMN payment_method TEXT,
ADD COLUMN visit_day TEXT;

ALTER TABLE public.super_transactions
ADD COLUMN supplier_id UUID REFERENCES public.super_suppliers(id) ON DELETE SET NULL,
ADD COLUMN expense_type TEXT;
