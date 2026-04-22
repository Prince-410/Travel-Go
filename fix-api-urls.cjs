const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
  });
}

const pattern = /\$\{import\.meta\.env\.VITE_API_URL \|\| 'http:\/\/localhost:5000'\}\/api/g;

walk('src', (filePath) => {
  if (filePath.endsWith('.jsx') || filePath.endsWith('.js')) {
    let content = fs.readFileSync(filePath, 'utf8');
    if (pattern.test(content)) {
      console.log('Fixing:', filePath);
      let newContent = content.replace(pattern, '/api');
      fs.writeFileSync(filePath, newContent);
    }
  }
});
