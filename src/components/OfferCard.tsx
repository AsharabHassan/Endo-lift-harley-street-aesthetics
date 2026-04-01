import type { Offer } from "@/lib/types";
import { DepositButton } from "./DepositButton";

interface OfferCardProps {
  offer: Offer;
  patientId: string;
  token: string;
}

function formatPrice(amount: number): string {
  return `£${amount.toLocaleString("en-GB")}`;
}

export function OfferCard({ offer, patientId, token }: OfferCardProps) {
  const savings = offer.original_price - offer.offered_price;

  return (
    <div className="bg-hsa-card-primary border border-hsa-border-subtle rounded-lg overflow-hidden">
      {/* Recommended banner */}
      <div className="gold-gradient-button py-2 text-center">
        <span className="label-uppercase text-white tracking-widest">
          Recommended for you
        </span>
      </div>

      <div className="p-6 space-y-5">
        {/* Treatment info */}
        <div>
          <h2 className="font-serif text-2xl text-white">{offer.treatment_name}</h2>
          <p className="text-hsa-text-secondary text-sm mt-1 capitalize">
            {offer.treatment_area}
          </p>
        </div>

        {/* Bonus inclusion */}
        {offer.bonus_inclusion && (
          <div className="border-l-2 border-hsa-gold pl-4 py-2 bg-hsa-card-secondary rounded-r">
            <p className="text-hsa-text-secondary text-sm">
              Includes complimentary {offer.bonus_inclusion}
            </p>
          </div>
        )}

        {/* Pricing */}
        <div className="space-y-2">
          <p className="text-hsa-text-muted line-through text-sm">
            {formatPrice(offer.original_price)}
          </p>
          <p className="text-hsa-gold text-3xl font-bold">
            {formatPrice(offer.offered_price)}
          </p>
          <p className="text-hsa-success text-sm font-medium">
            You save {formatPrice(savings)}
          </p>
        </div>

        {/* CTA */}
        <DepositButton
          patientId={patientId}
          offerId={offer.id}
          token={token}
          treatmentName={offer.treatment_name}
          isPrimary
        />

        <p className="text-hsa-text-muted text-xs text-center">
          Remaining balance payable at the clinic
        </p>
      </div>
    </div>
  );
}
