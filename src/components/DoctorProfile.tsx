import Image from "next/image";

interface DoctorProfileProps {
  name: string;
  title: string;
  credentials: string;
  imageUrl?: string;
}

export function DoctorProfile({
  name,
  title,
  credentials,
  imageUrl,
}: DoctorProfileProps) {
  return (
    <div className="bg-hsa-card-primary border border-hsa-border-subtle rounded-xl p-6 card-glow-hover">
      <div className="flex gap-5 items-center">
        {/* Photo or placeholder */}
        <div className="shrink-0 w-20 h-20 rounded-full overflow-hidden bg-hsa-card-secondary border-2 border-hsa-gold/30">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={name}
              width={80}
              height={80}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gradient-gold text-2xl font-serif font-bold">
              {name.split(" ").map(n => n[0]).join("")}
            </div>
          )}
        </div>

        <div className="min-w-0">
          <h3 className="font-serif text-lg text-white">{name}</h3>
          <p className="text-hsa-gold text-sm font-medium">{title}</p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-hsa-border-subtle">
        <p className="text-hsa-text-secondary text-sm leading-relaxed">
          {credentials}
        </p>
      </div>
    </div>
  );
}
