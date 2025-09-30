import { useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import spinSoundFile from "../assets/spin-sound.mp3";

export default function useSpinSound() {
  const { isMuted } = useSelector((state) => state.audio);
  const soundA = useRef(new Audio(spinSoundFile));
  const soundB = useRef(new Audio(spinSoundFile));
  const toggle = useRef(false);
  const timer = useRef(null);

  const playSpinSound = () => {
    if (isMuted) return; // Don't play if muted
    
    stopSpinSound();
    const playLoop = () => {
      const current = toggle.current ? soundB.current : soundA.current;
      toggle.current = !toggle.current;
      current.currentTime = 0;
      current.play();
    };

    playLoop();
    timer.current = setInterval(playLoop, 1800); // play slightly before audio ends
  };

  const stopSpinSound = () => {
    clearInterval(timer.current);
    soundA.current.pause();
    soundB.current.pause();
    soundA.current.currentTime = 0;
    soundB.current.currentTime = 0;
  };

  // ✅ Cleanup when component unmounts
  useEffect(() => {
    return () => {
      stopSpinSound();
    };
  }, []);

  return { playSpinSound, stopSpinSound };
}
