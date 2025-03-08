// Select all necessary elements
const trackCards = document.querySelectorAll('.track-card');
const audioPlayer = document.getElementById('audio-player');
const audioSource = document.getElementById('audio-source');
const trackNameDisplay = document.getElementById('track-name');
const progressBar = document.getElementById('progress-bar');
const playPauseBtn = document.getElementById('play-pause-btn');
const playIcon = document.getElementById('play-icon');
const pauseIcon = document.getElementById('pause-icon');
const volumeSlider = document.getElementById('volume-slider');

// Store currently active track card
let activeTrackCard = null;

// Function to play a track
function playTrack(card) {
    // Remove active class from previous track if any
    if (activeTrackCard) {
        activeTrackCard.classList.remove('active', 'selected');
    }
    
    // Add active class to current track
    card.classList.add('active', 'selected');
    activeTrackCard = card;
    
    const track = card.getAttribute('data-track');
    const trackName = card.getAttribute('data-name');

    // Update audio source and play the track
    audioSource.src = track;
    audioPlayer.load();
    audioPlayer.play();

    // Add fade-in effect to the track name display
    trackNameDisplay.style.opacity = 0;
    trackNameDisplay.style.transform = "translateY(-10px)";
    setTimeout(() => {
        trackNameDisplay.textContent = `Now Playing: ${trackName}`;
        trackNameDisplay.style.opacity = 1;
        trackNameDisplay.style.transform = "translateY(0)";
    }, 200);

    // Update play/pause icons
    playIcon.style.display = 'none';
    pauseIcon.style.display = 'inline';
}

// Add click event listeners to track cards
trackCards.forEach(card => {
    card.addEventListener('click', () => {
        playTrack(card);
    });
});

// Create random button
const createRandomButton = () => {
    // Create the random button element
    const randomBtn = document.createElement('button');
    randomBtn.id = 'random-btn';
    randomBtn.className = 'control-btn';
    randomBtn.innerHTML = '<i class="fa-solid fa-shuffle"></i>';
    randomBtn.title = 'Play Random Track';
    
    // Insert the random button after the play/pause button
    playPauseBtn.parentNode.insertBefore(randomBtn, playPauseBtn.nextSibling);
    
    // Add event listener to the random button
    randomBtn.addEventListener('click', playRandomTrack);
    
    return randomBtn;
};

// Function to play a random track
function playRandomTrack() {
    if (trackCards.length === 0) return;
    
    // Select a random track card
    const randomIndex = Math.floor(Math.random() * trackCards.length);
    const randomCard = trackCards[randomIndex];
    
    // Play the selected track
    playTrack(randomCard);
    
    // Add a visual indication (quick pulse animation)
    randomCard.classList.add('pulse-animation');
    setTimeout(() => {
        randomCard.classList.remove('pulse-animation');
    }, 1000);
}

// Update progress bar as track plays
audioPlayer.addEventListener('timeupdate', () => {
    const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    progressBar.style.width = `${progress}%`;
});

// Add play/pause functionality
playPauseBtn.addEventListener('click', () => {
    if (audioPlayer.paused) {
        audioPlayer.play();
        playIcon.style.display = 'none';
        pauseIcon.style.display = 'inline';
    } else {
        audioPlayer.pause();
        playIcon.style.display = 'inline';
        pauseIcon.style.display = 'none';
    }
});

// Add volume control functionality
volumeSlider.addEventListener('input', () => {
    audioPlayer.volume = volumeSlider.value;
});

// Play next track when current track ends
audioPlayer.addEventListener('ended', () => {
    // Either play the next track or go back to the first track
    if (activeTrackCard) {
        const nextTrack = activeTrackCard.nextElementSibling;
        if (nextTrack && nextTrack.classList.contains('track-card')) {
            playTrack(nextTrack);
        } else if (trackCards.length > 0) {
            // Loop back to the first track if at the end
            playTrack(trackCards[0]);
        }
    }
});

// Initialize the random button when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    createRandomButton();
    
    // Set initial volume from slider
    audioPlayer.volume = volumeSlider.value;
});