import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// إضافة polyfill لـ Buffer بطريقة آمنة
if (typeof window !== 'undefined' && !window.Buffer) {
  // إنشاء Buffer وهمي إذا لم يكن موجوداً
  window.Buffer = {
    from: (str, encoding) => {
      const arr = new Uint8Array(str.length);
      for (let i = 0; i < str.length; i++) {
        arr[i] = str.charCodeAt(i);
      }
      return arr;
    },
    toString: (buf, encoding) => {
      return String.fromCharCode.apply(null, buf);
    },
    // دالة toString افتراضية (لـ base64)
    toStringBase64: (buf) => {
      const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
      const bytes = new Uint8Array(buf);
      let result = '';
      
      for (let i = 0; i < bytes.length; i += 3) {
        const a = bytes[i];
        const b = bytes[i + 1] || 0;
        const c = bytes[i + 2] || 0;
        
        const encoded1 = a >> 2;
        const encoded2 = ((a & 3) << 4) | (b >> 4);
        const encoded3 = ((b & 15) << 2) | (c >> 6);
        const encoded4 = c & 63;
        
        result += CHARS[encoded1] + CHARS[encoded2] + CHARS[encoded3] + CHARS[encoded4];
      }
      
      // إضافة padding
      const pad = bytes.length % 3;
      if (pad === 1) result = result.slice(0, -2) + '==';
      if (pad === 2) result = result.slice(0, -1) + '=';
      
      return result;
    }
  };
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);