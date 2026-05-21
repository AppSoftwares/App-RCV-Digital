/**
 * Servicio de generación de PDF basado en html2pdf.js
 * Procesa un elemento HTML y lo descarga automáticamente.
 */

export const pdfService = {
  async generateInvoice(elementId: string, filename: string) {
    const element = document.getElementById(elementId);
    if (!element) {
      console.error('Elemento no encontrado para generar PDF:', elementId);
      return;
    }

    const options = {
      margin: 0,
      filename: `${filename}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        letterRendering: true
      },
      jsPDF: { unit: 'mm', format: 'letter', orientation: 'portrait' }
    };

    // @ts-ignore - html2pdf viene de CDN
    if (window.html2pdf) {
      // @ts-ignore
      return window.html2pdf().from(element).set(options).save();
    } else {
      console.error('html2pdf library not loaded');
      // Fallback: imprimir directamente
      window.print();
    }
  }
};
