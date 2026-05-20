// Mock de Supabase para desarrollo sin credenciales
export const supabase = {
  from: (table: string) => ({
    insert: async (data: any) => {
      console.log(`[Supabase Mock] Insertando en ${table}:`, data);
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { data: { id: 'mock-id-' + Math.random() }, error: null };
    },
    select: () => ({
      eq: () => ({
        single: async () => ({ data: null, error: null })
      })
    })
  })
};

export async function savePolicy(policyData: any) {
  return await supabase.from('policies').insert(policyData);
}
