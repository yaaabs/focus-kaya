(function() {
  // DOM Elements
  let audio = new Audio();
  let playlistSelector, bgmToggle, volumeSlider, volumePercentage;
  let trackTitleElement, trackArtistElement;
  let playBtn, prevBtn, nextBtn, playIcon, pauseIcon;
  let progressBar, progressContainer, currentTimeElement, totalTimeElement;
  let shuffleBtn; // Shuffle button element
  // Track list elements
  let trackListContainer, trackList, trackListEmpty, trackSearchInput;
  // State
  let currentPlaylist = null;
  let currentPlaylistName = 'deep-focus'; // Track current playlist name
  let currentTrackIndex = 0;
  let playlists = {}; // To be populated
  let isPlaying = false;
  let isBGMEnabled = true; // Default to true, synced with localStorage
  let isShuffleMode = false; // Shuffle state
  let originalPlaylist = []; // Store original playlist order
  let allTracks = []; // Store all tracks for search functionality
  let filteredTracks = []; // Store filtered tracks based on search

  // Initialize BGM Player
  function init() {
    // Get DOM elements
    playlistSelector = document.getElementById('playlist-selector');
    bgmToggle = document.getElementById('bgm-toggle');
    volumeSlider = document.getElementById('bgm-volume-slider');
    volumePercentage = document.getElementById('bgm-volume-percentage');
    
    trackTitleElement = document.getElementById('bgm-track-title');
    trackArtistElement = document.getElementById('bgm-track-artist');
    
    playBtn = document.getElementById('bgm-play-btn');
    prevBtn = document.getElementById('bgm-prev-btn');
    nextBtn = document.getElementById('bgm-next-btn');
    playIcon = document.getElementById('bgm-play-icon');
    pauseIcon = document.getElementById('bgm-pause-icon');
      progressBar = document.getElementById('bgm-progress-bar');
    progressContainer = document.getElementById('bgm-progress-container');
    currentTimeElement = document.getElementById('bgm-current-time');
    totalTimeElement = document.getElementById('bgm-total-time');
    shuffleBtn = document.getElementById('bgm-shuffle-btn'); // New shuffle button
    
    // Track list elements
    trackListContainer = document.getElementById('track-list-container');
    trackList = document.getElementById('track-list');
    trackListEmpty = document.getElementById('track-list-empty');
    trackSearchInput = document.getElementById('track-search-input');
    trackListContainer = document.getElementById('track-list-container');
    trackList = document.getElementById('track-list');
    trackListEmpty = document.getElementById('track-list-empty');
    trackSearchInput = document.getElementById('track-search-input');

    // Load playlists with the actual audio files
    playlists = {
      'deep-focus': [
        { title: 'Clear Skies', artist: 'Aqua Scholar', src: 'audio/BGM/Deep focus study playlist/Clear Skies - Aqua Scholar.mp3' },
        { title: 'Gentle Ocean', artist: 'Sonic Strokes, Nahh Chill, Aqua Scholar', src: 'audio/BGM/Deep focus study playlist/Gentle Ocean - Sonic Strokes.mp3' },
        { title: 'Venusian Vespers', artist: 'Nahh Chill, Aqua Scholar', src: 'audio/BGM/Deep focus study playlist/Venusian Vespers.mp3' }
      ],
      'ambient-long': [
        { title: 'Lofi Hip-hop Chill Beats', artist: 'Various Artists', src: 'audio/BGM/Lofi Hip-hop Chill Beats.mp3' }
      ],
      'smile-demons': [
        {
          title: 'Anaheim',
          artist: 'NIKI',
          src: 'audio/BGM/Si all my demons have your smile pala to eh/Anaheim.mp3'
        },
        {
          title: 'Autumn',
          artist: 'NIKI',
          src: 'audio/BGM/Si all my demons have your smile pala to eh/Autumn.mp3'
        },
        {
          title: 'Backburner',
          artist: 'NIKI',
          src: 'audio/BGM/Si all my demons have your smile pala to eh/Backburner.mp3'
        },
        {
          title: 'Before',
          artist: 'NIKI',
          src: 'audio/BGM/Si all my demons have your smile pala to eh/Before.mp3'
        },
        {
          title: 'Chilly',
          artist: 'NIKI',
          src: 'audio/BGM/Si all my demons have your smile pala to eh/Chilly.mp3'
        },
        {
          title: 'Every Summertime',
          artist: 'NIKI',
          src: 'audio/BGM/Si all my demons have your smile pala to eh/Every Summertime.mp3'
        },
        {
          title: 'Facebook Friends',
          artist: 'NIKI',
          src: 'audio/BGM/Si all my demons have your smile pala to eh/Facebook Friends.mp3'
        },
        {
          title: 'Hallway Weather',
          artist: 'NIKI',
          src: 'audio/BGM/Si all my demons have your smile pala to eh/Hallway Weather.mp3'
        },
        {
          title: 'High School in Jakarta',
          artist: 'NIKI',
          src: 'audio/BGM/Si all my demons have your smile pala to eh/High School in Jakarta.mp3'
        },
        {
          title: 'I Like U',
          artist: 'NIKI',
          src: 'audio/BGM/Si all my demons have your smile pala to eh/I Like U.mp3'
        },
        {
          title: 'Indigo',
          artist: '88rising; NIKI',
          src: 'audio/BGM/Si all my demons have your smile pala to eh/Indigo.mp3'
        },
        {
          title: 'La La Lost You - Acoustic',
          artist: 'NIKI Acoustic Sessions Vol. 1',
          src: 'audio/BGM/Si all my demons have your smile pala to eh/La La Lost You - Acoustic.mp3'
        },
        {
          title: 'La La Lost You',
          artist: '88rising; NIKI',
          src: 'audio/BGM/Si all my demons have your smile pala to eh/La La Lost You.mp3'
        },
        {
          title: 'Lose',
          artist: 'NIKI',
          src: 'audio/BGM/Si all my demons have your smile pala to eh/Lose.mp3'
        },
        {
          title: 'lowkey',
          artist: 'NIKI',
          src: 'audio/BGM/Si all my demons have your smile pala to eh/lowkey.mp3'
        },
        {
          title: 'Newsflash!',
          artist: 'NIKI',
          src: 'audio/BGM/Si all my demons have your smile pala to eh/Newsflash!.mp3'
        },
        {
          title: 'Oceans & Engines',
          artist: 'NIKI',
          src: 'audio/BGM/Si all my demons have your smile pala to eh/Oceans & Engines.mp3'
        },
        {
          title: 'Plot Twist',
          artist: 'NIKI',
          src: 'audio/BGM/Si all my demons have your smile pala to eh/Plot Twist.mp3'
        },
        {
          title: 'See U Never',
          artist: 'NIKI',
          src: 'audio/BGM/Si all my demons have your smile pala to eh/See U Never.mp3'
        },
        {
          title: 'Selene',
          artist: 'NIKI',
          src: 'audio/BGM/Si all my demons have your smile pala to eh/Selene.mp3'
        },
        {
          title: 'Split',
          artist: '88rising; NIKI',
          src: 'audio/BGM/Si all my demons have your smile pala to eh/Split.mp3'
        },
        {
          title: 'Take A Chance With Me',
          artist: 'NIKI',
          src: 'audio/BGM/Si all my demons have your smile pala to eh/Take A Chance With Me.mp3'
        },
        {
          title: 'urs',
          artist: 'NIKI',
          src: 'audio/BGM/Si all my demons have your smile pala to eh/urs.mp3'
        },
        {
          title: 'Vintage',
          artist: 'NIKI',
          src: 'audio/BGM/Si all my demons have your smile pala to eh/Vintage.mp3'
        }
      ]
    };

    // Load settings from localStorage
    loadSettings();
    
    // Setup event listeners
    setupEventListeners();
      // Initial UI update
    updateTrackDisplay();
    updatePlayButtonIcon(); // Ensure correct icon on load
    updateVolumeDisplay();
    populateTrackList(currentPlaylistName); // Initialize track list

    // Set initial BGM enabled state
    setBGMEnabled(bgmToggle.checked);

    console.log('BGM Player Initialized');
    window.bgmPlayer.isInitialized = true;
  }
  // Load settings from localStorage
  function loadSettings() {
    const savedPlaylist = localStorage.getItem('bgmPlaylist') || 'deep-focus';
    const savedVolume = parseInt(localStorage.getItem('bgmVolume')) || 30;
    const savedBGMEnabled = localStorage.getItem('bgmEnabled') !== 'false'; // Defaults to true if not set
    const savedShuffleMode = localStorage.getItem('bgmShuffle') === 'true'; // Load shuffle setting

    if (playlistSelector) playlistSelector.value = savedPlaylist;
    if (volumeSlider) volumeSlider.value = savedVolume;
    if (bgmToggle) bgmToggle.checked = savedBGMEnabled;
    if (shuffleBtn) {
      shuffleBtn.classList.toggle('active', savedShuffleMode);
      shuffleBtn.setAttribute('aria-pressed', savedShuffleMode);
    }
    
    currentPlaylistName = savedPlaylist;
    currentPlaylist = playlists[savedPlaylist];
    audio.volume = savedVolume / 100;
    isBGMEnabled = savedBGMEnabled;
    isShuffleMode = savedShuffleMode;
  }

  // Set up event listeners
  function setupEventListeners() {    // Playlist selector
    if (playlistSelector) {
      playlistSelector.addEventListener('change', function() {
        currentPlaylistName = this.value;
        currentPlaylist = playlists[this.value];
        currentTrackIndex = 0;
        localStorage.setItem('bgmPlaylist', this.value);
        loadTrack(currentTrackIndex);
        populateTrackList(this.value); // Update track list
        if (isPlaying) playAudio(); // If it was playing, continue with new playlist
      });
    }    // Track search functionality
    if (trackSearchInput) {
      const trackSearchClear = document.getElementById('track-search-clear');
      
      trackSearchInput.addEventListener('input', function() {
        const query = this.value;
        searchTracks(query);
        
        // Show/hide clear button
        if (trackSearchClear) {
          trackSearchClear.style.display = query.length > 0 ? 'flex' : 'none';
        }
      });
      
      // Clear button functionality
      if (trackSearchClear) {
        trackSearchClear.addEventListener('click', function() {
          trackSearchInput.value = '';
          searchTracks('');
          this.style.display = 'none';
          trackSearchInput.focus();
        });
      }
      
      // Add keyboard navigation for search
      trackSearchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
          // Play first track in filtered results
          if (filteredTracks.length > 0) {
            playTrackFromList(filteredTracks[0].index);
          }
        } else if (e.key === 'Escape') {
          // Clear search
          this.value = '';
          searchTracks('');
          if (trackSearchClear) {
            trackSearchClear.style.display = 'none';
          }
          this.blur();
        }
      });
    }

    // BGM toggle
    if (bgmToggle) {
      bgmToggle.addEventListener('change', function() {
        setBGMEnabled(this.checked);
        localStorage.setItem('bgmEnabled', this.checked);
      });
    }

    // Volume slider
    if (volumeSlider) {
      volumeSlider.addEventListener('input', function() {
        const volume = parseInt(this.value);
        audio.volume = volume / 100;
        localStorage.setItem('bgmVolume', volume);
        updateVolumeDisplay();
      });
    }

    // Control buttons
    if (playBtn) playBtn.addEventListener('click', togglePlayPause);
    if (prevBtn) prevBtn.addEventListener('click', previousTrack);
    if (nextBtn) nextBtn.addEventListener('click', nextTrack);

    // Shuffle button
    if (shuffleBtn) {
      shuffleBtn.addEventListener('click', toggleShuffle);
    }

    // Audio events
    audio.addEventListener('loadedmetadata', function() {
      updateTrackDisplay();
      // Update duration display when metadata is loaded
      if (totalTimeElement) {
        totalTimeElement.textContent = formatTime(audio.duration);
      }
    });
    
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', nextTrackAuto);
      // Play/pause state change events
    audio.addEventListener('play', function() {
      isPlaying = true;
      updatePlayButtonIcon();
      updateActiveTrack(); // Update track list UI
      // Sync with mini player if open
      if (window.miniMusicPlayer && typeof window.miniMusicPlayer.sync === 'function') {
        window.miniMusicPlayer.sync();
      }
    });
    
    audio.addEventListener('pause', function() {
      isPlaying = false;
      updatePlayButtonIcon();
      updateActiveTrack(); // Update track list UI
      // Sync with mini player if open
      if (window.miniMusicPlayer && typeof window.miniMusicPlayer.sync === 'function') {
        window.miniMusicPlayer.sync();
      }
    });

    // Click on progress bar to seek
    if (progressContainer) {
      progressContainer.addEventListener('click', function(e) {
        if (!currentPlaylist || !audio.duration) return;
        
        const rect = progressContainer.getBoundingClientRect();
        const clickPosition = (e.clientX - rect.left) / rect.width;
        audio.currentTime = clickPosition * audio.duration;
        
        // Update progress bar
        const progress = (clickPosition * 100) + '%';
        progressBar.style.width = progress;
        
        // Update progress circle
        const progressCircle = document.getElementById('bgm-progress-circle');
        if (progressCircle) {
          progressCircle.style.left = progress;
        }
      });
    }

    // Add autoplay functionality - when track ends, play next track
    if (audio) {
      audio.addEventListener('ended', function() {
        console.log('Track ended, auto-advancing to next track');
        nextTrack();
        // Auto-play the next track
        if (currentPlaylist && currentTrackIndex < currentPlaylist.length) {
          setTimeout(() => {
            playAudio();
          }, 500); // Small delay for smooth transition
        }
      });

      // Add error handling for failed track loads
      audio.addEventListener('error', function(e) {
        console.error('Error loading track:', e);
        // Try to skip to next track if current one fails
        nextTrack();
        if (currentPlaylist && currentTrackIndex < currentPlaylist.length) {
          setTimeout(() => {
            playAudio();
          }, 1000);
        }
      });
    }
  }

  // Enable/disable BGM
  function setBGMEnabled(enabled) {
    isBGMEnabled = enabled;
    const bgmPlayerEl = document.querySelector('.bgm-player');
    
    if (bgmPlayerEl) {
      if (enabled) {
        // Enable player
        bgmPlayerEl.classList.remove('disabled');
      } else {
        // Disable player and stop audio if playing
        bgmPlayerEl.classList.add('disabled');
        if (isPlaying) {
          pauseAudio();
        }
      }
    }
    
    // Update controls
    if (playBtn) playBtn.disabled = !enabled;
    if (prevBtn) prevBtn.disabled = !enabled;
    if (nextBtn) nextBtn.disabled = !enabled;
    if (playlistSelector) playlistSelector.disabled = !enabled;
    if (volumeSlider) volumeSlider.disabled = !enabled;
    
    // Sync with mini player if it's open
    if (window.miniMusicPlayer && typeof window.miniMusicPlayer.sync === 'function') {
      window.miniMusicPlayer.sync();
    }
  }
  // Load a track
  function loadTrack(index) {
    if (!currentPlaylist || index < 0 || index >= currentPlaylist.length) {
      if (trackTitleElement) trackTitleElement.textContent = 'Select a playlist';
      if (trackArtistElement) trackArtistElement.textContent = 'and press play';
      if (currentTimeElement) currentTimeElement.textContent = '0:00';
      if (totalTimeElement) totalTimeElement.textContent = '0:00';
      if (progressBar) progressBar.style.width = '0%';
      return;
    }
    
    currentTrackIndex = index;
    const track = currentPlaylist[currentTrackIndex];
    audio.src = track.src;
    
    // Update display elements
    if (trackTitleElement) trackTitleElement.textContent = track.title;
    if (trackArtistElement) trackArtistElement.textContent = track.artist;
    if (currentTimeElement) currentTimeElement.textContent = '0:00';
    if (totalTimeElement) totalTimeElement.textContent = '0:00';
    if (progressBar) progressBar.style.width = '0%';
    
    // Update track list UI
    updateActiveTrack();
    
    // Once metadata is loaded, the loadedmetadata event will update the duration
  }

  // Play audio
  function playAudio() {
    if (!isBGMEnabled || !currentPlaylist) return;
    
    if (!audio.src && currentPlaylist.length > 0) {
      loadTrack(0);
    }
    
    if (audio.src) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.then(_ => {
          // The play() Promise is successfully resolved
          isPlaying = true;
          updatePlayButtonIcon();
        }).catch(error => {
          console.error('Error playing audio:', error);
          isPlaying = false;
          updatePlayButtonIcon();
        });
      }
    }
  }

  // Pause audio
  function pauseAudio() {
    audio.pause();
    isPlaying = false;
    updatePlayButtonIcon();
  }

  // Toggle play/pause
  function togglePlayPause() {
    if (!isBGMEnabled) return;
    
    if (isPlaying) {
      pauseAudio();
    } else {
      playAudio();
    }
  }

  // Previous track
  function previousTrack() {
    if (!isBGMEnabled || !currentPlaylist) return;
    
    let newIndex = currentTrackIndex - 1;
    if (newIndex < 0) {
      newIndex = currentPlaylist.length - 1;
    }
    
    loadTrack(newIndex);
    
    // If it was playing, continue playing the new track
    if (isPlaying) {
      playAudio();
    }
  }

  // Next track
  function nextTrack() {
    if (!isBGMEnabled || !currentPlaylist) return;
    
    let newIndex = currentTrackIndex + 1;
    if (newIndex >= currentPlaylist.length) {
      newIndex = 0;
    }
    
    loadTrack(newIndex);
    
    // If it was playing, continue playing the new track
    if (isPlaying) {
      playAudio();
    }
  }

  // Auto play next track when current one ends
  function nextTrackAuto() {
    nextTrack();
  }

  // Update track display
  function updateTrackDisplay() {
    if (!currentPlaylist || currentTrackIndex >= currentPlaylist.length) {
      if (trackTitleElement) trackTitleElement.textContent = 'Select a playlist';
      if (trackArtistElement) trackArtistElement.textContent = 'and press play';
      return;
    }
    
    const track = currentPlaylist[currentTrackIndex];
    if (trackTitleElement) trackTitleElement.textContent = track.title;
    if (trackArtistElement) trackArtistElement.textContent = track.artist;
  }

  // Update play/pause button icon
  function updatePlayButtonIcon() {
    if (!playIcon || !pauseIcon) return;
    
    if (isPlaying) {
      playIcon.style.display = 'none';
      pauseIcon.style.display = 'block';
    } else {
      playIcon.style.display = 'block';
      pauseIcon.style.display = 'none';
    }
  }

  // Update volume display
  function updateVolumeDisplay() {
    if (volumePercentage && volumeSlider) {
      volumePercentage.textContent = volumeSlider.value + '%';
    }
  }

  // Update progress bar and time display
  function updateProgress() {
    // Update progress bar
    if (progressBar && audio.duration) {
      const progress = (audio.currentTime / audio.duration) * 100;
      progressBar.style.width = progress + '%';
    }
    
    // Update current time display
    if (currentTimeElement) {
      currentTimeElement.textContent = formatTime(audio.currentTime);
    }
    
    // Update total time if needed (in case it wasn't available initially)
    if (totalTimeElement && audio.duration && totalTimeElement.textContent === '0:00') {
      totalTimeElement.textContent = formatTime(audio.duration);
    }
    
    // Update progress circle position
    const progressCircle = document.getElementById('bgm-progress-circle');
    if (progressCircle) {
      const progress = (audio.currentTime / audio.duration) * 100;
      progressCircle.style.left = progress + '%';
    }
  }

  // Format time in MM:SS
  function formatTime(seconds) {
    if (!seconds || isNaN(seconds)) return '0:00';
    
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  // Toggle shuffle mode
  function toggleShuffle() {
    isShuffleMode = !isShuffleMode;
    
    // Update UI if button exists
    const shuffleBtn = document.getElementById('bgm-shuffle-btn');
    if (shuffleBtn) {
      shuffleBtn.classList.toggle('active', isShuffleMode);
      shuffleBtn.setAttribute('aria-pressed', isShuffleMode);
    }
    
    // If we're currently in a playlist
    if (currentPlaylist.length > 0) {
      // Remember the current track
      const currentTrack = currentPlaylist[currentTrackIndex];
      const wasPlaying = isPlaying;
      
      if (isShuffleMode) {
        // Turn shuffle on - store original order if not already stored
        if (originalPlaylist.length === 0) {
          originalPlaylist = [...currentPlaylist];
        }
        
        // Create a new shuffled playlist
        const newShuffledPlaylist = [...originalPlaylist];
        shuffleArray(newShuffledPlaylist);
        
        // If we have a current track playing, make sure it stays as the current track
        if (currentTrack) {
          // Find its position in the new shuffled array
          const newIndex = newShuffledPlaylist.findIndex(track => 
            track.src === currentTrack.src);
          
          if (newIndex !== -1) {
            currentTrackIndex = newIndex;
          } else {
            // If for some reason we can't find the track, reset to first track
            currentTrackIndex = 0;
            console.warn("Could not find current track in shuffled playlist");
          }
        }
        
        currentPlaylist = newShuffledPlaylist;
        
      } else {
        // Turn shuffle off - restore original order
        if (originalPlaylist.length > 0) {
          // Find the current track's position in the original playlist
          if (currentTrack) {
            const originalIndex = originalPlaylist.findIndex(track => 
              track.src === currentTrack.src);
            
            currentPlaylist = [...originalPlaylist];
            
            if (originalIndex !== -1) {
              currentTrackIndex = originalIndex;
            } else {
              // Safety check - this shouldn't happen but just in case
              currentTrackIndex = 0;
              console.warn("Could not find current track in original playlist");
            }
          } else {
            currentPlaylist = [...originalPlaylist];
            currentTrackIndex = 0;
          }
        }
      }
      
      // Update the display
      updateTrackDisplay();
      
      // Resume playback if it was playing
      if (wasPlaying && !isPlaying) {
        play();
      }
    }
    
    // Save the setting
    saveSettings();
    
    console.log(`Shuffle mode ${isShuffleMode ? 'enabled' : 'disabled'}`);
  }
  
  // Use Fisher-Yates shuffle algorithm for better randomization
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  // Replace the shufflePlaylist function with a call to our shuffleArray function
  function shufflePlaylist() {
    shuffleArray(currentPlaylist);
  }

  // Load a playlist
  function loadPlaylist(playlistName) {
    if (!playlists[playlistName]) {
      console.error(`Playlist '${playlistName}' not found`);
      return;
    }
    
    currentPlaylistName = playlistName;
    originalPlaylist = [...playlists[playlistName]]; // Store original order
    currentPlaylist = [...originalPlaylist]; // Create a copy to manipulate
    
    if (isShuffleMode) {
      shuffleArray(currentPlaylist);
    }
    
    currentTrackIndex = 0;
    updateTrackDisplay();
    
    // Preload first track
    audio.src = currentPlaylist[0].src;
    audio.load();
    
    // Save to settings
    saveSettings();
  }

  // Play track with better error handling
  function play() {
    if (!isBGMEnabled || currentPlaylist.length === 0) return;
    
    try {
      if (!currentPlaylist[currentTrackIndex]) {
        console.warn("Invalid track index, resetting to 0");
        currentTrackIndex = 0;
        if (!currentPlaylist[currentTrackIndex]) {
          console.error("No tracks available to play");
          return;
        }
      }
      
      audio.src = currentPlaylist[currentTrackIndex].src;
      audio.load();
      
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          isPlaying = true;
          updatePlayButton();
          updateTrackDisplay();
          startProgressUpdates();
          console.log(`Playing: ${currentPlaylist[currentTrackIndex].title}`);
        }).catch(error => {
          console.error('Audio playback failed:', error);
          isPlaying = false;
          updatePlayButton();
        });
      }
      
    } catch (error) {
      console.error('Failed to play audio:', error);
      isPlaying = false;
      updatePlayButton();
    }
  }
  // Track list management functions
  function populateTrackList(playlistName) {
    if (!trackList || !trackListContainer) return;
    
    const playlist = playlists[playlistName];
    if (!playlist || playlist.length === 0) {
      showEmptyTrackList();
      return;
    }
    
    // Store all tracks for search functionality
    allTracks = playlist.map((track, index) => ({
      ...track,
      index: index,
      playlistName: playlistName
    }));
    
    filteredTracks = [...allTracks];
    renderTrackList();
    showTrackList();
    
    // Update track count in header
    updateTrackListHeader(playlist.length, playlist.length);
  }
  
  function renderTrackList() {
    if (!trackList) return;
    
    trackList.innerHTML = '';
    
    filteredTracks.forEach((track, displayIndex) => {
      const trackItem = createTrackItem(track, displayIndex);
      trackList.appendChild(trackItem);
    });
    
    updateActiveTrack();
  }
  function createTrackItem(track, displayIndex) {
    const trackItem = document.createElement('div');
    trackItem.className = 'track-item';
    trackItem.dataset.trackIndex = track.index;
    
    // Get search query for highlighting
    const searchQuery = trackSearchInput ? trackSearchInput.value : '';
    const highlightedTitle = highlightSearchText(track.title, searchQuery);
    const highlightedArtist = highlightSearchText(track.artist, searchQuery);
    
    // Get album art for this track
    const albumArtPath = getTrackAlbumArt(track);
    
    trackItem.innerHTML = `
      <div class="track-playing-indicator">
        <div class="track-playing-bars">
          <div class="track-playing-bar"></div>
          <div class="track-playing-bar"></div>
          <div class="track-playing-bar"></div>
          <div class="track-playing-bar"></div>
        </div>
      </div>
      <div class="track-number">${displayIndex + 1}</div>
      <div class="track-album-art">
        ${albumArtPath ? 
          `<img src="${albumArtPath}" alt="${track.title} album art" class="track-art-image">` : 
          `<div class="track-art-placeholder">🎵</div>`
        }
      </div>
      <div class="track-item-info">
        <div class="track-item-title">${highlightedTitle}</div>
        <div class="track-item-artist">${highlightedArtist}</div>
      </div>
      <div class="track-item-actions">
        <button class="track-action-btn track-play-btn" title="Play track">
          <svg viewBox="0 0 24 24" width="16" height="16">
            <path fill="currentColor" d="M8,5.14V19.14L19,12.14L8,5.14Z" />
          </svg>
        </button>
      </div>
    `;
      // Add click handlers
    trackItem.addEventListener('click', function(e) {
      if (e.target.closest('.track-action-btn')) return;
      playTrackFromList(track.index);
    });
    
    // Add double-click for instant play
    trackItem.addEventListener('dblclick', function(e) {
      e.preventDefault();
      playTrackFromList(track.index);
    });
    
    const playBtn = trackItem.querySelector('.track-play-btn');
    if (playBtn) {
      playBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        playTrackFromList(track.index);
      });
    }
    
    return trackItem;
  }
  
  function playTrackFromList(trackIndex) {
    if (!isBGMEnabled || !currentPlaylist || trackIndex < 0 || trackIndex >= currentPlaylist.length) {
      return;
    }
    
    currentTrackIndex = trackIndex;
    loadTrack(trackIndex);
    playAudio();
    updateActiveTrack();
  }
  
  function updateActiveTrack() {
    if (!trackList) return;
    
    const trackItems = trackList.querySelectorAll('.track-item');
    
    trackItems.forEach(item => {
      const itemIndex = parseInt(item.dataset.trackIndex);
      const isActive = itemIndex === currentTrackIndex;
      const isPlaying = isActive && window.bgmPlayer && window.bgmPlayer.isPlaying();
      
      item.classList.toggle('active', isActive);
      item.classList.toggle('playing', isPlaying);
    });
  }
  
  function showTrackList() {
    if (trackListEmpty) trackListEmpty.style.display = 'none';
    if (trackList) trackList.classList.add('show');
  }
  
  function showEmptyTrackList() {
    if (trackList) trackList.classList.remove('show');
    if (trackListEmpty) trackListEmpty.style.display = 'flex';
  }
    function searchTracks(query) {
    if (!query.trim()) {
      filteredTracks = [...allTracks];
    } else {
      const searchTerm = query.toLowerCase();
      filteredTracks = allTracks.filter(track => 
        track.title.toLowerCase().includes(searchTerm) ||
        track.artist.toLowerCase().includes(searchTerm)
      );
    }
    
    if (filteredTracks.length === 0) {
      showNoResults();
    } else {
      renderTrackList();
      showTrackList();
    }
    
    // Update header with search results count
    updateTrackListHeader(filteredTracks.length, allTracks.length);
  }
  
  function updateTrackListHeader(showing, total) {
    const trackListTitle = document.querySelector('.track-list-title');
    if (trackListTitle) {
      if (showing === total) {
        trackListTitle.textContent = `Track List (${total})`;
      } else {
        trackListTitle.textContent = `Track List (${showing} of ${total})`;
      }
    }
  }
    function showNoResults() {
    if (!trackList) return;
    
    trackList.innerHTML = `
      <div class="track-list-no-results">
        <svg viewBox="0 0 24 24" width="32" height="32">
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.35-4.35"></path>
        </svg>
        <div>No tracks found</div>
      </div>
    `;
    trackList.classList.add('show');
    if (trackListEmpty) trackListEmpty.style.display = 'none';
    
    // Update header to show no results
    updateTrackListHeader(0, allTracks.length);
  }
    function highlightSearchText(text, query) {
    if (!query.trim()) return text;
    
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(regex, '<span class="highlight">$1</span>');
  }
  
  // Get album art for a specific track
  function getTrackAlbumArt(track) {
    // Track-specific album art mapping
    const TRACK_ALBUM_ART_MAP = {

      'Clear Skies': 'images/album-art/clear skies.jpg',
      'Gentle Ocean': 'images/album-art/gentle ocean.jpg',
      'Venusian Vespers': 'images/album-art/venusian vespers.jpg',

      // Nicole Playlist tracks
      'Anaheim': 'images/album-art/nicole.jpg',
      'Autumn': 'images/album-art/nicole.jpg',
      'Backburner': 'images/album-art/nicole.jpg',
      'Before': 'images/album-art/nicole.jpg',
      'Facebook Friends': 'images/album-art/nicole.jpg',
      'High School in Jakarta': 'images/album-art/nicole.jpg',
      'Oceans & Engines': 'images/album-art/nicole.jpg',
      'Take A Chance With Me': 'images/album-art/nicole.jpg',

      'Chilly': 'images/album-art/chilly.jpg',
      'Every Summertime': 'images/album-art/every summertime.jpg',
      'Hallway Weather': 'images/album-art/hallway weather.jpg',
      'Indigo': 'images/album-art/hitc2.jpg',
      'La La Lost You - Acoustic': 'images/album-art/nas_hitc2.jpg',
      'La La Lost You': 'images/album-art/hitc2.jpg',
      'Split': 'images/album-art/split.jpg',
      'Vintage': 'images/album-art/zephyr.jpg',
      'I Like U': 'images/album-art/i like u.jpg',
      'Lose': 'images/album-art/moonchild.jpg',
      'lowkey': 'images/album-art/lowkey.jpg',
      'Newsflash!': 'images/album-art/zephyr.jpg',
      'Plot Twist': 'images/album-art/moonchild.jpg',
      'See U Never': 'images/album-art/see u never.jpg',
      'Selene': 'images/album-art/moonchild.jpg',    
      'urs': 'images/album-art/wttd.jpg'

    };
    
    // Playlist-based album art mapping (fallback)
    const PLAYLIST_ALBUM_ART_MAP = {
      'deep-focus': 'images/album-art/focus.png',
      'ambient-long': 'images/album-art/ambient.jpg',
      'smile-demons': 'images/album-art/niki.png'
    };
    
    // First try track-specific album art
    if (track && track.title) {
      const trackAlbumArt = TRACK_ALBUM_ART_MAP[track.title];
      if (trackAlbumArt) {
        return trackAlbumArt;
      }
    }
    
    // Fallback to playlist-based album art
    if (track && track.playlistName) {
      return PLAYLIST_ALBUM_ART_MAP[track.playlistName];
    }
    
    return null;
  }

  // BGM Player functionality
  (function() {
    // Album art mapping (copied from mini music player)
    const ALBUM_ART_MAP = {
      'deep-focus': 'images/album-art/focus.png',
      'ambient-long': 'images/album-art/ambient.jpg',
      'smile-demons': 'images/album-art/niki.png'
    };

    // Track-specific album art mapping (copied from mini music player)
    const TRACK_ALBUM_ART_MAP = {

      // Deep Focus tracks
      'Clear Skies': 'images/album-art/clear skies.jpg',
      'Gentle Ocean': 'images/album-art/gentle ocean.jpg',
      'Venusian Vespers': 'images/album-art/venusian vespers.jpg',

      // Nicole Playlist tracks
      'Anaheim': 'images/album-art/nicole.jpg',
      'Autumn': 'images/album-art/nicole.jpg',
      'Backburner': 'images/album-art/nicole.jpg',
      'Before': 'images/album-art/nicole.jpg',
      'Facebook Friends': 'images/album-art/nicole.jpg',
      'High School in Jakarta': 'images/album-art/nicole.jpg',
      'Oceans & Engines': 'images/album-art/nicole.jpg',
      'Take A Chance With Me': 'images/album-art/nicole.jpg',

      'Chilly': 'images/album-art/chilly.jpg',
      'Every Summertime': 'images/album-art/every summertime.jpg',
      'Hallway Weather': 'images/album-art/hallway weather.jpg',
      'Indigo': 'images/album-art/hitc2.jpg',
      'La La Lost You - Acoustic': 'images/album-art/nas_hitc2.jpg',
      'La La Lost You': 'images/album-art/hitc2.jpg',
      'Split': 'images/album-art/split.jpg',
      'Vintage': 'images/album-art/zephyr.jpg',
      'I Like U': 'images/album-art/i like u.jpg',
      'Lose': 'images/album-art/moonchild.jpg',
      'lowkey': 'images/album-art/lowkey.jpg',
      'Newsflash!': 'images/album-art/zephyr.jpg',
      'Plot Twist': 'images/album-art/moonchild.jpg',
      'See U Never': 'images/album-art/see u never.jpg',
      'Selene': 'images/album-art/moonchild.jpg',    
      'urs': 'images/album-art/wttd.jpg'

    };

    // Get album art path based on current track or playlist
    function getBgmAlbumArtPath() {
      if (!window.bgmPlayer || typeof window.bgmPlayer.getCurrentTrack !== 'function') {
        return null;
      }
      
      // First, try to get track-specific album art
      const currentTrack = window.bgmPlayer.getCurrentTrack();
      if (currentTrack && currentTrack.title) {
        const trackAlbumArt = TRACK_ALBUM_ART_MAP[currentTrack.title];
        if (trackAlbumArt) {
          return trackAlbumArt;
        }
      }
      
      // Fallback to playlist-based album art
      if (typeof window.bgmPlayer.getCurrentPlaylist === 'function') {
        const currentPlaylist = window.bgmPlayer.getCurrentPlaylist();
        return currentPlaylist ? ALBUM_ART_MAP[currentPlaylist] : null;
      }
      
      return null;
    }

    // Update BGM album art display
    function updateBgmAlbumArt() {
      const albumArt = document.getElementById('bgm-album-art');
      const placeholder = document.getElementById('bgm-album-art-placeholder');
      const currentTrackEl = document.getElementById('bgm-current-track');
      const currentArtistEl = document.getElementById('bgm-current-artist');
      const artPath = getBgmAlbumArtPath();
      
      if (artPath && albumArt && placeholder) {
        albumArt.src = artPath;
        albumArt.style.display = 'block';
        placeholder.style.display = 'none';
        
        // Add spinning animation when playing
        const isPlaying = window.bgmPlayer && window.bgmPlayer.isPlaying();
        albumArt.classList.toggle('spinning', isPlaying);
      } else if (albumArt && placeholder) {
        albumArt.style.display = 'none';
        placeholder.style.display = 'flex';
      }
      
      // Update track information display
      if (window.bgmPlayer && typeof window.bgmPlayer.getCurrentTrack === 'function') {
        const currentTrack = window.bgmPlayer.getCurrentTrack();
        if (currentTrack && currentTrackEl && currentArtistEl) {
          currentTrackEl.textContent = currentTrack.title || 'Unknown Track';
          currentArtistEl.textContent = currentTrack.artist || 'Unknown Artist';
        } else if (currentTrackEl && currentArtistEl) {
          currentTrackEl.textContent = 'No track selected';
          currentArtistEl.textContent = 'Select a playlist and press play';
        }
      }
    }

    // Update BGM play button state and album art
    function updateBgmPlayButton(isPlaying = false) {
      const playIcon = document.getElementById('bgm-play-icon');
      const pauseIcon = document.getElementById('bgm-pause-icon');
      const albumArt = document.getElementById('bgm-album-art');
      
      if (playIcon && pauseIcon) {
        if (isPlaying) {
          playIcon.style.display = 'none';
          pauseIcon.style.display = 'block';
        } else {
          playIcon.style.display = 'block';
          pauseIcon.style.display = 'none';
        }
      }
      
      // Update album art spinning animation
      if (albumArt) {
        albumArt.classList.toggle('spinning', isPlaying);
      }
      
      // Also update album art in case track changed
      updateBgmAlbumArt();
    }

    // Initialize BGM player when DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
      // Initialize album art
      updateBgmAlbumArt();
      
      // Set up periodic updates for album art
      setInterval(function() {
        if (document.getElementById('bgm-album-art')) {
          updateBgmAlbumArt();
        }
      }, 1000);
    });

    // Expose functions for external use
    window.updateBgmAlbumArt = updateBgmAlbumArt;
    window.updateBgmPlayButton = updateBgmPlayButton;
  })();

  // Public API
  window.bgmPlayer = {
    init: init,
    toggle: togglePlayPause,
    play: playAudio,
    pause: pauseAudio,
    next: nextTrack,
    previous: previousTrack,
    isPlaying: function() { return isPlaying; },
    isBGMEnabled: function() { return isBGMEnabled; },
    getVolume: function() { 
      return parseInt(volumeSlider ? volumeSlider.value : 30); 
    },
    setVolume: function(volume) {
      if (volumeSlider) volumeSlider.value = volume;
      if (volumePercentage) volumePercentage.textContent = volume + '%';
      audio.volume = volume / 100;
      localStorage.setItem('bgmVolume', volume);
    },
    getCurrentTrack: function() {
      if (!currentPlaylist || currentTrackIndex >= currentPlaylist.length) return null;
      return currentPlaylist[currentTrackIndex];
    },
    getProgress: function() {
      if (!audio.duration) return 0;
      return (audio.currentTime / audio.duration) * 100;
    },
    getCurrentTime: function() {
      return audio.currentTime || 0;
    },
    getDuration: function() {
      return audio.duration || 0;
    },
    seek: function(time) {
      if (audio.duration && time >= 0 && time <= audio.duration) {
        audio.currentTime = time;
      }
    },    setBGMEnabled: setBGMEnabled,
    isInitialized: false,
    toggleShuffle: toggleShuffle,
    isShuffleMode: function() { return isShuffleMode; },
    getCurrentPlaylist: function() { return currentPlaylistName; }
  };

  // Initialize when DOM is ready
  document.addEventListener('DOMContentLoaded', function() {
    // Small delay to ensure DOM is fully loaded
    setTimeout(init, 100);
  });
})();