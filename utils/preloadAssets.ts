/**
 * Preloads an image and returns a promise that resolves when loaded
 */
export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!src) {
      resolve();
      return;
    }
    
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
};

/**
 * Preloads a video and returns a promise that resolves when it can play
 */
export const preloadVideo = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!src) {
      resolve();
      return;
    }
    
    const video = document.createElement('video');
    video.preload = 'auto';
    video.muted = true;
    video.oncanplaythrough = () => resolve();
    video.onerror = () => reject(new Error(`Failed to load video: ${src}`));
    video.src = src;
    video.load();
  });
};

/**
 * Preloads multiple images in parallel
 */
export const preloadImages = async (sources: string[]): Promise<void> => {
  await Promise.all(sources.filter(Boolean).map(src => preloadImage(src)));
};

/**
 * Preloads multiple videos in parallel
 */
export const preloadVideos = async (sources: string[]): Promise<void> => {
  await Promise.all(sources.filter(Boolean).map(src => preloadVideo(src)));
};
