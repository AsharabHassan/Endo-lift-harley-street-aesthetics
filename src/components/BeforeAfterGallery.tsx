import Image from "next/image";

interface BeforeAfterPair {
  beforeUrl: string;
  afterUrl: string;
  quote: string;
  attribution: string;
}

interface BeforeAfterGalleryProps {
  treatmentArea: string;
  pairs: BeforeAfterPair[];
}

export function BeforeAfterGallery({
  treatmentArea,
  pairs,
}: BeforeAfterGalleryProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="label-uppercase text-hsa-gold mb-2 tracking-[3px]">Real Results</p>
        <h3 className="font-serif text-xl text-white">
          Before &amp; After
        </h3>
        <p className="text-hsa-text-secondary text-sm mt-1 capitalize">
          {treatmentArea} treatments
        </p>
      </div>

      <div className="space-y-6">
        {pairs.map((pair, index) => (
          <div key={index} className="bg-hsa-card-primary border border-hsa-border-subtle rounded-xl overflow-hidden card-glow-hover">
            <div className="grid grid-cols-2">
              <div className="relative aspect-[4/3] bg-hsa-card-secondary">
                <Image
                  src={pair.beforeUrl}
                  alt="Before treatment"
                  fill
                  sizes="50vw"
                  className="object-cover"
                  unoptimized
                />
                <span className="absolute bottom-2 left-2 label-uppercase text-white bg-black/70 backdrop-blur-sm px-2.5 py-1 rounded-md text-[9px]">
                  Before
                </span>
              </div>
              <div className="relative aspect-[4/3] bg-hsa-card-secondary">
                <Image
                  src={pair.afterUrl}
                  alt="After treatment"
                  fill
                  sizes="50vw"
                  className="object-cover"
                  unoptimized
                />
                <span className="absolute bottom-2 left-2 label-uppercase text-hsa-gold bg-black/70 backdrop-blur-sm px-2.5 py-1 rounded-md text-[9px]">
                  After
                </span>
              </div>
            </div>

            {pair.quote && (
              <div className="p-4 border-t border-hsa-border-subtle">
                <p className="font-serif text-white text-sm italic leading-relaxed">
                  &ldquo;{pair.quote}&rdquo;
                </p>
                <p className="text-hsa-text-muted text-xs mt-2">
                  &mdash; {pair.attribution}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
