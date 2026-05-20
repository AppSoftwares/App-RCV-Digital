import { globalCache } from '../../infrastructure/cache/CacheService';
import { apiBreaker } from '../../infrastructure/network/CircuitBreaker';

/**
 * Servicio para manejo de finanzas y tasas de cambio con Caché (80/20).
 */
export class FinancialService {
  private readonly BCV_CACHE_KEY = 'bcv_rate';
  private readonly BCV_TTL = 3600000; // 1 hora de caché para la tasa

  /**
   * Obtiene la tasa oficial del BCV.
   * Optimizado con caché para evitar peticiones repetitivas en cada cálculo de póliza.
   */
  async getExchangeRate(): Promise<number> {
    return await globalCache.getOrSet(
      this.BCV_CACHE_KEY,
      async () => {
        return await apiBreaker.execute(async () => {
          console.log("[Financial] Consultando Tasa BCV oficial...");
          // Simulación de llamada a API externa de indicadores económicos
          // await fetch('https://api.bcv.org.ve/rates');
          return 474.0598; // Tasa simulada
        });
      },
      this.BCV_TTL
    );
  }

  /**
   * Realiza la conversión de USD a VES usando la tasa en caché.
   */
  async convertToVes(amountUsd: number): Promise<number> {
    const rate = await this.getExchangeRate();
    return amountUsd * rate;
  }
}

export const financialService = new FinancialService();
