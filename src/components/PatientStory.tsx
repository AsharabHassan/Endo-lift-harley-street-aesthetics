"use client";

import { useState } from "react";

interface PatientStoryProps {
  quote: string;
  fullStory: string;
  attribution: string;
  treatment: string;
}

export function PatientStory({
  quote,
  fullStory,
  attribution,
  treatment,
}: PatientStoryProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border-l-2 border-hsa-gold pl-5 py-1">
      <blockquote className="font-serif text-white italic leading-relaxed">
        &ldquo;{quote}&rdquo;
      </blockquote>

      <p className="text-hsa-text-secondary text-sm mt-3">
        {attribution}{" "}
        <span className="text-hsa-text-muted">&mdash; {treatment}</span>
      </p>

      {fullStory && (
        <>
          {expanded && (
            <p className="text-hsa-text-secondary text-sm mt-3 leading-relaxed">
              {fullStory}
            </p>
          )}
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-hsa-gold text-sm mt-3 hover:underline"
          >
            {expanded ? "Show less" : "Read full story \u2192"}
          </button>
        </>
      )}
    </div>
  );
}
