<?php
// stream.php - Simple streaming endpoint

// Set headers for streaming
header('Content-Type: audio/mpeg');
header('Cache-Control: no-cache');
header('Connection: close');

// Buffer settings
ob_end_clean();
set_time_limit(0);
ignore_user_abort(false);

// Get station parameter
$station = isset($_GET['station']) ? $_GET['station'] : '';

// Map stations to audio files or streams
$stationStreams = [
    'jazz' => 'https://icecast.radiofrance.fr/fip-hifi.aac',
    'rock' => 'http://stream.radioparadise.com/aac-320',
    'classical' => 'https://kexp.streamguys1.com/kexp64.aac'
];

// Check if station is valid
if (!empty($station) && isset($stationStreams[$station])) {
    $streamUrl = $stationStreams[$station];
    
    // Open the stream
    $stream = fopen($streamUrl, 'rb');
    
    if ($stream) {
        // Stream the audio
        while (!feof($stream) && connection_status() == 0) {
            // Output buffer
            print(fread($stream, 1024*8));
            flush();
        }
        fclose($stream);
    } else {
        http_response_code(404);
        echo "Stream not available";
    }
} else {
    http_response_code(400);
    echo "Invalid station";
}
?>