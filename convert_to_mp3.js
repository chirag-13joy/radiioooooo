import fs from 'fs';
import { execSync } from 'child_process';
import ffmpegStatic from 'ffmpeg-static';
import path from 'path';

try {
  // Check if the WAV file exists
  const wavFile = './media/fallback/silent.wav';
  const mp3File = './media/fallback/silent.mp3';
  
  if (!fs.existsSync(wavFile)) {
    console.error('WAV file not found:', wavFile);
    process.exit(1);
  }

  // Convert WAV to MP3 using ffmpeg-static
  console.log('Converting WAV to MP3...');
  const command = `"${ffmpegStatic}" -i "${wavFile}" -codec:a libmp3lame -b:a 128k "${mp3File}"`;
  
  execSync(command, { stdio: 'inherit' });
  
  console.log('Conversion completed successfully!');
  console.log('MP3 file created:', mp3File);
  
  // Remove the WAV file as we no longer need it
  fs.unlinkSync(wavFile);
  console.log('Removed temporary WAV file');
  
} catch (error) {
  console.error('Error converting file:', error.message);
  process.exit(1);
}