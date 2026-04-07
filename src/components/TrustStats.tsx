const stats = [
  { value: "500+", label: "Procedures", icon: "\u2726" },
  { value: "4.9", label: "Rating", icon: "\u2605" },
  { value: "GMC", label: "Certified", icon: "\u2713" },
];

export function TrustStats() {
  return (
    <div className="bg-hsa-card-primary border border-hsa-border-subtle rounded-xl p-5">
      <div className="flex justify-around items-center">
        {stats.map(({ value, label, icon }) => (
          <div key={label} className="text-center space-y-1.5">
            <p className="text-hsa-gold text-lg">{icon}</p>
            <p className="text-white font-bold text-xl font-serif">{value}</p>
            <p className="text-hsa-text-muted text-[10px] uppercase tracking-widest font-medium">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
