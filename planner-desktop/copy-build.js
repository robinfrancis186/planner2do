const fs = require('fs-extra');
const path = require('path');

const webAppBuildDir = path.join(__dirname, '..', 'dist');
const desktopBuildDir = path.join(__dirname, 'build');

// Copy web app build to desktop app
async function copyBuild() {
  try {
    // Ensure the build directory exists
    await fs.ensureDir(desktopBuildDir);
    
    // Copy the build files
    await fs.copy(webAppBuildDir, path.join(desktopBuildDir, 'build'));
    
    console.log('Successfully copied build files');
  } catch (err) {
    console.error('Error copying build files:', err);
    process.exit(1);
  }
}

copyBuild(); 