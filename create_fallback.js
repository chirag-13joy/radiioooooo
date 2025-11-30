import fs from 'fs';
import { execSync } from 'child_process';
import path from 'path';

// Create a simple silent WAV file using Node.js
const createSilentWav = (filename, duration = 30) => {
  // WAV header for a 1-second silent stereo file at 44100Hz
  const header = Buffer.from([
    0x52, 0x49, 0x46, 0x46, // "RIFF"
    0x24, 0x00, 0x00, 0x00, // Chunk size (36 + data size)
    0x57, 0x41, 0x56, 0x45, // "WAVE"
    0x66, 0x6d, 0x74, 0x20, // "fmt "
    0x10, 0x00, 0x00, 0x00, // Subchunk1 size (16)
    0x01, 0x00,             // Audio format (1 = PCM)
    0x02, 0x00,             // Num channels (2 = stereo)
    0x44, 0xac, 0x00, 0x00, // Sample rate (44100)
    0x10, 0xb1, 0x02, 0x00, // Byte rate (44100 * 2 * 2 = 176400)
    0x04, 0x00,             // Block align (2 * 2 = 4)
    0x10, 0x00,             // Bits per sample (16)
    0x64, 0x61, 0x74, 0x61, // "data"
    0x00, 0x00, 0x00, 0x00  // Data size (to be filled)
  ]);

  // Calculate data size for the desired duration
  // 44100 samples/sec * 2 channels * 2 bytes/sample * duration seconds
  const dataSize = 44100 * 2 * 2 * duration;
  
  // Update chunk sizes in header
  header.writeUInt32LE(36 + dataSize, 4);  // RIFF chunk size
  header.writeUInt32LE(dataSize, 40);      // data chunk size

  // Create silent audio data (all zeros)
  const silentData = Buffer.alloc(dataSize, 0);

  // Write the file
  fs.writeFileSync(filename, Buffer.concat([header, silentData]));
  console.log(`Created silent WAV file: ${filename} (${duration} seconds)`);
};

try {
  // Create fallback directory if it doesn't exist
  const fallbackDir = './media/fallback';
  if (!fs.existsSync(fallbackDir)) {
    fs.mkdirSync(fallbackDir, { recursive: true });
  }

  // Create a 30-second silent WAV file
  const wavFile = path.join(fallbackDir, 'silent.wav');
  createSilentWav(wavFile, 30);

  console.log('Fallback track created successfully!');
} catch (error) {
  console.error('Error creating fallback track:', error.message);
}