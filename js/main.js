document.addEventListener('DOMContentLoaded', function() {
    const playBtn = document.getElementById('play-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const volumeSlider = document.getElementById('volume-slider');
    const stationsSelect = document.getElementById('stations');
    const stationName = document.getElementById('station-name');
    const stationDescription = document.getElementById('station-description');
    
    // Station data
    const stations = {
        '': { name: 'Select a Station', description: 'Choose from our collection of radio stations' },
        'station1': { name: 'Jazz Lounge', description: 'Smooth jazz for your listening pleasure' },
        'station2': { name: 'Rock Classics', description: 'The greatest rock hits from the 70s, 80s, and 90s' },
        'station3': { name: 'Classical Music', description: 'Timeless classical compositions' }
    };
    
    // Play button event listener
    playBtn.addEventListener('click', function() {
        if (stationsSelect.value) {
            playBtn.disabled = true;
            pauseBtn.disabled = false;
            stationName.textContent = 'Playing: ' + stations[stationsSelect.value].name;
        } else {
            alert('Please select a station first');
        }
    });
    
    // Pause button event listener
    pauseBtn.addEventListener('click', function() {
        playBtn.disabled = false;
        pauseBtn.disabled = true;
        stationName.textContent = 'Paused: ' + stations[stationsSelect.value].name;
    });
    
    // Volume slider event listener
    volumeSlider.addEventListener('input', function() {
        // In a real app, this would control the actual volume
        console.log('Volume set to: ' + this.value + '%');
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