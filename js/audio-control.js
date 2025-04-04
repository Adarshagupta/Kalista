// Audio control functionality for Vimeo video

document.addEventListener('DOMContentLoaded', function() {
    // Fix for iOS 100vh issue
    fixIOSViewportHeight();

    // Handle video sizing for different devices
    handleVideoSizing();
    window.addEventListener('resize', handleVideoSizing);
    window.addEventListener('resize', fixIOSViewportHeight);
    window.addEventListener('orientationchange', handleVideoSizing);
    window.addEventListener('orientationchange', fixIOSViewportHeight);

    // We're not preventing scrolling, just hiding the scrollbars

    // Fix for iOS viewport height issues
    function fixIOSViewportHeight() {
        // First we get the viewport height and multiply it by 1% to get a value for a vh unit
        let vh = window.innerHeight * 0.01;
        // Then we set the value in the --vh custom property to the root of the document
        document.documentElement.style.setProperty('--vh', `${vh}px`);

        // Apply the height to relevant elements
        document.querySelector('.hero').style.height = `${window.innerHeight}px`;
        document.querySelector('.video-background').style.height = `${window.innerHeight}px`;
    }

    // Function to handle video sizing and positioning
    function handleVideoSizing() {
        const videoIframe = document.getElementById('vimeo-player');
        const videoContainer = document.querySelector('.video-background');
        const isPortrait = window.innerHeight > window.innerWidth;
        const isMobile = window.innerWidth <= 767;

        // Set container to full viewport height
        videoContainer.style.height = '100vh';

        if (isPortrait && isMobile) {
            // For portrait mobile, ensure video is centered and scaled up
            videoIframe.style.width = '100vw';
            videoIframe.style.height = '100vh';
            videoIframe.style.transform = 'translate(-50%, -50%) scale(1.5)';

            // Use Vimeo API to set quality if available
            if (window.Vimeo && player) {
                player.setQuality('720p'); // Set higher quality for better scaling
            }
        } else if (isMobile) {
            // For landscape mobile
            videoIframe.style.width = '100vw';
            videoIframe.style.height = '100vh';
            videoIframe.style.transform = 'translate(-50%, -50%) scale(1.2)';
        } else {
            // For desktop
            videoIframe.style.width = '100vw';
            videoIframe.style.height = '100vh';
            videoIframe.style.transform = 'translate(-50%, -50%) scale(1.01)';
        }

        // Force iframe to maintain aspect ratio fill
        videoIframe.style.objectFit = 'cover';
        videoIframe.style.objectPosition = 'center';
    }

    // Get the audio control button and Vimeo iframe
    const audioControl = document.getElementById('audio-control');
    const vimeoIframe = document.getElementById('vimeo-player');

    // Initialize Vimeo player API
    let player = null;

    // Load Vimeo Player API
    const script = document.createElement('script');
    script.src = 'https://player.vimeo.com/api/player.js';
    script.onload = initializePlayer;
    document.head.appendChild(script);

    // Initialize the Vimeo player
    function initializePlayer() {
        // Create a new Vimeo player instance
        player = new Vimeo.Player(vimeoIframe);

        // Set initial state (muted)
        player.setVolume(0);

        // Add pulse animation to draw attention to the audio button
        setTimeout(() => {
            audioControl.classList.add('pulse');
            setTimeout(() => {
                audioControl.classList.remove('pulse');
            }, 6000); // Pulse for 6 seconds
        }, 5000); // Start pulsing after 5 seconds

        // Add click event listener to the audio control button
        audioControl.addEventListener('click', toggleAudio);
    }

    // Toggle audio function
    function toggleAudio() {
        if (!player) return;

        if (audioControl.classList.contains('muted')) {
            // Unmute
            player.setVolume(1.0);
            audioControl.classList.remove('muted');
            audioControl.querySelector('.tooltip').textContent = 'Mute Audio';
        } else {
            // Mute
            player.setVolume(0);
            audioControl.classList.add('muted');
            audioControl.querySelector('.tooltip').textContent = 'Unmute Audio';
        }
    }

    // Handle visibility change to pause/play audio when tab is not active
    document.addEventListener('visibilitychange', function() {
        if (!player) return;

        if (document.hidden && !audioControl.classList.contains('muted')) {
            // Page is hidden and audio is playing, temporarily mute
            player.setVolume(0);
        } else if (!document.hidden && !audioControl.classList.contains('muted')) {
            // Page is visible again and audio should be playing
            player.setVolume(1.0);
        }
    });


});
