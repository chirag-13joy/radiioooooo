#!/usr/bin/env node

import fs from 'fs';
import readline from 'readline';
import crypto from 'crypto';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('MRadio Setup Script');
console.log('==================');
console.log('');

// Generate secure default keys if not provided
const generateSecureKey = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

const askQuestion = (question) => {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
};

const setupEnvFile = async () => {
  console.log('Setting up .env file...\n');
  
  // Check if .env already exists
  if (fs.existsSync('.env')) {
    const overwrite = await askQuestion('.env file already exists. Overwrite? (y/N): ');
    if (overwrite.toLowerCase() !== 'y') {
      console.log('Setup cancelled.');
      rl.close();
      return;
    }
  }
  
  // Ask for API keys
  const spotifyClientId = await askQuestion('Enter Spotify Client ID (leave blank to skip): ') || 'your_real_spotify_client_id_here';
  const spotifyClientSecret = await askQuestion('Enter Spotify Client Secret (leave blank to skip): ') || 'your_real_spotify_client_secret_here';
  const soundcloudApiKey = await askQuestion('Enter SoundCloud API Key (leave blank to skip): ') || 'your_real_soundcloud_api_key_here';
  
  // Generate secure admin keys
  const adminApiKey = generateSecureKey();
  const adminTokenKey = generateSecureKey();
  
  console.log('\nGenerating secure admin keys...');
  
  // Create .env content
  const envContent = `# Server Configuration
PORT=9126
NODE_ENV=development
FFMPEG_ENV=development

# Music Platform API Keys
SPOTIFY_CLIENT_ID=${spotifyClientId}
SPOTIFY_CLIENT_SECRET_ID=${spotifyClientSecret}
SOUNDCLOUD_API_KEY=${soundcloudApiKey}

# Admin Authentication
X_ADMIN_API_KEY=${adminApiKey}
X_ADMIN_TOKEN_KEY=${adminTokenKey}

# Icecast Server Configuration (Optional)
ICECAST_HOST=myradio.tk
ICECAST_PORT=8000
ICECAST_PASSWORD=your_secure_icecast_password
ICECAST_MOUNT=/radio.mp3
ICECAST_NAME=MRadio
ICECAST_DESCRIPTION=MRadio - Multi-platform Music Streaming
ICECAST_GENRE=Various
ICECAST_BITRATE=128

# Initial Default Playlist (Optional)
INITIAL_PLAYLIST_ID=1134543272
INITIAL_PLAYLIST_SOURCE=jiosaavn
INITIAL_PLAYLIST_TITLE=Top 50 Songs
`;
  
  // Write .env file
  fs.writeFileSync('.env', envContent);
  
  console.log('\n.env file created successfully!');
  console.log('');
  console.log('IMPORTANT: Please review the .env file and update any placeholder values.');
  console.log('Your auto-generated admin API keys are:');
  console.log(`  X_ADMIN_API_KEY: ${adminApiKey}`);
  console.log(`  X_ADMIN_TOKEN_KEY: ${adminTokenKey}`);
  console.log('');
  console.log('Make sure to keep these keys secure and update the music platform API keys');
  console.log('if you want to enable those services.');
  
  rl.close();
};

setupEnvFile().catch((error) => {
  console.error('Setup failed:', error.message);
  rl.close();
});