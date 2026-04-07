import Image from "next/image";

export function Header() {
  return (
    <header className="text-center pt-10 pb-8">
      <div className="inline-block p-4 rounded-2xl bg-hsa-card-primary/50 border border-hsa-border-subtle gold-glow">
        <Image
          src="/hsa-logo.png"
          alt="Harley Street Aesthetic Clinic"
          width={100}
          height={100}
          className="mx-auto"
          priority
        />
      </div>
      <div className="mt-6 space-y-2">
        <p className="label-uppercase text-hsa-gold tracking-[4px]">
          Harley Street Aesthetic Clinic
        </p>
        <div className="w-24 mx-auto gold-gradient-divider" />
      </div>
    </header>
  );
}
