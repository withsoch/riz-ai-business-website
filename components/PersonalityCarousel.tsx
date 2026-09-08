"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

type CarouselCard = {
  id: string;
  kind: "video" | "placeholder";
  src?: string;
  instagramUrl?: string;
  poster?: string;
  tag: string;
  title: string;
  description: string;
};

const INSTAGRAM_PROFILE_URL = "https://www.instagram.com/etz.riz/";

const carouselCards: CarouselCard[] = [
  {
    id: "card-1",
    kind: "video",
    src: "/videos/riz-reel.mp4",
    instagramUrl: INSTAGRAM_PROFILE_URL,
    tag: "REEL",
    title: "A message to AI influencers",
    description: "Calling out the hype: what actually ships versus what gets posted.",
  },
  {
    id: "card-2",
    kind: "video",
    src: "/videos/riz-reel-2.mp4",
    instagramUrl: INSTAGRAM_PROFILE_URL,
    tag: "REEL",
    title: "Operator perspective",
    description: "How an operator thinks about building systems. A live breakdown.",
  },
  {
    id: "card-3",
    kind: "video",
    src: "/videos/riz-reel-3.mp4",
    instagramUrl: INSTAGRAM_PROFILE_URL,
    tag: "REEL",
    title: "Stand-up · The AI bit",
    description: "The bit about AI that landed. Live at the mic in Tallinn.",
  },
  {
    id: "card-4",
    kind: "video",
    src: "/videos/riz-reel-4.mp4",
    instagramUrl: INSTAGRAM_PROFILE_URL,
    tag: "REEL",
    title: "More from the feed",
    description: "Another clip from the Instagram grid.",
  },
  {
    id: "card-5",
    kind: "video",
    src: "/videos/riz-reel-5.mp4",
    instagramUrl: INSTAGRAM_PROFILE_URL,
    tag: "REEL",
    title: "Podcast clips", // placeholder - flagged for review
    description: "Long-form breakdowns, cut down to the good parts.", // placeholder - flagged for review
  },
  {
    id: "card-6",
    kind: "video",
    src: "/videos/riz-reel-6.mp4",
    instagramUrl: INSTAGRAM_PROFILE_URL,
    tag: "REEL",
    title: "Behind the build", // placeholder - flagged for review
    description: "Raw footage from a client build, start to finish.", // placeholder - flagged for review
  },
  {
    id: "card-7",
    kind: "video",
    src: "/videos/riz-reel-7.mp4",
    instagramUrl: INSTAGRAM_PROFILE_URL,
    tag: "REEL",
    title: "More from the feed", // placeholder - flagged for review
    description: "Another clip straight from the Instagram grid.", // placeholder - flagged for review
  },
];

function PlayIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
      <rect x="6" y="5" width="4" height="14" />
      <rect x="14" y="5" width="4" height="14" />
    </svg>
  );
}

function VideoCard({
  card,
  instanceId,
  isActive,
  onActivate,
  onDeactivate,
  registerVideo,
}: {
  card: CarouselCard;
  instanceId: string;
  isActive: boolean;
  onActivate: () => void;
  onDeactivate: () => void;
  registerVideo: (el: HTMLVideoElement | null) => void;
}) {
  function handleToggle(e: React.MouseEvent) {
    e.preventDefault();
    if (isActive) {
      onDeactivate();
    } else {
      onActivate();
    }
  }

  return (
    <div className="pc-card" data-instance-id={instanceId}>
      <div className="pc-video-wrap" onClick={handleToggle}>
        <video
          ref={registerVideo}
          src={card.src}
          poster={card.poster}
          muted
          loop
          playsInline
          autoPlay
          preload="metadata"
          className="pc-video"
        />
        <div className="pc-gradient" />
        <span className="pc-badge">{card.tag}</span>
        <div className={`pc-play-overlay${isActive ? " pc-play-overlay--active" : ""}`}>
          <div className="pc-play-btn">{isActive ? <PauseIcon /> : <PlayIcon />}</div>
        </div>
        <div className="pc-footer">
          <p className="pc-title">{card.title}</p>
          <p className="pc-desc">{card.description}</p>
        </div>
      </div>
    </div>
  );
}

function PlaceholderCard({ card, instanceId }: { card: CarouselCard; instanceId: string }) {
  return (
    <div className="pc-card" data-instance-id={instanceId}>
      <div className="pc-video-wrap pc-video-wrap--placeholder">
        {card.poster && (
          <Image
            src={card.poster}
            alt={card.title}
            fill
            sizes="(max-width: 767px) 78vw, 22vw"
            style={{ objectFit: "cover" }}
          />
        )}
        <div className="pc-gradient pc-gradient--placeholder" />
        <span className="pc-badge pc-badge--soon">{card.tag}</span>
        <div className="pc-footer">
          <p className="pc-title">{card.title}</p>
          <p className="pc-desc">{card.description}</p>
        </div>
      </div>
    </div>
  );
}

// Two consecutive copies of the deck let the track translate exactly one
// set's width and land back on an identical layout - a seamless loop.
const trackCards = [
  ...carouselCards.map((card) => ({ card, instanceId: `${card.id}-a` })),
  ...carouselCards.map((card) => ({ card, instanceId: `${card.id}-b` })),
];

