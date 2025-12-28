// خدمة IPFS مبسطة للاختبار
export const getIPFSFileUrl = (cid) => {
  return `https://ipfs.io/ipfs/${cid}`;
};

// دالة رفع وهمية للاختبار - بدون Buffer
export const uploadToIPFS = async (file, onProgress) => {
  return new Promise((resolve) => {
    console.log('📤 Simulating IPFS upload for:', file.name);
    
    // محاكاة التقدم
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      if (onProgress) onProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        // إرجاع hash وهمي
        const fakeHash = 'Qm' + Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);
        console.log('✅ Upload complete. Fake CID:', fakeHash);
        resolve(fakeHash);
      }
    }, 100);
  });
};