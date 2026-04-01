const areas = ["Neck", "Jawline", "Full Face", "Periorbital"];

export function BrowseGallery() {
  return (
    <div className="space-y-4">
      <h3 className="font-serif text-lg text-white">Browse Results by Area</h3>
      <div className="grid grid-cols-2 gap-3">
        {areas.map((area) => (
          <button
            key={area}
            className="bg-hsa-card-secondary border border-hsa-border-subtle rounded-lg py-4 px-3 text-center text-white text-sm font-medium transition-colors hover:border-hsa-gold"
          >
            {area}
          </button>
        ))}
      </div>
    </div>
  );
}
