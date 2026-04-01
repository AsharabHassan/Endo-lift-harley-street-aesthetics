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
      <div>
        <h3 className="font-serif text-lg text-white">
          Before &amp; After Results
        </h3>
        <p className="text-hsa-text-secondary text-sm mt-1 capitalize">
          {treatmentArea} treatments
        </p>
      </div>

      <div className="space-y-6">
        {pairs.map((pair, index) => (
          <div key={index} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-hsa-card-secondary">
                <Image
                  src={pair.beforeUrl}
                  alt="Before treatment"
                  fill
                  className="object-cover"
                />
                <span className="absolute bottom-2 left-2 label-uppercase text-white bg-black/60 px-2 py-1 rounded">
                  Before
                </span>
              </div>
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-hsa-card-secondary">
                <Image
                  src={pair.afterUrl}
                  alt="After treatment"
                  fill
                  className="object-cover"
                />
                <span className="absolute bottom-2 left-2 label-uppercase text-white bg-black/60 px-2 py-1 rounded">
                  After
                </span>
              </div>
            </div>

            {pair.quote && (
              <div className="border-l-2 border-hsa-gold pl-4">
                <p className="font-serif text-white text-sm italic">
                  &ldquo;{pair.quote}&rdquo;
                </p>
                <p className="text-hsa-text-muted text-xs mt-1">
                  {pair.attribution}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
