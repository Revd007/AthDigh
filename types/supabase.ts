export type Database = {
  public: {
    Tables: {
      payment_methods: {
        Row: {
          id: string
          name: string
          type: 'bank' | 'qr'
          is_active: boolean
          created_at: string
        }
        // ... (Insert dan Update types)
      }
      bank_accounts: {
        Row: {
          id: string
          bank_name: string
          account_number: string
          account_holder: string
          is_active: boolean
          created_at: string
        }
        // ... (Insert dan Update types)
      }
      // ... (tabel lainnya)
    }
  }
}
