document.addEventListener('DOMContentLoaded', function() {
    const playBtn = document.getElementById('play-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const volumeSlider = document.getElementById('volume-slider');
    const stationsSelect = document.getElementById('stations');
    const stationName = document.getElementById('station-name');
    const stationDescription = document.getElementById('station-description');
    
    // Audio element for streaming
    let audioPlayer = new Audio();
    
    // Station data with actual working stream URLs
    const stations = {
        '': { name: 'Select a Station', description: 'Choose from our collection of radio stations', stream: '' },
        'station1': { name: 'FIP Radio', description: 'French indie music radio', stream: 'https://icecast.radiofrance.fr/fip-hifi.aac' },
        'station2': { name: 'Radio Paradise', description: 'Eclectic music mix', stream: 'http://stream.radioparadise.com/aac-320' },
        'station3': { name: 'KEXP', description: 'Seattle indie music', stream: 'https://kexp.streamguys1.com/kexp64.aac' }
    };
    
    // Play button event listener
    playBtn.addEventListener('click', function() {
        if (stationsSelect.value && stations[stationsSelect.value].stream) {
            audioPlayer.src = stations[stationsSelect.value].stream;
            audioPlayer.play()
                .then(() => {
                    playBtn.disabled = true;
                    pauseBtn.disabled = false;
                    stationName.textContent = 'Playing: ' + stations[stationsSelect.value].name;
                })
                .catch((error) => {
                    console.error('Error playing stream:', error);
                    alert('Error playing stream. Please try again.');
                });
        } else {
            alert('Please select a station first');
        }
    });
    
    // Pause button event listener
    pauseBtn.addEventListener('click', function() {
        audioPlayer.pause();
        playBtn.disabled = false;
        pauseBtn.disabled = true;
        stationName.textContent = 'Paused: ' + stations[stationsSelect.value].name;
    });
    
    // Volume slider event listener
    volumeSlider.addEventListener('input', function() {
        audioPlayer.volume = this.value / 100;
    });
    
    // Station selector event listener
    stationsSelect.addEventListener('change', function() {
        const selectedStation = stations[this.value];
        stationName.textContent = selectedStation.name;
        stationDescription.textContent = selectedStation.description;
        
        // Reset play/pause buttons
        playBtn.disabled = false;
        pauseBtn.disabled = true;
    });
});