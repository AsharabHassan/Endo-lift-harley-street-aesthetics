"use client";

import { useState, useRef, useCallback, useEffect } from "react";

interface Story {
  quote: string;
  fullStory: string;
  attribution: string;
  treatment: string;
}

interface PatientStoryCarouselProps {
  stories: Story[];
}

export function PatientStoryCarousel({ stories }: PatientStoryCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const touchStart = useRef(0);
  const touchEnd = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const total = stories.length;
  const story = stories[current];

  const goTo = useCallback(
    (index: number) => {
      setCurrent(((index % total) + total) % total);
      setExpanded(false);
    },
    [total]
  );

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  useEffect(() => {
    if (expanded) return;
    timerRef.current = setInterval(next, 8000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [next, expanded]);

  function onTouchStart(e: React.TouchEvent) {
    touchStart.current = e.targetTouches[0].clientX;
  }
  function onTouchMove(e: React.TouchEvent) {
    touchEnd.current = e.targetTouches[0].clientX;
  }
  function onTouchEnd() {
    const diff = touchStart.current - touchEnd.current;
    if (Math.abs(diff) > 50) {
      diff > 0 ? next() : prev();
    }
  }

  return (
    <div
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Card */}
      <div className="card-dark p-5 min-h-[180px]">
        <span className="font-serif italic text-3xl text-hsa-gold/15 leading-none block mb-2">&ldquo;</span>

        <blockquote className="font-serif italic text-base text-hsa-cream/70 leading-relaxed -mt-2">
          {story.quote}
        </blockquote>

        {expanded && story.fullStory && (
          <p className="font-mono text-[10px] text-hsa-cream/35 leading-relaxed mt-4 tracking-[0.05em]">
            {story.fullStory}
          </p>
        )}

        <div className="flex items-center justify-between pt-3 mt-4 border-t border-hsa-border-subtle">
          <div>
            <p className="font-mono text-[10px] text-hsa-cream/60">{story.attribution}</p>
            <p className="font-mono text-[8px] text-hsa-gold/30 tracking-[0.15em] uppercase mt-0.5">{story.treatment}</p>
          </div>
          {story.fullStory && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="font-mono text-[9px] text-hsa-gold/50 hover:text-hsa-gold tracking-[0.1em] uppercase transition-colors"
            >
              {expanded ? "Less" : "Read more"}
            </button>
          )}
        </div>
      </div>

      {/* Controls */}
      {total > 1 && (
        <div className="flex items-center justify-between mt-4">
          <button
            onClick={prev}
            className="w-8 h-8 border border-hsa-border-subtle flex items-center justify-center text-hsa-gold/30 hover:text-hsa-gold hover:border-hsa-border-gold transition-colors"
            aria-label="Previous story"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <div className="flex items-center gap-1.5">
            {stories.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`transition-all duration-300 ${
                  i === current
                    ? "w-5 h-1 bg-hsa-gold"
                    : "w-1.5 h-1.5 rounded-full bg-hsa-border-subtle hover:bg-hsa-gold/30"
                }`}
                aria-label={`Go to story ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={next}
            className="w-8 h-8 border border-hsa-border-subtle flex items-center justify-center text-hsa-gold/30 hover:text-hsa-gold hover:border-hsa-border-gold transition-colors"
            aria-label="Next story"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
