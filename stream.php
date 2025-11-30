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

// Map stations to audio files
$stationFiles = [
    'jazz' => 'media/jazz-lounge.mp3',
    'rock' => 'media/rock-classics.mp3',
    'classical' => 'media/classical-music.mp3'
];

// Check if station is valid
if (!empty($station) && isset($stationFiles[$station])) {
    $audioFile = $stationFiles[$station];
    
    if (file_exists($audioFile)) {
        // Open the file
        $fp = fopen($audioFile, 'rb');
        
        if ($fp) {
            // Stream the file
            while (!feof($fp) && connection_status() == 0) {
                // Output buffer
                print(fread($fp, 1024*8));
                flush();
                sleep(1);
            }
            fclose($fp);
        } else {
            http_response_code(404);
            echo "Audio file not found";
        }
    } else {
        http_response_code(404);
        echo "Stream not available";
    }
} else {
    http_response_code(400);
    echo "Invalid station";
}
?>