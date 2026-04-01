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
    <div className="bg-hsa-card-primary border border-hsa-border-subtle rounded-lg p-6 flex gap-5 items-start">
      {/* Photo or placeholder */}
      <div className="shrink-0 w-20 h-20 rounded-full overflow-hidden bg-hsa-card-secondary border border-hsa-border-subtle">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            width={80}
            height={80}
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-hsa-text-muted text-2xl font-serif">
            {name.charAt(0)}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="min-w-0">
        <h3 className="font-serif text-lg text-white">{name}</h3>
        <p className="text-hsa-gold text-sm mt-0.5">{title}</p>
        <p className="text-hsa-text-secondary text-sm mt-2 leading-relaxed">
          {credentials}
        </p>
      </div>
    </div>
  );
}
