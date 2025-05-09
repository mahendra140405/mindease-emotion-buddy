
// Audio utilities for relaxation exercises and breathing techniques

// Audio tracks for relaxation exercises
const audioTracks = {
  "Guided Breathing": "/relaxation/guided-breathing.mp3",
  "Ocean Waves": "/relaxation/ocean-waves.mp3",
  "Forest Sounds": "/relaxation/forest-sounds.mp3",
  "Meditation": "/relaxation/meditation.mp3",
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
  
  // Use dummy path if actual audio file doesn't exist yet
  const audioPath = audioTracks[trackName as keyof typeof audioTracks] || "/relaxation/sample.mp3";
  
  // Create and play new audio
  const audio = new Audio(audioPath);
  audio.loop = true;
  
  const playPromise = audio.play();
  if (playPromise !== undefined) {
    playPromise
      .then(() => {
        currentAudio = audio;
        console.log(`Playing ${trackName}`);
      })
      .catch(error => {
        console.error("Audio playback failed:", error);
      });
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
  if (currentAudio) {
    currentAudio.play();
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
