import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import musicFile from "../assets/BackgroundMusic.mp3";

const BackgroundMusic = () => {
  const audioRef = useRef(null);
  const rafRef = useRef(null);          // cancel in-flight fades
  const targetVolRef = useRef(0.5);
  const location = useLocation();
  
  // Redux state
  const { isMuted, volume } = useSelector((state) => state.audio);

  // Core fade helper (returns a Promise!)
  const fadeTo = (target, duration = 500) =>
    new Promise((resolve) => {
      const audio = audioRef.current;
      if (!audio) return resolve();

      // cancel any existing fade
      if (rafRef.current) cancelAnimationFrame(rafRef.current);

      const startVol = audio.volume ?? 0;
      const startTime = performance.now();

      // ensure play() before fading up
      if (target > 0 && audio.paused) {
        audio.play().catch(() => {});
      }

      const step = (now) => {
        const t = Math.min((now - startTime) / duration, 1);
        const next = startVol + (target - startVol) * t;
        audio.volume = Math.max(0, Math.min(1, +next.toFixed(3)));

        if (t < 1) {
          rafRef.current = requestAnimationFrame(step);
        } else {
          // pause at zero
          if (target === 0) audio.pause();
          rafRef.current = null;
          resolve();
        }
      };

      rafRef.current = requestAnimationFrame(step);
    });

  useEffect(() => {
    const audio = audioRef.current;
    audio.loop = true;
    audio.volume = isMuted ? 0 : volume;
    targetVolRef.current = volume; // Keep targetVolRef in sync

    // try to start once (user interaction will also start later)
    audio.play().catch(() => {});
  }, [isMuted, volume]); // Add dependencies to update when Redux state changes

  // Keep targetVolRef in sync with Redux volume
  useEffect(() => {
    targetVolRef.current = volume;
  }, [volume]);

  // Auto stop on Victory + BoardOfHonor; resume elsewhere
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (location.pathname === "/victory" || location.pathname === "/BoardOfHonor") {
      fadeTo(0, 500); // fade out
    } else {
      // Respect mute state from Redux
      const targetVolume = isMuted ? 0 : volume;
      fadeTo(targetVolume, 600); // fade in or stay muted
    }
  }, [location, isMuted, volume]);

  // Handle mute state changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Don't play music on victory/board pages regardless of mute state
    if (location.pathname === "/victory" || location.pathname === "/BoardOfHonor") {
      return;
    }

    const targetVolume = isMuted ? 0 : volume;
    fadeTo(targetVolume, 300);
  }, [isMuted, volume, location]);

  // Expose Promise-based API for wheels
  useEffect(() => {
    window.pauseBackgroundMusic = (ms = 500) => fadeTo(0, ms);
    window.resumeBackgroundMusic = (ms = 600, vol = null) => {
      // Respect Redux mute state when resuming
      const targetVolume = isMuted ? 0 : (vol !== null ? vol : volume);
      return fadeTo(targetVolume, ms);
    };

    return () => {
      // cleanup globals on unmount
      if (window.pauseBackgroundMusic) delete window.pauseBackgroundMusic;
      if (window.resumeBackgroundMusic) delete window.resumeBackgroundMusic;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isMuted, volume]); // Add dependencies so it updates when mute state changes

  return <audio ref={audioRef} src={musicFile} />;
};

export default BackgroundMusic;
