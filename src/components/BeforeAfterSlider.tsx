"use client";

import { useState } from "react";
import Image from "next/image";

interface BeforeAfterSliderProps {
  beforeUrl: string;
  afterUrl: string;
  beforeLabel?: string;
  afterLabel?: string;
  /** Tailwind aspect-ratio class for the frame. */
  aspectClass?: string;
}

/**
 * Interactive before/after comparison. The "after" image sits as the base
 * layer; the "before" image is layered on top and revealed up to the slider
 * position via clip-path. A full-size, invisible range input drives the
 * position — giving free drag, touch, and keyboard support with no extra code.
 */
export function BeforeAfterSlider({
  beforeUrl,
  afterUrl,
  beforeLabel = "Before",
  afterLabel = "After",
  aspectClass = "aspect-square",
}: BeforeAfterSliderProps) {
  const [pos, setPos] = useState(50);

  return (
    <div
      className={`relative ${aspectClass} w-full overflow-hidden bg-hsa-bg-elevated select-none`}
    >
      {/* After image (base layer) */}
      <Image
        src={afterUrl}
        alt="After treatment"
        fill
        sizes="100vw"
        className="object-contain"
        unoptimized
        draggable={false}
      />
      <span className="absolute bottom-2 right-2 z-20 font-mono text-[8px] tracking-[0.2em] uppercase text-hsa-gold bg-black/70 backdrop-blur-sm px-2 py-1 pointer-events-none">
        {afterLabel}
      </span>

      {/* Before image (clipped to the slider position) */}
      <div
        className="absolute inset-0 z-10"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
      >
        <Image
          src={beforeUrl}
          alt="Before treatment"
          fill
          sizes="100vw"
          className="object-contain"
          unoptimized
          draggable={false}
        />
        <span className="absolute bottom-2 left-2 font-mono text-[8px] tracking-[0.2em] uppercase text-white bg-black/70 backdrop-blur-sm px-2 py-1 pointer-events-none">
          {beforeLabel}
        </span>
      </div>

      {/* Divider + handle (visual only) */}
      <div
        className="absolute top-0 bottom-0 z-20 w-px bg-hsa-gold/80 pointer-events-none -translate-x-1/2"
        style={{ left: `${pos}%` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 backdrop-blur-sm border border-hsa-gold/80 flex items-center justify-center shadow-lg">
          <span className="font-mono text-[11px] leading-none text-hsa-gold tracking-tighter">
            &#10094;&#10095;
          </span>
        </div>
      </div>

      {/* Accessible control: invisible range input handles drag, touch & keys */}
      <input
        type="range"
        min={0}
        max={100}
        step={0.1}
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        aria-label="Drag to compare before and after"
        className="absolute inset-0 z-30 w-full h-full opacity-0 cursor-ew-resize"
      />
    </div>
  );
}
