import Link from "next/link";
import { Header } from "@/components/Header";

export default async function SuccessPage({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { token } = await params;
  const { session_id } = await searchParams;

  // session_id available for future verification if needed
  void session_id;

  const bookingUrl = process.env.BOOKING_SYSTEM_URL ?? "#";

  return (
    <main className="min-h-screen bg-hsa-bg">
      <div className="max-w-lg mx-auto px-5 pb-16">
        {/* Header */}
        <Header />

        {/* Success confirmation */}
        <section className="text-center py-8 space-y-6">
          {/* Green checkmark circle */}
          <div className="flex justify-center">
            <svg
              width="80"
              height="80"
              viewBox="0 0 80 80"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <circle cx="40" cy="40" r="38" stroke="#5A9A5A" strokeWidth="3" fill="none" />
              <path
                d="M24 40L35 51L56 30"
                stroke="#5A9A5A"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
          </div>

          <h1 className="font-serif text-2xl text-white leading-snug">
            Your Treatment is Secured
          </h1>

          <p className="text-hsa-text-secondary text-sm leading-relaxed">
            Thank you for placing your{" "}
            <span className="text-white font-medium">&pound;50 deposit</span>.
            Your exclusive treatment price is now locked in and your place is
            confirmed.
          </p>

          {/* Book appointment CTA */}
          <a
            href={bookingUrl}
            className="inline-block gold-gradient-button text-white font-semibold py-3 px-10 rounded-lg transition-opacity hover:opacity-90"
          >
            Book Your Appointment
          </a>
        </section>

        {/* Divider */}
        <div className="gold-gradient-divider my-8" />

        {/* What Happens Next */}
        <section className="space-y-6">
          <h2 className="font-serif text-lg text-white text-center">
            What Happens Next
          </h2>

          <ol className="space-y-5">
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-hsa-card-primary border border-hsa-gold text-hsa-gold flex items-center justify-center text-sm font-semibold">
                1
              </span>
              <div>
                <h3 className="text-white text-sm font-medium">
                  Book your preferred date
                </h3>
                <p className="text-hsa-text-secondary text-xs leading-relaxed mt-1">
                  Use the button above to choose a convenient appointment date
                  and time at our Harley Street clinic.
                </p>
              </div>
            </li>

            <li className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-hsa-card-primary border border-hsa-gold text-hsa-gold flex items-center justify-center text-sm font-semibold">
                2
              </span>
              <div>
                <h3 className="text-white text-sm font-medium">
                  Receive your confirmation email
                </h3>
                <p className="text-hsa-text-secondary text-xs leading-relaxed mt-1">
                  You will receive an email confirming your appointment details,
                  along with any pre-treatment instructions.
                </p>
              </div>
            </li>

            <li className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-hsa-card-primary border border-hsa-gold text-hsa-gold flex items-center justify-center text-sm font-semibold">
                3
              </span>
              <div>
                <h3 className="text-white text-sm font-medium">
                  Pay the remaining balance at the clinic
                </h3>
                <p className="text-hsa-text-secondary text-xs leading-relaxed mt-1">
                  Your &pound;50 deposit will be deducted from the total. The
                  remaining balance is payable on the day of your treatment.
                </p>
              </div>
            </li>
          </ol>
        </section>

        {/* Divider */}
        <div className="gold-gradient-divider my-8" />

        {/* Contact and back link */}
        <section className="text-center space-y-4">
          <p className="text-hsa-text-muted text-xs">
            Have questions? Call us on{" "}
            <a
              href="tel:02071234567"
              className="text-hsa-gold hover:underline"
            >
              020 7123 4567
            </a>
          </p>

          <Link
            href={`/p/${token}`}
            className="inline-block text-hsa-gold text-sm hover:underline"
          >
            &larr; Back to your treatment plan
          </Link>
        </section>
      </div>
    </main>
  );
}
