"use client";
import { useParallax } from "@/hooks/useParallax";

export default function SpeakingHeroPhoto() {
  const parallaxRef = useParallax<HTMLDivElement>(0.1);

  return (
    <div ref={parallaxRef} className="speaking-hero-photo">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/speaking/riz-stage.png"
        alt="Rizwan Mahmood speaking on stage at a Future of Tech conference, mic in hand"
        style={{ objectPosition: "center 30%" }}
      />
    </div>
  );
}
