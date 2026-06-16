import { jsPDF } from 'jspdf';
import { parse as parseYaml, stringify as stringifyYaml } from 'yaml';

// --- TYPES ---
export type ImageFormat = 'png' | 'jpg' | 'jpeg' | 'webp' | 'bmp' | 'ico' | 'svg' | 'pdf';
export type DocFormat = 'json' | 'csv' | 'xml' | 'yaml' | 'txt' | 'md' | 'html' | 'pdf';

export interface ConversionItem {
  id: string;
  file: File;
  sourceFormat: string;
  targetFormat: string;
  status: 'idle' | 'converting' | 'success' | 'error';
  progress: number;
  error?: string;
  convertedBlob?: Blob;
  convertedUrl?: string;
  convertedFilename?: string;
}

// --- IMAGE CONVERTERS ---

/**
 * Loads an image file into an HTMLImageElement
 */
function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(new Error('Failed to load image: ' + e));
    img.src = url;
  });
}

/**
 * Convert an image file client-side using Canvas
 */
export async function convertImage(
  file: File,
  targetFormat: ImageFormat
): Promise<{ blob: Blob; filename: string }> {
  const sourceFormat = file.name.split('.').pop()?.toLowerCase() || '';
  const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
  const targetExt = targetFormat === 'jpeg' ? 'jpg' : targetFormat;
  const targetFilename = `${baseName}_converted.${targetExt}`;

  // If source and target are same and target isn't PDF, return original file
  if (sourceFormat === targetFormat && targetFormat !== 'pdf') {
    return { blob: file, filename: file.name };
  }

  // Handle PDF target specifically using jsPDF
  if (targetFormat === 'pdf') {
    const objectUrl = URL.createObjectURL(file);
    try {
      const img = await loadImage(objectUrl);
      const pdf = new jsPDF({
        orientation: img.width > img.height ? 'landscape' : 'portrait',
        unit: 'px',
        format: [img.width, img.height],
      });
      
      // Determine format for PDF embedding
      let embedFormat = 'PNG';
      if (sourceFormat === 'jpg' || sourceFormat === 'jpeg') embedFormat = 'JPEG';
      else if (sourceFormat === 'webp') embedFormat = 'WEBP';

      // Convert canvas to data url to embed in PDF
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas context not available');
      ctx.drawImage(img, 0, 0);
      
      const dataUrl = canvas.toDataURL(sourceFormat === 'webp' ? 'image/webp' : 'image/png');
      pdf.addImage(dataUrl, embedFormat === 'JPEG' ? 'JPEG' : 'PNG', 0, 0, img.width, img.height);
      const pdfBlob = pdf.output('blob');
      return { blob: pdfBlob, filename: `${baseName}.pdf` };
    } finally {
      URL.revokeObjectURL(objectUrl);
    }
  }

  // SVG to Raster Image
  if (sourceFormat === 'svg') {
    const text = await file.text();
    const svgBlob = new Blob([text], { type: 'image/svg+xml;charset=utf-8' });
    const objectUrl = URL.createObjectURL(svgBlob);
    try {
      const img = await loadImage(objectUrl);
      return renderImageToFormat(img, targetFormat, targetFilename);
    } finally {
      URL.revokeObjectURL(objectUrl);
    }
  }

  // Standard Image (PNG/JPG/WebP/BMP/ICO) to Raster Image
  const objectUrl = URL.createObjectURL(file);
  try {
    const img = await loadImage(objectUrl);
    return renderImageToFormat(img, targetFormat, targetFilename);
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

function renderImageToFormat(
  img: HTMLImageElement,
  targetFormat: ImageFormat,
  filename: string
): Promise<{ blob: Blob; filename: string }> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      reject(new Error('Failed to get 2D canvas context'));
      return;
    }

    // Fill white background if converting to JPEG/JPG to prevent black background transparency
    if (targetFormat === 'jpg' || targetFormat === 'jpeg') {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    ctx.drawImage(img, 0, 0);

    let mimeType = 'image/png';
    let quality = 0.95;

    if (targetFormat === 'jpg' || targetFormat === 'jpeg') {
      mimeType = 'image/jpeg';
    } else if (targetFormat === 'webp') {
      mimeType = 'image/webp';
    } else if (targetFormat === 'bmp') {
      mimeType = 'image/bmp';
    } else if (targetFormat === 'ico') {
      mimeType = 'image/png'; 
    }

    canvas.toBlob((blob) => {
      if (blob) {
        resolve({ blob, filename });
      } else {
        reject(new Error(`Failed to convert image to ${targetFormat}`));
      }
    }, mimeType, quality);
  });
}

// --- DOCUMENT CONVERTERS ---

/**
 * Parses CSV string to a JSON Array
 */
