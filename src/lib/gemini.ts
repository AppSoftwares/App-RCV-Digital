import { GoogleGenerativeAI } from "@google/generative-ai";

// En un entorno real, usaríamos la API Key
// const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || "");

export interface ExtractedData {
  nombre?: string;
  cedula?: string;
  placa?: string;
  marca?: string;
  modelo?: string;
  anio?: string;
}

/**
 * Simula la extracción de datos usando IA
 */
export async function analyzeDocument(file: File, type: 'id' | 'title'): Promise<ExtractedData> {
  console.log(`Analizando documento ${type}...`);

  // Simulamos un retraso de red y procesamiento de IA
  await new Promise(resolve => setTimeout(resolve, 2500));

  // Datos de prueba (Mocks)
  if (type === 'id') {
    return {
      nombre: "JUAN PEREZ",
      cedula: "V-12.345.678"
    };
  } else {
    return {
      placa: "AB123CD",
      marca: "TOYOTA",
      modelo: "COROLLA",
      anio: "2024"
    };
  }
}
