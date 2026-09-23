const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 3000)); // Wait for things to settle
  
  // Take screenshot of the entire page
  await page.screenshot({ path: 'page.png' });
  
  // Extract canvas pixels
  const canvasStats = await page.evaluate(() => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return 'No canvas found';
    
    // We need to read the WebGL context pixels
    const gl = canvas.getContext('webgl') || canvas.getContext('webgl2');
    if (!gl) return 'No WebGL context';
    
    const width = gl.drawingBufferWidth;
    const height = gl.drawingBufferHeight;
    const pixels = new Uint8Array(width * height * 4);
    gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
    
    // Count non-black/transparent pixels
    let nonBlackCount = 0;
    let redCount = 0;
    
    for (let i = 0; i < pixels.length; i += 4) {
      const r = pixels[i];
      const g = pixels[i+1];
      const b = pixels[i+2];
      const a = pixels[i+3];
      
      if (a > 0 && (r > 0 || g > 0 || b > 0)) {
        nonBlackCount++;
        // Check for strong red
        if (r > 200 && g < 50 && b < 50) {
          redCount++;
        }
      }
    }
    
    const elementAtCenter = document.elementFromPoint(width / 2, height / 2);
    const coveringElement = elementAtCenter ? {
      tagName: elementAtCenter.tagName,
      id: elementAtCenter.id,
      className: elementAtCenter.className
    } : null;

    return {
      width, height,
      totalPixels: width * height,
      nonBlackCount,
      redCount,
      percentNonBlack: (nonBlackCount / (width * height) * 100).toFixed(2) + '%',
      coveringElement
    };
  });
  
  console.log('--- CANVAS STATS ---');
  console.log(JSON.stringify(canvasStats, null, 2));
  
  await browser.close();
})();
