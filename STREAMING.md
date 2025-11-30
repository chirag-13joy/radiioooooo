# MRadio

MRadio is an online radio player with streaming capabilities.

## Features

- Play/Pause functionality
- Volume control
- Multiple station selection
- Real-time streaming
- Responsive design

## Streaming Endpoint

The radio stream is available at:
- Local: `http://localhost:9126/stream`
- This endpoint directly serves the audio stream without requiring a web interface

## Setup

1. Clone the repository
2. Run `npm install` to install dependencies
3. Copy `.env.example` to `.env` and configure as needed
4. Run `npm start` to start the server
5. Access the stream at `http://localhost:9126/stream`

## Usage

To use the stream in your applications, simply make a GET request to the `/stream` endpoint. The server will respond with a continuous audio stream that can be played directly.

## License

MIT License