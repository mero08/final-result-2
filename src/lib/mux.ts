export function muxPlayerSrc(playbackId: string, title: string) {
  const t = encodeURIComponent(title);
  return `https://player.mux.com/${playbackId}?metadata-video-title=${t}&video-title=${t}`;
}

export function muxThumb(playbackId: string, time: number) {
  return `https://image.mux.com/${playbackId}/thumbnail.jpg?time=${time}`;
}
