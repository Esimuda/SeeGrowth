import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const VIDEO = {
  src: '/assets/events/solar-singapore.mp4?v=3',
  poster: '/assets/events/solar-singapore-poster.webp?v=3',
};

export default function EventVideo() {
  const videoRef = useRef(null);
  const [started, setStarted] = useState(false);
  const [showPlay, setShowPlay] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;

    // Warm the HD stream early so the first play is smoother.
    video.preload = 'auto';
    try {
      video.load();
    } catch {
      // Ignore browsers that reject programmatic load.
    }

    return undefined;
  }, []);

  const startPlayback = async () => {
    const video = videoRef.current;
    if (!video) return;

    setShowPlay(false);
    setStarted(true);

    try {
      if (video.readyState < 2) {
        await new Promise((resolve) => {
          const onReady = () => {
            video.removeEventListener('loadeddata', onReady);
            video.removeEventListener('canplay', onReady);
            resolve();
          };
          video.addEventListener('loadeddata', onReady, { once: true });
          video.addEventListener('canplay', onReady, { once: true });
        });
      }

      video.playbackRate = 1;
      video.muted = false;
      await video.play();
    } catch {
      try {
        video.muted = true;
        await video.play();
      } catch {
        setShowPlay(true);
      }
    }
  };

  return (
    <section className="event-video" id="event-video" aria-label="Solar Singapore highlight reel">
      <div className={`event-video-frame${started ? ' is-playing' : ''}`}>
        <video
          ref={videoRef}
          className="event-video-media"
          src={VIDEO.src}
          poster={VIDEO.poster}
          width={1920}
          height={1080}
          playsInline
          preload="auto"
          controls={started}
          controlsList="nodownload"
          onPlaying={() => setShowPlay(false)}
          onPause={() => {
            const video = videoRef.current;
            if (video && !video.ended && video.currentTime > 0.15) {
              setShowPlay(true);
            }
          }}
          onEnded={() => {
            setShowPlay(true);
            const video = videoRef.current;
            if (video) video.currentTime = 0;
          }}
        />

        <AnimatePresence>
          {showPlay && (
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
              <img
                className="event-video-play-img"
                src="/assets/events/play-button.png"
                alt=""
                width={92}
                height={92}
                draggable={false}
              />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