function csvToJson(csv: string): any[] {
  const lines = csv.split(/\r?\n/).filter(line => line.trim() !== '');
  if (lines.length === 0) return [];
  
  const parseLine = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result;
  };

  const headers = parseLine(lines[0]);
  const data: any[] = [];

  for (let i = 1; i < lines.length; i++) {
    const row = parseLine(lines[i]);
    if (row.length === headers.length) {
      const obj: any = {};
      headers.forEach((header, index) => {
        const val = row[index];
        if (val === 'true') obj[header] = true;
        else if (val === 'false') obj[header] = false;
        else if (!isNaN(Number(val)) && val !== '') obj[header] = Number(val);
        else obj[header] = val;
      });
      data.push(obj);
    }
  }
  return data;
}

/**
 * Converts JSON Array to CSV string
 */
function jsonToCsv(json: any): string {
  const items = Array.isArray(json) ? json : [json];
  if (items.length === 0) return '';
  
  const headers = Array.from(
    new Set(items.reduce((acc, item) => [...acc, ...Object.keys(item)], []))
  ) as string[];

  const csvRows = [
    headers.map(h => `"${h.replace(/"/g, '""')}"`).join(','),
    ...items.map(item =>
      headers
        .map(header => {
          const cleanVal = typeof item[header] === 'object' ? JSON.stringify(item[header]) : String(item[header]);
          return `"${cleanVal.replace(/"/g, '""')}"`;
        })
        .join(',')
    )
  ];
  return csvRows.join('\n');
}

/**
 * Simple XML string to JSON object converter
 */
function xmlToJson(xmlStr: string): any {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlStr, 'text/xml');
  
  const parseNode = (node: Node): any => {
    if (node.nodeType === Node.TEXT_NODE) {
      return node.nodeValue?.trim() || '';
    }
    
    const obj: any = {};
    
    if (node instanceof Element && node.attributes.length > 0) {
      obj['@attributes'] = {};
      for (let i = 0; i < node.attributes.length; i++) {
        const attr = node.attributes[i];
        obj['@attributes'][attr.nodeName] = attr.nodeValue;
      }
    }
    
    let hasChildren = false;
    let textVal = '';
    
    for (let i = 0; i < node.childNodes.length; i++) {
      const child = node.childNodes[i];
      if (child.nodeType === Node.ELEMENT_NODE) {
        hasChildren = true;
        const childVal = parseNode(child);
        if (obj[child.nodeName]) {
          if (!Array.isArray(obj[child.nodeName])) {
            obj[child.nodeName] = [obj[child.nodeName]];
          }
          obj[child.nodeName].push(childVal);
        } else {
          obj[child.nodeName] = childVal;
        }
      } else if (child.nodeType === Node.TEXT_NODE) {
        textVal += child.nodeValue?.trim() || '';
      }
    }
    
    if (!hasChildren) {
      if (Object.keys(obj).length === 0) {
        return textVal;
      }
      obj['#text'] = textVal;
    }
    
    return obj;
  };

  const rootElement = xmlDoc.documentElement;
  if (rootElement.nodeName === 'parsererror') {
    throw new Error('Invalid XML structure');
  }
  
  return { [rootElement.nodeName]: parseNode(rootElement) };
}

/**
 * Converts JSON object to XML string
 */
function jsonToXml(json: any): string {
  const buildXml = (obj: any, rootName = 'root'): string => {
    let xml = '';
    
    if (obj === null || obj === undefined) return '';
    
    if (typeof obj !== 'object') {
      return `<${rootName}>${String(obj).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</${rootName}>`;
    }
    
    if (Array.isArray(obj)) {
      obj.forEach(item => {
        xml += buildXml(item, rootName);
      });
      return xml;
    }
    
    xml += `<${rootName}`;
    
    if (obj['@attributes']) {
      Object.keys(obj['@attributes']).forEach(attr => {
        xml += ` ${attr}="${String(obj['@attributes'][attr]).replace(/"/g, '&quot;')}"`;
      });
    }
    
    xml += '>';
    
    Object.keys(obj).forEach(key => {
      if (key === '@attributes') return;
      if (key === '#text') {
        xml += String(obj[key]).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      } else {
        xml += buildXml(obj[key], key);
      }
    });
    
    xml += `</${rootName}>`;
    return xml;
  };

  return `<?xml version="1.0" encoding="UTF-8"?>\n` + buildXml(json);
}

/**
 * Regex-based Markdown to HTML renderer (simple)
 */
