const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  // Forward console logs to terminal
  page.on('console', msg => console.log('BROWSER:', msg.text()));
  page.on('pageerror', error => console.log('BROWSER ERROR:', error.message));

  console.log('Navigating to http://localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  
  console.log('Waiting for scene to be exposed...');
  await page.waitForFunction('window.scene !== undefined', { timeout: 10000 }).catch(e => console.log('Timeout waiting for window.scene'));

  const sceneInfo = await page.evaluate(() => {
    if (!window.scene) return 'Scene not found on window';
    
    const count = window.scene.children.length;
    let details = '';
    window.scene.children.forEach((c, i) => {
      details += `Child ${i}: ${c.type} - vis: ${c.visible}, name: ${c.name}, pos: [${c.position.x.toFixed(2)}, ${c.position.y.toFixed(2)}, ${c.position.z.toFixed(2)}], scale: [${c.scale.x.toFixed(2)}, ${c.scale.y.toFixed(2)}]\n`;
    });
    
    const canvas = document.querySelector('canvas');
    const canvasStyle = canvas ? window.getComputedStyle(canvas) : {};
    const canvasRect = canvas ? {
      width: canvas.clientWidth,
      height: canvas.clientHeight,
      top: canvas.offsetTop,
      left: canvas.offsetLeft,
      position: canvasStyle.position,
      zIndex: canvasStyle.zIndex,
      opacity: canvasStyle.opacity,
      display: canvasStyle.display,
      visibility: canvasStyle.visibility
    } : null;
    
    return {
      childrenCount: count,
      details: details,
      canvasRect: canvasRect,
      hasCanvas: !!canvas
    };
  });
  
  console.log('--- SCENE INFO ---');
  console.log(JSON.stringify(sceneInfo, null, 2));
  console.log('------------------');
  
  await browser.close();
})();
