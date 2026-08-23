import { useCallback, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function refreshScroll() {
  requestAnimationFrame(() => {
    ScrollTrigger.refresh();
  });
}

export function useCinematicFullscreen() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = useCallback(async () => {
    const doc = document as Document & {
      webkitFullscreenElement?: Element | null;
      webkitExitFullscreen?: () => Promise<void> | void;
    };
    const root = document.documentElement as HTMLElement & {
      webkitRequestFullscreen?: () => Promise<void> | void;
    };

    try {
      const active = document.fullscreenElement ?? doc.webkitFullscreenElement;
      if (active) {
        if (document.exitFullscreen) await document.exitFullscreen();
        else doc.webkitExitFullscreen?.();
      } else if (root.requestFullscreen) {
        await root.requestFullscreen();
      } else {
        root.webkitRequestFullscreen?.();
      }
    } catch {
      /* blocked by browser — page stays windowed */
    }
  }, []);

  useEffect(() => {
    const sync = () => {
      const doc = document as Document & { webkitFullscreenElement?: Element | null };
      const active = Boolean(document.fullscreenElement ?? doc.webkitFullscreenElement);
      document.documentElement.classList.toggle("cinematic-fullscreen", active);
      setIsFullscreen(active);
      refreshScroll();
    };

    document.addEventListener("fullscreenchange", sync);
    document.addEventListener("webkitfullscreenchange", sync);
    return () => {
      document.removeEventListener("fullscreenchange", sync);
      document.removeEventListener("webkitfullscreenchange", sync);
    };
  }, []);

  return { toggleFullscreen, isFullscreen };
}
