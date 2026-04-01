import type { Offer } from "@/lib/types";
import { DepositButton } from "./DepositButton";

interface SecondaryOfferProps {
  offer: Offer;
  patientId: string;
  token: string;
}

function formatPrice(amount: number): string {
  return `£${amount.toLocaleString("en-GB")}`;
}

export function SecondaryOffer({ offer, patientId, token }: SecondaryOfferProps) {
  const savings = offer.original_price - offer.offered_price;

  return (
    <div className="bg-hsa-card-secondary border border-hsa-border-subtle rounded-lg p-5 space-y-4">
      <div>
        <h3 className="font-serif text-lg text-white">{offer.treatment_name}</h3>
        <p className="text-hsa-text-secondary text-sm mt-1 capitalize">
          {offer.treatment_area}
        </p>
      </div>

      <div className="flex items-baseline gap-3">
        <span className="text-hsa-text-muted line-through text-sm">
          {formatPrice(offer.original_price)}
        </span>
        <span className="text-hsa-gold text-xl font-bold">
          {formatPrice(offer.offered_price)}
        </span>
        <span className="text-hsa-success text-xs font-medium">
          Save {formatPrice(savings)}
        </span>
      </div>

      <DepositButton
        patientId={patientId}
        offerId={offer.id}
        token={token}
        treatmentName={offer.treatment_name}
        isPrimary={false}
      />
    </div>
  );
}
