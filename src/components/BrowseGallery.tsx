const areas = [
  { name: "Full Face", icon: "\u2728" },
  { name: "Neck", icon: "\u2728" },
  { name: "Jawline", icon: "\u2728" },
  { name: "Periorbital", icon: "\u2728" },
];

export function BrowseGallery() {
  return (
    <div className="space-y-4">
      <div className="text-center">
        <p className="label-uppercase text-hsa-gold mb-2 tracking-[3px]">Explore</p>
        <h3 className="font-serif text-xl text-white">Treatment Areas</h3>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {areas.map((area) => (
          <button
            key={area.name}
            className="bg-hsa-card-primary border border-hsa-border-subtle rounded-xl py-5 px-4 text-center transition-all hover:border-hsa-gold/50 hover:bg-hsa-card-secondary group"
          >
            <p className="text-hsa-gold text-lg mb-1 group-hover:scale-110 transition-transform">{area.icon}</p>
            <p className="text-white text-sm font-medium">{area.name}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
