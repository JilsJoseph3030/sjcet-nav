import fs from 'fs';
import path from 'path';
import QRCode from 'qrcode';
import os from 'os';

// Extract the correct Wi-Fi IP address specifically
function getWiFiIpAddress() {
  const interfaces = os.networkInterfaces();
  
  // Try to find the Wi-Fi adapter first (Windows usually calls it 'Wi-Fi')
  if (interfaces['Wi-Fi']) {
    const wifi = interfaces['Wi-Fi'].find(iface => iface.family === 'IPv4');
    if (wifi) return wifi.address;
  }
  
  // Fallback if 'Wi-Fi' isn't explicitly named
  for (const name of Object.keys(interfaces)) {
    // Avoid virtual adapters (VMware, WSL, VirtualBox)
    if (name.toLowerCase().includes('vmware') || name.toLowerCase().includes('virtual') || name.toLowerCase().includes('wsl')) {
      continue;
    }
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

const localIp = getWiFiIpAddress();
// Use the original qr_codes folder so we overwrite them!
const BASE_URL = `https://sjcet-nav.vercel.app/`;
const OUTPUT_DIR = './qr_codes';

console.log(`Using base URL: ${BASE_URL}`);

const graphData = {
  ground: [
    { id: 'entrance', name: 'Main Entrance Checkpoint' },
    { id: 'stair-main-core', name: 'Ground Floor Main Stair Checkpoint' }
  ],
  first: [
    { id: 'stair-main-core', name: 'First Floor Main Stair Checkpoint' },
    { id: 'stair-left', name: 'First Floor Left Stair Checkpoint' },
    { id: 'stair-right', name: 'First Floor Right Stair Checkpoint' }
  ]
};

async function generateQRCodes() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR);
  }

  for (const floor in graphData) {
    for (const node of graphData[floor]) {
      const url = `${BASE_URL}?floor=${floor}&node=${node.id}`;
      const filename = path.join(OUTPUT_DIR, `${floor}_${node.id}.png`);
      
      try {
        await QRCode.toFile(filename, url, {
          color: {
            dark: '#800000',  // SJCET Maroon
            light: '#FFFFFF'
          },
          width: 500,
          margin: 2
        });
        console.log(`Generated QR Code for ${node.name} -> ${filename}`);
      } catch (err) {
        console.error(`Error generating QR Code for ${node.name}:`, err);
      }
    }
  }
}

generateQRCodes();
