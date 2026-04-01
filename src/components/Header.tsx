import Image from "next/image";

export function Header() {
  return (
    <div className="text-center pt-10 pb-6">
      <Image
        src="/hsa-logo.png"
        alt="Harley Street Aesthetic Clinic"
        width={120}
        height={120}
        className="mx-auto mb-4"
        priority
      />
      <div className="w-3/5 mx-auto gold-gradient-divider" />
      <p className="label-uppercase text-hsa-text-secondary mt-3">
        Harley Street Aesthetic Clinic
      </p>
    </div>
  );
}
