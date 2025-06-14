
// Audio utilities for relaxation exercises and breathing techniques

// Audio tracks for relaxation exercises
const audioTracks = {
  "Guided Breathing": "/sounds/guided-breathing.mp3",
  "Ocean Waves": "https://soundcloud.com/relaxing-white-noise/ocean-waves-and-gentle-rain-75-minutes",
  "Forest Sounds": "https://soundcloud.com/soundsofnaturewhitenoiseformindfulnessmeditationandrelaxation/gentle-forest-stream-and",
  "Gentle Rain": "https://soundcloud.com/relaxing-white-noise/ocean-waves-and-gentle-rain-75-minutes",
  "Meditation": "https://soundcloud.com/relaxing-white-noise/meditation-bell-sound",
};

// Store current audio instance
let currentAudio: HTMLAudioElement | null = null;

// Play audio track
export const playAudio = (trackName: string) => {
  // Stop any currently playing audio
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }
  
  // Find the track path
  const audioPath = audioTracks[trackName as keyof typeof audioTracks];
  
  if (!audioPath) {
    console.error(`Audio track "${trackName}" not found`);
    return null;
  }
  
  // Create and play new audio
  const audio = new Audio(audioPath);
  audio.loop = true;
  
  console.log(`Attempting to play ${trackName} from path: ${audioPath}`);
  
  try {
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          currentAudio = audio;
          console.log(`Playing ${trackName} successfully`);
        })
        .catch(error => {
          console.error("Audio playback failed:", error);
          // Try fallback audio from a public CDN
          audio.src = "https://soundcloud.com/relaxing-white-noise/ocean-waves-and-gentle-rain-75-minutes";
          audio.play()
            .then(() => {
              currentAudio = audio;
              console.log("Playing fallback audio successfully");
            })
            .catch(innerError => {
              console.error("Fallback audio playback failed:", innerError);
            });
        });
    }
  } catch (error) {
    console.error("Audio playback error:", error);
    // Try fallback audio
    try {
      audio.src = "https://soundcloud.com/relaxing-white-noise/ocean-waves-and-gentle-rain-75-minutes";
      audio.play()
        .then(() => {
          currentAudio = audio;
          console.log("Playing fallback audio successfully");
        })
        .catch(innerError => {
          console.error("Fallback audio playback failed:", innerError);
        });
    } catch (fallbackError) {
      console.error("Fallback audio error:", fallbackError);
    }
  }
  
  return audio;
};

// Pause current audio
export const pauseAudio = () => {
  if (currentAudio) {
    currentAudio.pause();
  }
};

// Resume current audio
export const resumeAudio = () => {
  if (currentAudio && currentAudio.paused) {
    try {
      currentAudio.play()
        .catch(error => {
          console.error("Audio resume failed:", error);
        });
    } catch (error) {
      console.error("Audio resume error:", error);
    }
  }
};

// Set volume of current audio
export const setAudioVolume = (volume: number) => {
  if (currentAudio) {
    currentAudio.volume = Math.min(Math.max(volume, 0), 1); // Ensure volume is between 0 and 1
  }
};

export const getAvailableTracks = () => {
  return Object.keys(audioTracks);
};
