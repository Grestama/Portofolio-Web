const fs = require('fs');
const { PNG } = require('pngjs'); // Let's check if pngjs is installed, if not we'll use a simpler way or install it

try {
  const data = fs.readFileSync('page.png');
  // Just print the file size to see if it's completely empty
  console.log('page.png size:', data.length);
} catch (e) {
  console.log('Failed to read page.png');
}
