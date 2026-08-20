import { motion, useReducedMotion } from 'framer-motion';

const PARTNER_LOGOS = [
  { src: '/assets/partners/scalingx-labs.png', alt: 'ScalingX Labs', wide: false },
  { src: '/assets/partners/openbuild.png', alt: 'OpenBuild', wide: false },
  { src: '/assets/partners/021lab.png', alt: '021Lab', wide: false },
  { src: '/assets/partners/allscale.png', alt: 'AllScale', wide: false },
  { src: '/assets/partners/blockchain-ntu.png', alt: 'Blockchain at NTU', wide: false },
  { src: '/assets/partners/exchanges.png', alt: 'OKX, Bybit, KuCoin, MEXC, Bitget, Gate.io, and more', wide: true },
];

export default function LogoCarousel() {
  const reduce = useReducedMotion();
  const track = [...PARTNER_LOGOS, ...PARTNER_LOGOS];

  return (
    <section className="logo-carousel" aria-label="Partners and ecosystems we work with">
      <div className="logo-carousel__fade logo-carousel__fade--left" aria-hidden="true" />
      <div className="logo-carousel__fade logo-carousel__fade--right" aria-hidden="true" />

      <motion.div
        className="logo-carousel__track"
        animate={reduce ? undefined : { x: ['0%', '-50%'] }}
        transition={
          reduce
            ? undefined
            : {
                x: {
                  repeat: Infinity,
                  repeatType: 'loop',
                  duration: 28,
                  ease: 'linear',
                },
              }
        }
      >
        {track.map((logo, i) => (
          <div
            key={`${logo.alt}-${i}`}
            className={`logo-carousel__item${logo.wide ? ' logo-carousel__item--wide' : ''}`}
          >
            <img src={logo.src} alt={logo.alt} loading="lazy" decoding="async" />
          </div>
        ))}
      </motion.div>
    </section>
  );
}
