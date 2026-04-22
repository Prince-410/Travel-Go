const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;
  
  // Replace 'http://localhost:5000' with `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}`
  
  content = content.replace(/'http:\/\/localhost:5000(.*?)'/g, "`\\${import.meta.env.VITE_API_URL || 'http://localhost:5000'}$1`");
  content = content.replace(/"http:\/\/localhost:5000(.*?)"/g, "`\\${import.meta.env.VITE_API_URL || 'http://localhost:5000'}$1`");
  content = content.replace(/`http:\/\/localhost:5000(.*?)`/g, "`\\${import.meta.env.VITE_API_URL || 'http://localhost:5000'}$1`");
  
  if (content !== original) {
    fs.writeFileSync(filePath, content);
    console.log('Updated', filePath);
  }
}

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
      replaceInFile(fullPath);
    }
  }
}

walk(path.join(process.cwd(), 'src'));
