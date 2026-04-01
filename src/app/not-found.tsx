import { Header } from "@/components/Header";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-hsa-bg">
      <div className="max-w-lg mx-auto px-5 pb-16">
        {/* Header */}
        <Header />

        {/* Not found message */}
        <section className="text-center py-10 space-y-6">
          <h1 className="font-serif text-2xl text-white">Page Not Found</h1>

          <p className="text-hsa-text-secondary text-sm leading-relaxed max-w-sm mx-auto">
            The link you followed may have expired or is no longer valid. If you
            believe this is an error, please contact us and we will be happy to
            help.
          </p>

          <div className="gold-gradient-divider w-3/5 mx-auto" />

          <p className="text-hsa-text-muted text-xs">
            Call us on{" "}
            <a
              href="tel:02071234567"
              className="text-hsa-gold hover:underline"
            >
              020 7123 4567
            </a>
          </p>
        </section>
      </div>
    </main>
  );
}
