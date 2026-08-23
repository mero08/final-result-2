import { describe, it, expect, vi, afterEach } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import App from "@/App";
import { muxPlayerSrc } from "@/lib/mux";

vi.mock("@/components/Model3DViewer", () => ({ default: () => null }));
vi.mock("@/components/NebulaBackground", () => ({ default: () => null }));

afterEach(() => {
  cleanup();
});

describe("muxPlayerSrc", () => {
  it("encodes reel titles in Mux player URLs", () => {
    expect(muxPlayerSrc("abc123", "Desert Light")).toBe(
      "https://player.mux.com/abc123?metadata-video-title=Desert%20Light&video-title=Desert%20Light",
    );
  });
});

describe("App", () => {
  it("renders the home hero name", () => {
    window.history.pushState({}, "", "/");
    render(<App />);
    expect(document.getElementById("home")).toBeTruthy();
    expect(screen.getByRole("heading", { name: /FARES/i })).toBeInTheDocument();
  });

  it("renders 404 for unknown routes", () => {
    window.history.pushState({}, "", "/does-not-exist");
    render(<App />);
    expect(screen.getByText("404")).toBeInTheDocument();
    expect(screen.getByText("Oops! Page not found")).toBeInTheDocument();
  });
});
