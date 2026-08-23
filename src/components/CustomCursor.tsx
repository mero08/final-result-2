import { useEffect, useRef } from "react";

function isHoverTarget(node: EventTarget | null) {
  return node instanceof Element && Boolean(node.closest("a, button, [data-cursor-hover]"));
}

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mx = 0;
    let my = 0;
    let dx = 0;
    let dy = 0;
    let frame = 0;
    let running = true;

    const move = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
    };

    const tick = () => {
      if (!running) return;
      dx += (mx - dx) * 0.15;
      dy += (my - dy) * 0.15;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${mx - 4}px, ${my - 4}px)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${dx - 20}px, ${dy - 20}px)`;
      }
      frame = requestAnimationFrame(tick);
    };

    const onOver = (e: Event) => {
      if (isHoverTarget(e.target)) {
        ringRef.current?.classList.add("scale-150", "opacity-100");
      }
    };
    const onOut = (e: Event) => {
      const next = (e as MouseEvent).relatedTarget;
      if (isHoverTarget(next)) return;
      ringRef.current?.classList.remove("scale-150", "opacity-100");
    };

    window.addEventListener("mousemove", move);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);
    frame = requestAnimationFrame(tick);

    return () => {
      running = false;
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[9999] hidden h-2 w-2 rounded-full bg-primary mix-blend-difference md:block"
      />
      <div
        ref={ringRef}
        className="pointer-events-none fixed left-0 top-0 z-[9998] hidden h-10 w-10 rounded-full border border-primary/50 opacity-60 transition-all duration-300 ease-out md:block"
      />
    </>
  );
}
