import Image from "next/image";
import Link from "next/link";
import { PublicLayout } from "@/components/landing-layout";

export const metadata = {
  title: "Solutions",
  description:
    "Tailored logistics solutions for shippers and carriers in Nigeria.",
};

const shipperCards = [
  {
    title: "Load Posting",
    description:
      "Post your shipment requirements with detailed specifications and get competitive bids from verified carriers.",
    bullets: [
      "Detailed cargo specifications",
      "Pickup and delivery scheduling",
      "Special handling requirements",
    ],
  },
  {
    title: "Carrier Selection",
    description:
      "Choose from a network of verified carriers based on ratings, pricing, and availability.",
    bullets: [
      "Verified carrier profiles",
      "Rating and review system",
      "Competitive bidding process",
    ],
  },
  {
    title: "Real-Time Tracking",
    description:
      "Monitor your shipments in real-time with GPS tracking and automated status updates.",
    bullets: [
      "Live GPS tracking",
      "Automated notifications",
      "Delivery confirmation",
    ],
  },
];

const carrierCards = [
  {
    title: "Load Matching",
    description:
      "Find loads that match your truck specifications and preferred routes automatically.",
    bullets: [
      "Smart load matching",
      "Route optimization",
      "Capacity utilization",
    ],
  },
  {
    title: "Flexible Scheduling",
    description:
      "Set your availability and preferred routes to receive relevant load opportunities.",
    bullets: [
      "Custom availability settings",
      "Route preferences",
      "Automated job alerts",
    ],
  },
  {
    title: "Earnings Management",
    description:
      "Track your earnings, manage payments, and access detailed financial reports.",
    bullets: [
      "Earnings dashboard",
      "Payment tracking",
      "Financial reporting",
    ],
  },
];

function CardPlaceholder() {
  return (
    <div
      className="aspect-square w-full rounded-lg bg-gray-200 opacity-80"
      style={{
        backgroundImage: `
          linear-gradient(45deg, #e5e5e5 25%, transparent 25%),
          linear-gradient(-45deg, #e5e5e5 25%, transparent 25%),
          linear-gradient(45deg, transparent 75%, #e5e5e5 75%),
          linear-gradient(-45deg, transparent 75%, #e5e5e5 75%)
        `,
        backgroundSize: "20px 20px",
        backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
        backgroundColor: "#d4d4d4",
      }}
    />
  );
}

export default function SolutionsPage() {
  return (
    <PublicLayout activeNav="solutions">
      {/* Hero */}
      <section className="py-10 sm:py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:gap-12 lg:grid-cols-2 lg:items-center">
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl order-2 lg:order-1">
              <Image
                src="/image_1.png"
                alt="Forklift loading pallets onto truck"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>
            <div className="order-1 lg:order-2">
              <h1 className="text-2xl  font-bold tracking-tight text-brand-1 sm:text-4xl lg:text-5xl">
                Tailored Solutions for Every Logistics Need
              </h1>
              <p className="mt-6 text-lg text-gray-600">
                Whether you&apos;re shipping cargo or hauling freight, Luggizztik
                provides the tools and platform you need to succeed in
                Nigeria&apos;s logistics industry.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* For Shippers */}
      <section id="shippers" className="bg-gray-50 py-10 sm:py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl sm:text-3xl font-bold text-brand-1">
            For Shippers
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-gray-600">
            Streamline your logistics operations with our comprehensive platform
          </p>
          <div className="mt-8 sm:mt-12 grid gap-6 sm:gap-8 grid-cols-1 md:grid-cols-3">
            {shipperCards.map((card) => (
              <article
                key={card.title}
                className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
              >
                <div className="p-4">
                  <CardPlaceholder />
                </div>
                <div className="p-6 pt-0">
                  <h3 className="text-xl font-bold text-brand-1">{card.title}</h3>
                  <p className="mt-2 text-gray-600">{card.description}</p>
                  <ul className="mt-4 space-y-1">
                    {card.bullets.map((bullet) => (
                      <li
                        key={bullet}
                        className="text-sm font-medium text-brand-1"
                      >
                        • {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* For Carriers */}
      <section id="carriers" className="py-10 sm:py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl sm:text-3xl font-bold text-brand-1">
            For Carriers
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-gray-600">
            Maximize your earnings and optimize your routes
          </p>
          <div className="mt-8 sm:mt-12 grid gap-6 sm:gap-8 grid-cols-1 md:grid-cols-3">
            {carrierCards.map((card) => (
              <article
                key={card.title}
                className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
              >
                <div className="p-4">
                  <CardPlaceholder />
                </div>
                <div className="p-6 pt-0">
                  <h3 className="text-xl font-bold text-brand-1">{card.title}</h3>
                  <p className="mt-2 text-gray-600">{card.description}</p>
                  <ul className="mt-4 space-y-1">
                    {card.bullets.map((bullet) => (
                      <li
                        key={bullet}
                        className="text-sm font-medium text-brand-1"
                      >
                        • {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand-1 py-10 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Ready to Get Started?
          </h2>
          <p className="mt-4 text-lg text-white/90">
            Join thousands of businesses and carriers who trust Luggizztik for
            their logistics needs.
          </p>
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4">
            <Link
              href="/signup/shipper"
              className="inline-flex rounded-lg bg-brand-2 px-6 py-3 text-base font-semibold text-brand-1 hover:opacity-90 transition-opacity"
            >
              Start Shipping
            </Link>
            <Link
              href="/signup/carrier"
              className="inline-flex rounded-lg bg-white px-6 py-3 text-base font-semibold text-brand-1 hover:bg-gray-100 transition-colors"
            >
              Become a Carrier
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
