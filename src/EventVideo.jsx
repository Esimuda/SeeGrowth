import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const VIDEO = {
  src: '/assets/events/solar-singapore.mp4',
  poster: '/assets/events/solar-singapore-poster.webp',
};

export default function EventVideo() {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  const startPlayback = async () => {
    const video = videoRef.current;
    if (!video) return;
    try {
      video.muted = false;
      await video.play();
      setPlaying(true);
    } catch {
      try {
        video.muted = true;
        await video.play();
        setPlaying(true);
      } catch {
        // Autoplay blocked; leave overlay visible
      }
    }
  };

  const onEnded = () => {
    setPlaying(false);
    const video = videoRef.current;
    if (video) video.currentTime = 0;
  };

  return (
    <section className="event-video" id="event-video" aria-label="Solar Singapore highlight reel">
      <div className="event-video-frame">
        <video
          ref={videoRef}
          className="event-video-media"
          src={VIDEO.src}
          poster={VIDEO.poster}
          playsInline
          preload="metadata"
          controls={playing}
          onEnded={onEnded}
          onPause={() => {
            const video = videoRef.current;
            if (video && video.paused && !video.ended && video.currentTime > 0.2) {
              // keep controls visible while paused mid-playback
            }
          }}
        />

        <AnimatePresence>
          {!playing && (
            <motion.button
              type="button"
              className="event-video-play"
              aria-label="Play Solar Singapore video"
              onClick={startPlayback}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              <span className="event-video-play-glass" aria-hidden="true" />
              <svg className="event-video-play-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M9 7.5v9l8-4.5-8-4.5z" fill="currentColor" />
              </svg>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
