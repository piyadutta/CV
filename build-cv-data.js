import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pdfPath = path.join(__dirname, '../public/assets/Piya_Dutta_CV.pdf');
const outputPath = path.join(__dirname, '../src/cv-data.js');

if (fs.existsSync(pdfPath)) {
  const pdfBuffer = fs.readFileSync(pdfPath);
  const base64Data = pdfBuffer.toString('base64');
  
  const content = `// Auto-generated Base64 PDF Data for Instant Offline Download
export const pdfBase64 = "${base64Data}";

export function downloadPDF() {
  try {
    const binaryString = window.atob(pdfBase64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const blob = new Blob([bytes], { type: 'application/pdf' });
    const blobUrl = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = 'Piya_Dutta_CV.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
    return true;
  } catch (e) {
    console.error('Blob download error:', e);
    return false;
  }
}
`;

  fs.writeFileSync(outputPath, content, 'utf8');
  console.log(`Base64 PDF module successfully built at ${outputPath} (${(base64Data.length/1024).toFixed(1)} KB)`);
} else {
  console.error(`PDF not found at ${pdfPath}`);
}
