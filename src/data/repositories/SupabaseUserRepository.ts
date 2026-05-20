import { supabase } from '../../lib/supabase';
import { User, SearchCriteria } from '../../core/entities/User';
import { sanitizeInput } from '../../shared/security';
import { apiBreaker } from '../../infrastructure/network/CircuitBreaker';
import { globalCache } from '../../infrastructure/cache/CacheService';

export class SupabaseUserRepository {
  async searchUsers(criteria: SearchCriteria): Promise<User[]> {
    const safeQuery = sanitizeInput(criteria.query);

    if (!safeQuery) return [];

    // Caching de búsquedas frecuentes (Regla 80/20)
    const cacheKey = `search_${safeQuery}_${criteria.limit}`;

    return await globalCache.getOrSet(cacheKey, async () => {
      return await apiBreaker.execute(async () => {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .or(`full_name.ilike.%${safeQuery}%,email.ilike.%${safeQuery}%`)
          .limit(criteria.limit || 10);

        if (error) throw new Error(error.message);
        return data as User[];
      });
    }, 60000); // 1 minuto para búsquedas
  }

  async getUserById(id: string): Promise<User | null> {
    const cacheKey = `user_${id}`;

    return await globalCache.getOrSet(cacheKey, async () => {
      return await apiBreaker.execute(async () => {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', id)
          .single();

        if (error) return null;
        return data as User;
      });
    }, 300000); // 5 minutos para perfiles
  }
}