export default function PersonalityCarousel() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<Map<string, HTMLVideoElement>>(new Map());
  const [activeId, setActiveId] = useState<string | null>(null);
  const activeIdRef = useRef<string | null>(null);
  activeIdRef.current = activeId;

  const registerVideo = useCallback((id: string, el: HTMLVideoElement | null) => {
    if (el) videoRefs.current.set(id, el);
    else videoRefs.current.delete(id);
  }, []);

  const deactivate = useCallback((id: string) => {
    const video = videoRefs.current.get(id);
    if (video) {
      video.muted = true;
      video.pause();
    }
    setActiveId((current) => (current === id ? null : current));
  }, []);

  const activate = useCallback((id: string) => {
    videoRefs.current.forEach((video, videoId) => {
      if (videoId === id) {
        video.muted = false;
        video.play().catch(() => {});
      } else {
        video.muted = true;
      }
    });
    setActiveId(id);
  }, []);

  // Autoplay-muted-on-drift-into-view + reset unmuted state when a card drifts away
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const wrap = entry.target as HTMLElement;
          const id = wrap.dataset.instanceId;
          if (!id) return;
          const video = videoRefs.current.get(id);
          if (!video) return;

          if (entry.isIntersecting) {
            video.play().catch(() => {});
          } else {
            video.pause();
            if (activeIdRef.current === id) {
              video.muted = true;
              setActiveId(null);
            }
          }
        });
      },
      { threshold: 0.6 }
    );

    const cards = trackRef.current?.querySelectorAll("[data-instance-id]");
    cards?.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Called by the arrow buttons to jump the track by one card without
  // fighting the continuous drift set up in the effect below.
  const nudgeRef = useRef<(direction: 1 | -1) => void>(() => {});

  // Continuous constant-speed drift (same technique/pace as the site's logo
  // ticker marquee), driven by rAF so hover-pause/resume never jumps and
  // arrow clicks can nudge the offset directly. Loops seamlessly because the
  // deck is rendered twice - wrapping at exactly one set's width is invisible.
  useEffect(() => {
    const track = trackRef.current;
    const viewport = viewportRef.current;
    if (!track || !viewport) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const SPEED_PX_PER_SEC = 45; // matches the hero logo ticker's pace
    let offset = 0;
    let setWidth = track.scrollWidth / 2;
    let paused = false;
    let lastTime = 0;
    let rafId = 0;

    const applyTransform = () => {
      track.style.transform = `translate3d(${-offset}px, 0, 0)`;
    };
    applyTransform();

    const measure = () => {
      const nextSetWidth = track.scrollWidth / 2;
      if (nextSetWidth > 0) {
        setWidth = nextSetWidth;
        offset = ((offset % setWidth) + setWidth) % setWidth;
        applyTransform();
      }
    };
    window.addEventListener("resize", measure);

    const tick = (time: number) => {
      if (!lastTime) lastTime = time;
      const dt = (time - lastTime) / 1000;
      lastTime = time;
      if (!paused && activeIdRef.current === null && setWidth > 0) {
        offset += SPEED_PX_PER_SEC * dt;
        if (offset >= setWidth) offset -= setWidth;
        applyTransform();
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    const pause = () => {
      paused = true;
    };
    const resume = () => {
      lastTime = 0;
      paused = false;
    };

    nudgeRef.current = (direction) => {
      const card = track.querySelector<HTMLElement>("[data-instance-id]");
      const cardWidth = card ? card.getBoundingClientRect().width : 260;
      const gap = 20;
      const step = cardWidth + gap;
      if (setWidth > 0) {
        offset = ((offset + direction * step) % setWidth + setWidth) % setWidth;
        applyTransform();
      }
    };

    viewport.addEventListener("pointerenter", pause);
    viewport.addEventListener("pointerleave", resume);
    viewport.addEventListener("touchstart", pause, { passive: true });
    viewport.addEventListener("touchend", resume, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", measure);
      viewport.removeEventListener("pointerenter", pause);
      viewport.removeEventListener("pointerleave", resume);
      viewport.removeEventListener("touchstart", pause);
      viewport.removeEventListener("touchend", resume);
    };
  }, []);

  return (
    <div className="pc-wrap">
      <div className="pc-marquee-viewport" ref={viewportRef}>
        <div className="pc-track" ref={trackRef}>
          {trackCards.map(({ card, instanceId }) => {
            if (card.kind === "video") {
              return (
                <VideoCard
                  key={instanceId}
                  card={card}
                  instanceId={instanceId}
                  isActive={activeId === instanceId}
                  onActivate={() => activate(instanceId)}
                  onDeactivate={() => deactivate(instanceId)}
                  registerVideo={(el) => registerVideo(instanceId, el)}
                />
              );
            }
            return <PlaceholderCard key={instanceId} card={card} instanceId={instanceId} />;
          })}
        </div>
      </div>

      <button
        type="button"
        aria-label="Scroll left"
        className="pc-arrow pc-arrow-left"
        onClick={() => nudgeRef.current(-1)}
      >
        ‹
      </button>
      <button
        type="button"
        aria-label="Scroll right"
        className="pc-arrow pc-arrow-right"
        onClick={() => nudgeRef.current(1)}
      >
        ›
      </button>
    </div>
  );
}
