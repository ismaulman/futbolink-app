// Misma regla que la web (ProfileInfoTab): reconoce youtube.com/watch?v=,
// youtu.be/, /embed/ y /shorts/.
const YOUTUBE_ID = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|shorts\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/;

export type VideoInfo = { id: string; url: string; thumbnail: string };

export function parseVideo(input: string): VideoInfo | null {
  const match = input.trim().match(YOUTUBE_ID);
  if (!match) return null;
  const id = match[1];
  return {
    id,
    url: `https://www.youtube.com/watch?v=${id}`,
    thumbnail: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
  };
}