function markdownToHtml(md: string): string {
  let html = md;
  html = html.replace(/^\s*>\s+(.*)$/gm, '<blockquote>$1</blockquote>');
  html = html.replace(/^\s*###\s+(.*)$/gm, '<h3>$1</h3>');
  html = html.replace(/^\s*##\s+(.*)$/gm, '<h2>$1</h2>');
  html = html.replace(/^\s*#\s+(.*)$/gm, '<h1>$1</h1>');
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  html = html.replace(/^\s*-\s+(.*)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>');
  html = html.replace(/^(?!\s*<)(.+)$/gm, '<p>$1</p>');
  
  return html;
}

/**
 * Simple HTML to Markdown renderer
 */
function htmlToMarkdown(html: string): string {
  let md = html;
  md = md.replace(/<h1>(.*?)<\/h1>/gi, '# $1\n');
  md = md.replace(/<h2>(.*?)<\/h2>/gi, '## $1\n');
  md = md.replace(/<h3>(.*?)<\/h3>/gi, '### $1\n');
  md = md.replace(/<strong>(.*?)<\/strong>/gi, '**$1**');
  md = md.replace(/<b>(.*?)<\/b>/gi, '**$1**');
  md = md.replace(/<em>(.*?)<\/em>/gi, '*$1*');
  md = md.replace(/<i>(.*?)<\/i>/gi, '*$1*');
  md = md.replace(/<li>(.*?)<\/li>/gi, '- $1');
  md = md.replace(/<\/li>\s*<li>/gi, '\n');
  md = md.replace(/<ul>(.*?)<\/ul>/gis, '$1\n');
  md = md.replace(/<blockquote>(.*?)<\/blockquote>/gi, '> $1\n');
  md = md.replace(/<p>(.*?)<\/p>/gi, '$1\n\n');
  md = md.replace(/<[^>]*>/g, '');
  return md.trim();
}

/**
 * Helper to parse a document file content string to pure JSON
 */
function parseToIntermediateJson(text: string, format: string): any {
  const fmt = format.toLowerCase();
  switch (fmt) {
    case 'json':
      return JSON.parse(text);
    case 'csv':
      return csvToJson(text);
    case 'yaml':
    case 'yml':
      return parseYaml(text);
    case 'xml':
      return xmlToJson(text);
    default:
      throw new Error(`Cannot parse ${format} format to JSON`);
  }
}

/**
 * Helper to serialize intermediate JSON to target format string
 */
function serializeFromIntermediateJson(json: any, format: string): string {
  const fmt = format.toLowerCase();
  switch (fmt) {
    case 'json':
      return JSON.stringify(json, null, 2);
    case 'csv':
      return jsonToCsv(json);
    case 'yaml':
    case 'yml':
      return stringifyYaml(json);
    case 'xml':
      return jsonToXml(json);
    case 'txt':
      return typeof json === 'object' ? JSON.stringify(json, null, 2) : String(json);
    case 'md':
    case 'markdown':
      return typeof json === 'object' ? `\`\`\`json\n${JSON.stringify(json, null, 2)}\n\`\`\`` : String(json);
    case 'html':
      return `<html><body><pre>${JSON.stringify(json, null, 2)}</pre></body></html>`;
    default:
      throw new Error(`Serialization to ${format} not supported`);
  }
}

/**
 * Main Document Conversion function
 */
export async function convertDocument(
  file: File,
  targetFormat: DocFormat
): Promise<{ blob: Blob; filename: string }> {
  const sourceFormat = file.name.split('.').pop()?.toLowerCase() || '';
  const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
  const targetFilename = `${baseName}_converted.${targetFormat}`;

  if (sourceFormat === targetFormat && targetFormat !== 'pdf') {
    return { blob: file, filename: file.name };
  }

  const fileText = await file.text();

  if (targetFormat === 'pdf') {
    const pdf = new jsPDF();
    const margin = 15;
    const pageWidth = pdf.internal.pageSize.getWidth();
    const maxLineWidth = pageWidth - margin * 2;
    
    const lines = pdf.splitTextToSize(fileText, maxLineWidth);
    let y = margin;
    const lineHeight = 12;

    lines.forEach((line: string) => {
      if (y + lineHeight > pdf.internal.pageSize.getHeight() - margin) {
        pdf.addPage();
        y = margin;
      }
      pdf.text(line, margin, y);
      y += lineHeight;
    });

    const pdfBlob = pdf.output('blob');
    return { blob: pdfBlob, filename: `${baseName}.pdf` };
  }

  if (sourceFormat === 'md' && targetFormat === 'html') {
    const html = markdownToHtml(fileText);
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    return { blob, filename: targetFilename };
  }

  if (sourceFormat === 'html' && targetFormat === 'md') {
    const md = htmlToMarkdown(fileText);
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    return { blob, filename: targetFilename };
  }

  try {
    let intermediateJson: any;

    if (sourceFormat === 'txt' || sourceFormat === 'md' || sourceFormat === 'html') {
      try {
        intermediateJson = JSON.parse(fileText);
      } catch {
        intermediateJson = { content: fileText };
      }
    } else {
      intermediateJson = parseToIntermediateJson(fileText, sourceFormat);
    }

    const outputText = serializeFromIntermediateJson(intermediateJson, targetFormat);
    
    let mimeType = 'text/plain;charset=utf-8';
    if (targetFormat === 'json') mimeType = 'application/json;charset=utf-8';
    else if (targetFormat === 'csv') mimeType = 'text/csv;charset=utf-8';
    else if (targetFormat === 'xml') mimeType = 'application/xml;charset=utf-8';
    else if (targetFormat === 'html') mimeType = 'text/html;charset=utf-8';
    else if (targetFormat === 'yaml') mimeType = 'text/yaml;charset=utf-8';

    const blob = new Blob([outputText], { type: mimeType });
    return { blob, filename: targetFilename };
  } catch (err) {
    const blob = new Blob([fileText], { type: 'text/plain;charset=utf-8' });
    return { blob, filename: targetFilename };
  }
}
