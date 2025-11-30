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
  
  // Ask if user wants to configure music services
  const configureMusicServices = await askQuestion('Do you want to configure music services (Spotify, SoundCloud)? (y/N): ');
  
  let spotifyClientId = 'your_real_spotify_client_id_here';
  let spotifyClientSecret = 'your_real_spotify_client_secret_here';
  let soundcloudApiKey = 'your_real_soundcloud_api_key_here';
  
  if (configureMusicServices.toLowerCase() === 'y') {
    spotifyClientId = await askQuestion('Enter Spotify Client ID (leave blank to skip): ') || 'your_real_spotify_client_id_here';
    spotifyClientSecret = await askQuestion('Enter Spotify Client Secret (leave blank to skip): ') || 'your_real_spotify_client_secret_here';
    soundcloudApiKey = await askQuestion('Enter SoundCloud API Key (leave blank to skip): ') || 'your_real_soundcloud_api_key_here';
  }
  
  // Ask if user wants to configure Icecast streaming
  const configureIcecast = await askQuestion('Do you want to configure Icecast streaming? (y/N): ');
  
  let icecastHost = 'myradio.tk';
  let icecastPort = '8000';
  let icecastPassword = 'your_secure_icecast_password';
  let icecastMount = '/radio.mp3';
  let icecastName = 'MRadio';
  let icecastDescription = 'MRadio - Multi-platform Music Streaming';
  let icecastGenre = 'Various';
  let icecastBitrate = '128';
  
  if (configureIcecast.toLowerCase() === 'y') {
    icecastHost = await askQuestion('Enter Icecast Host (default: myradio.tk): ') || 'myradio.tk';
    icecastPort = await askQuestion('Enter Icecast Port (default: 8000): ') || '8000';
    icecastPassword = await askQuestion('Enter Icecast Password: ') || 'your_secure_icecast_password';
    icecastMount = await askQuestion('Enter Icecast Mount Point (default: /radio.mp3): ') || '/radio.mp3';
    icecastName = await askQuestion('Enter Icecast Stream Name (default: MRadio): ') || 'MRadio';
    icecastDescription = await askQuestion('Enter Icecast Description (default: MRadio - Multi-platform Music Streaming): ') || 'MRadio - Multi-platform Music Streaming';
    icecastGenre = await askQuestion('Enter Icecast Genre (default: Various): ') || 'Various';
    icecastBitrate = await askQuestion('Enter Icecast Bitrate (default: 128): ') || '128';
  }
  
  // Ask if user wants to set up initial playlist
  const setupInitialPlaylist = await askQuestion('Do you want to set up an initial playlist? (y/N): ');
  
  let initialPlaylistId = '1134543272';
  let initialPlaylistSource = 'jiosaavn';
  let initialPlaylistTitle = 'Top 50 Songs';
  
  if (setupInitialPlaylist.toLowerCase() === 'y') {
    initialPlaylistId = await askQuestion('Enter Initial Playlist ID (default: 1134543272): ') || '1134543272';
    initialPlaylistSource = await askQuestion('Enter Initial Playlist Source (default: jiosaavn): ') || 'jiosaavn';
    initialPlaylistTitle = await askQuestion('Enter Initial Playlist Title (default: Top 50 Songs): ') || 'Top 50 Songs';
  } else {
    // Set empty values to skip initial playlist
    initialPlaylistId = '';
    initialPlaylistSource = '';
    initialPlaylistTitle = '';
  }
  
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

# Icecast Server Configuration${configureIcecast.toLowerCase() === 'y' ? '' : ' (Optional)'}
ICECAST_HOST=${icecastHost}
ICECAST_PORT=${icecastPort}
ICECAST_PASSWORD=${icecastPassword}
ICECAST_MOUNT=${icecastMount}
ICECAST_NAME=${icecastName}
ICECAST_DESCRIPTION=${icecastDescription}
ICECAST_GENRE=${icecastGenre}
ICECAST_BITRATE=${icecastBitrate}

# Initial Default Playlist${setupInitialPlaylist.toLowerCase() === 'y' ? '' : ' (Optional)'}
INITIAL_PLAYLIST_ID=${initialPlaylistId}
INITIAL_PLAYLIST_SOURCE=${initialPlaylistSource}
INITIAL_PLAYLIST_TITLE=${initialPlaylistTitle}
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