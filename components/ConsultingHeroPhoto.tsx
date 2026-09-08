"use client";
import Image from "next/image";
import { useParallax } from "@/hooks/useParallax";

export default function ConsultingHeroPhoto() {
  const parallaxRef = useParallax<HTMLDivElement>(0.1);

  return (
    <div ref={parallaxRef} className="consulting-hero-photo">
      <Image
        src="https://images.unsplash.com/photo-1758873269035-aae0e1fd3422?fm=jpg&q=80&w=1600&auto=format&fit=crop"
        alt="Team collaborating around a whiteboard in a modern office"
        fill
        sizes="(max-width: 860px) 100vw, 40vw"
        style={{ objectFit: "cover" }}
        priority
      />
    </div>
  );
}
