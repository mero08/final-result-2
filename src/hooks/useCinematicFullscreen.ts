import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function useCinematicFullscreen() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const delayRef = useRef<number>();

  const refreshScroll = useCallback(() => {
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
      window.clearTimeout(delayRef.current);
      delayRef.current = window.setTimeout(() => {
        ScrollTrigger.refresh();
      }, 200);
    });
  }, []);

  const sync = useCallback(() => {
    const doc = document as Document & { webkitFullscreenElement?: Element | null };
    const active = Boolean(document.fullscreenElement ?? doc.webkitFullscreenElement);
    document.documentElement.classList.toggle("cinematic-fullscreen", active);
    setIsFullscreen(active);
    refreshScroll();
  }, [refreshScroll]);

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
    sync();
  }, [sync]);

  useEffect(() => {
    document.addEventListener("fullscreenchange", sync);
    document.addEventListener("webkitfullscreenchange", sync);
    return () => {
      window.clearTimeout(delayRef.current);
      document.removeEventListener("fullscreenchange", sync);
      document.removeEventListener("webkitfullscreenchange", sync);
    };
  }, [sync]);

  return { toggleFullscreen, isFullscreen };
}
