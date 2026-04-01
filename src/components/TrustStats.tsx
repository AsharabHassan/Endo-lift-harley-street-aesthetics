const stats = [
  { value: "500+", label: "Procedures" },
  { value: "4.9", label: "Rating" },
  { value: "CQC", label: "Registered" },
  { value: "GMC", label: "Certified" },
];

export function TrustStats() {
  return (
    <div className="bg-hsa-card-primary border border-hsa-border-subtle rounded-lg py-4 px-2">
      <div className="flex justify-between items-center divide-x divide-hsa-border-subtle">
        {stats.map(({ value, label }) => (
          <div key={label} className="flex-1 text-center">
            <p className="text-hsa-gold font-bold text-base">{value}</p>
            <p className="label-uppercase text-hsa-text-muted mt-1">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
