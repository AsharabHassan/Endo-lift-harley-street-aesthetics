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
  const savingsPercent = Math.round((savings / offer.original_price) * 100);

  return (
    <div className="bg-hsa-card-primary border border-hsa-border-gold rounded-xl overflow-hidden gold-glow">
      {/* Recommended banner */}
      <div className="gold-gradient-button py-2.5 text-center relative">
        <span className="label-uppercase text-white tracking-[4px] text-[10px]">
          Recommended for you
        </span>
      </div>

      <div className="p-6 space-y-5">
        {/* Treatment info */}
        <div className="text-center">
          <h2 className="font-serif text-2xl text-white leading-tight">{offer.treatment_name}</h2>
          <p className="text-hsa-text-secondary text-sm mt-1.5 capitalize">
            {offer.treatment_area} treatment
          </p>
        </div>

        {/* Pricing block */}
        <div className="bg-hsa-bg-elevated rounded-xl p-5 text-center space-y-2 border border-hsa-border-subtle">
          <p className="text-hsa-text-muted line-through text-base">
            {formatPrice(offer.original_price)}
          </p>
          <p className="text-gradient-gold text-4xl font-bold font-serif">
            {formatPrice(offer.offered_price)}
          </p>
          {savings > 0 && (
            <div className="inline-flex items-center gap-2 bg-hsa-success-dark/30 border border-hsa-success/20 rounded-full px-3 py-1">
              <span className="text-hsa-success text-sm font-semibold">
                Save {formatPrice(savings)} ({savingsPercent}% off)
              </span>
            </div>
          )}
        </div>

        {/* Bonus inclusion */}
        {offer.bonus_inclusion && (
          <div className="flex items-start gap-3 bg-hsa-card-secondary rounded-lg p-4 border border-hsa-border-subtle">
            <span className="text-hsa-gold text-lg mt-0.5">&#10029;</span>
            <p className="text-hsa-text-secondary text-sm leading-relaxed">
              Includes complimentary <span className="text-white font-medium">{offer.bonus_inclusion}</span>
            </p>
          </div>
        )}

        {/* CTA */}
        <DepositButton
          patientId={patientId}
          offerId={offer.id}
          token={token}
          treatmentName={offer.treatment_name}
          isPrimary
        />

        <div className="text-center space-y-1">
          <p className="text-hsa-text-muted text-xs">
            Fully refundable deposit &middot; Remaining balance payable at the clinic
          </p>
        </div>
      </div>
    </div>
  );
}
