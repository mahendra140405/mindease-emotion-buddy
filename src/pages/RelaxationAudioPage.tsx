
import { useState } from "react";
import NavBar from "@/components/NavBar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { playAudio, pauseAudio, setAudioVolume } from "@/utils/audioUtils";
import { Play, Pause, Volume2, Volume1, VolumeX } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";

interface AudioTrack {
  id: string;
  title: string;
  description: string;
  duration: string;
  audioSrc: string;
}

const audioTracks: AudioTrack[] = [
  {
    id: "1",
    title: "Ocean Waves",
    description: "Calming sounds of gentle ocean waves breaking on the shore.",
    duration: "10 minutes",
    audioSrc: "/sounds/ocean-waves.mp3"
  },
  {
    id: "2",
    title: "Gentle Rain",
    description: "Soothing sounds of rainfall to help you relax and unwind.",
    duration: "15 minutes",
    audioSrc: "/sounds/gentle-rain.mp3"
  },
  {
    id: "3",
    title: "Forest Sounds",
    description: "Immerse yourself in the peaceful sounds of a forest environment.",
    duration: "20 minutes",
    audioSrc: "/sounds/forest-sounds.mp3"
  },
  {
    id: "4",
    title: "Meditation Bell",
    description: "Periodic meditation bell sounds to guide your mindfulness practice.",
    duration: "12 minutes",
    audioSrc: "https://assets.mixkit.co/sfx/preview/mixkit-meditation-bell-599.mp3"
  }
];

const RelaxationAudioPage = () => {
  const [playingTrack, setPlayingTrack] = useState<string | null>(null);
  const [volume, setVolume] = useState<number>(0.7);
  const { toast } = useToast();

  const handlePlayPause = (track: AudioTrack) => {
    if (playingTrack === track.title) {
      // Currently playing this track, so pause it
      pauseAudio();
      setPlayingTrack(null);
      toast({
        title: "Audio Paused",
        description: `${track.title} has been paused`,
      });
    } else {
      // Play this track
      playAudio(track.title);
      setPlayingTrack(track.title);
      setAudioVolume(volume);
      toast({
        title: "Now Playing",
        description: `${track.title} - ${track.description}`,
      });
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    setAudioVolume(newVolume);
  };

  const getVolumeIcon = () => {
    if (volume === 0) return <VolumeX className="h-4 w-4" />;
    if (volume < 0.5) return <Volume1 className="h-4 w-4" />;
    return <Volume2 className="h-4 w-4" />;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <NavBar />
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-center mb-8 text-mindease dark:text-white">
          Relaxation Audio
        </h1>
        
        {playingTrack && (
          <div className="mb-8 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm flex items-center justify-between">
            <div>
              <p className="font-medium dark:text-white">Now Playing: {playingTrack}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {getVolumeIcon()}
                <Slider 
                  value={[volume]} 
                  max={1} 
                  step={0.01} 
                  onValueChange={handleVolumeChange} 
                  className="w-24" 
                />
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  pauseAudio();
                  setPlayingTrack(null);
                }}
              >
                <Pause className="mr-2 h-4 w-4" /> Stop
              </Button>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {audioTracks.map((track) => (
            <Card key={track.id} className="overflow-hidden transition-all hover:shadow-md">
              <CardHeader className="bg-mindease/5 dark:bg-mindease-dark/20">
                <CardTitle>{track.title}</CardTitle>
                <CardDescription>{track.duration}</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-gray-600 dark:text-gray-300">{track.description}</p>
              </CardContent>
              <CardFooter>
                <Button 
                  variant={playingTrack === track.title ? "default" : "outline"}
                  className={playingTrack === track.title ? "bg-mindease hover:bg-mindease-mid" : ""}
                  onClick={() => handlePlayPause(track)}
                >
                  {playingTrack === track.title ? (
                    <><Pause className="mr-2 h-4 w-4" /> Pause</>
                  ) : (
                    <><Play className="mr-2 h-4 w-4" /> Play</>
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RelaxationAudioPage;
