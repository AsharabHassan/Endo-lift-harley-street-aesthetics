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
    <div className="bg-hsa-card-primary border border-hsa-border-subtle rounded-xl p-5 space-y-4 card-glow-hover">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-serif text-lg text-white">{offer.treatment_name}</h3>
          <p className="text-hsa-text-secondary text-sm mt-0.5 capitalize">
            {offer.treatment_area} treatment
          </p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-hsa-text-muted line-through text-xs">
            {formatPrice(offer.original_price)}
          </p>
          <p className="text-hsa-gold text-xl font-bold font-serif">
            {formatPrice(offer.offered_price)}
          </p>
          {savings > 0 && (
            <p className="text-hsa-success text-xs font-semibold mt-0.5">
              Save {formatPrice(savings)}
            </p>
          )}
        </div>
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
