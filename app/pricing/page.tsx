import Image from "next/image";
import Link from "next/link";
import { PublicLayout } from "@/components/landing-layout";
import { FAQAccordion } from "@/components/FAQAccordion";

export const metadata = {
  title: "Pricing",
  description:
    "Simple, fair pricing for shippers and carriers. No hidden fees.",
};

const shipperPlans = [
  {
    title: "Starter",
    price: "Free",
    description: "Basic-level service to help you get started.",
    features: [
      "5 jobs per month",
      "Track booking",
      "Standard notifications",
      "Mobile app access",
      "Limitations",
    ],
    cta: "GET STARTED",
    href: "/signup/shipper",
    recommended: false,
  },
  {
    title: "Professional",
    price: "N15,000/month",
    description: "Monthly growing subscription for your expanding needs.",
    features: [
      "Everything in Starter",
      "Email and phone support",
      "Real-time tracking",
      "SMS notifications",
      "Custom branding",
    ],
    cta: "GET STARTED",
    href: "/signup/shipper",
    recommended: true,
  },
  {
    title: "Enterprise",
    price: "Custom",
    description: "Tailored solutions for large-scale operations.",
    features: [
      "Everything in Professional",
      "Dedicated account manager",
      "Premium support",
      "White-label solutions",
      "Advanced analytics/reporting",
      "API access",
    ],
    cta: "CONTACT SALES",
    href: "#contact",
    recommended: false,
  },
];

const carrierPlans = [
  {
    title: "Individual Driver",
    commission: "8% commission",
    description: "For independent drivers or small fleets.",
    features: [
      "Access to loads network",
      "Instant job notifications",
      "In-app navigation",
      "Cashless payments",
      "Expense tracking",
      "Rating system",
    ],
    requirements: [
      "Valid driver's license",
      "Vehicle registration",
      "Insurance policy",
    ],
    cta: "JOIN AS A DRIVER",
    href: "/signup/carrier",
    recommended: false,
  },
  {
    title: "Fleet Owner",
    commission: "6% commission",
    description: "For carriers with multiple vehicles and drivers.",
    features: [
      "Everything in Individual",
      "Fleet management dashboard",
      "Driver management tools",
      "Route optimization",
      "Advanced load matching",
      "24/7 support",
      "Custom reporting",
    ],
    requirements: [
      "Company registration",
      "Fleet insurance",
      "Tax ID number",
    ],
    cta: "BECOME A FLEET",
    href: "/signup/carrier",
    recommended: true,
  },
  {
    title: "Enterprise",
    commission: "4% commission",
    description: "Enterprise-level partnership program.",
    features: [
      "Everything in Fleet Owner",
      "Dedicated support",
      "Custom API integrations",
      "Volume partnerships",
      "Priority load access",
      "On-site training",
    ],
    requirements: [
      "Minimum 20 vehicles",
      "Proven track record",
      "Financial stability report",
    ],
    cta: "APPLY FOR PARTNERSHIP",
    href: "#contact",
    recommended: false,
  },
];

const additionalServices = [
  {
    title: "Cargo Insurance",
    description: "Protect your goods against loss or damage during transit.",
    price: "N5,000/shipment",
    image: "/pricing/cargo-insurance.png",
  },
  {
    title: "Dedicated Support",
    description: "Personalized assistance for complex logistics.",
    price: "N10,000/month",
    image: "/pricing/dedicated-support.png",
  },
  {
    title: "Premium Verification",
    description: "Enhanced trust and credibility for your business.",
    price: "N5,000/month",
    image: "/pricing/premium-verification.png",
  },
  {
    title: "Express Matching",
    description: "Faster, prioritized load matching for urgent shipments.",
    price: "N2,000/shipment",
    image: "/pricing/express-matching.png",
  },
];

const faqItems = [
  {
    question: "How does the commission structure work for carriers?",
    answer:
      "Carriers pay a percentage of each completed job. Individual drivers pay 8%, fleet owners 6%, and enterprise partners 4%. There are no upfront fees—you only pay when you earn.",
  },
  {
    question: "Can I change my plan anytime?",
    answer:
      "Yes. You can upgrade or downgrade your plan at any time. Changes take effect at the start of your next billing cycle for paid plans.",
  },
  {
    question: "Is there a setup fee?",
    answer:
      "No. We do not charge any setup or registration fees. You only pay for your chosen plan or commission on earnings.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept major cards, bank transfer, and mobile money. Enterprise customers can also arrange invoicing and custom payment terms.",
  },
];

export default function PricingPage() {
  return (
    <PublicLayout activeNav="pricing" wrapperClassName="min-h-screen flex flex-col bg-brand-5">
      {/* Hero */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-brand-1 sm:text-4xl lg:text-5xl">
                Simple, Fair Pricing for Everyone
              </h1>
              <p className="mt-6 text-lg text-gray-600">
                Choose a plan that&apos;s right for you. Get transparent pricing
                with no hidden fees, so you can focus on what matters most.
              </p>
            </div>
            <div className="relative aspect-square max-w-md mx-auto lg:max-w-none">
              <Image
                src="/pricing/hero.png"
                alt="Pricing - fair and transparent"
                fill
                className="object-contain"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* For Shippers */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold text-brand-1">
            For Shippers
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-gray-600">
            Find the perfect plan to get your stuff to your shipping destination.
          </p>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {shipperPlans.map((plan) => (
              <article
                key={plan.title}
                className="relative overflow-hidden rounded-xl border-2 border-brand-4 bg-white p-6 shadow-sm"
              >
                {plan.recommended && (
                  <div className="absolute right-4 top-4 rounded bg-brand-4 px-2 py-1 text-xs font-semibold text-brand-1">
                    Recommended
                  </div>
                )}
                <h3 className="text-xl font-bold text-brand-1">{plan.title}</h3>
                <p className="mt-2 text-2xl font-bold text-brand-1">
                  {plan.price}
                </p>
                <p className="mt-2 text-gray-600">{plan.description}</p>
                <ul className="mt-6 space-y-2 text-gray-600">
                  {plan.features.map((f) => (
                    <li key={f}>• {f}</li>
                  ))}
                </ul>
                <Link
                  href={plan.href}
                  className="mt-8 flex w-full justify-center rounded-lg bg-brand-2 px-4 py-3 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
                >
                  {plan.cta}
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* For Carriers */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold text-brand-1">
            For Carriers
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-gray-600">
            Commission-based pricing – you only pay when you earn.
          </p>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {carrierPlans.map((plan) => (
              <article
                key={plan.title}
                className="relative overflow-hidden rounded-xl border-2 border-brand-4 bg-white p-6 shadow-sm"
              >
                {plan.recommended && (
                  <div className="absolute right-4 top-4 rounded bg-brand-4 px-2 py-1 text-xs font-semibold text-brand-1">
                    Recommended
                  </div>
                )}
                <h3 className="text-xl font-bold text-brand-1">{plan.title}</h3>
                <p className="mt-2 text-2xl font-bold text-brand-1">
                  {plan.commission}
                </p>
                <p className="mt-2 text-gray-600">{plan.description}</p>
                <p className="mt-4 text-sm font-semibold text-brand-1">
                  What you get
                </p>
                <ul className="mt-1 space-y-1 text-gray-600">
                  {plan.features.map((f) => (
                    <li key={f}>• {f}</li>
                  ))}
                </ul>
                <p className="mt-4 text-sm font-semibold text-brand-1">
                  Requirements
                </p>
                <ul className="mt-1 space-y-1 text-gray-600">
                  {plan.requirements.map((r) => (
                    <li key={r}>• {r}</li>
                  ))}
                </ul>
                <Link
                  href={plan.href}
                  className="mt-8 flex w-full justify-center rounded-lg bg-brand-2 px-4 py-3 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
                >
                  {plan.cta}
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold text-brand-1">
            Additional Services
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-gray-600">
            Enhance your shipping experience.
          </p>
          <div className="mt-12 grid gap-8 sm:grid-cols-2">
            {additionalServices.map((service) => (
              <article
                key={service.title}
                className="overflow-hidden rounded-xl border-2 border-brand-4 bg-white shadow-sm"
              >
                <div className="relative aspect-video">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-brand-1">
                    {service.title}
                  </h3>
                  <p className="mt-2 text-gray-600">{service.description}</p>
                  <p className="mt-4 font-semibold text-brand-1">
                    {service.price}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-16 lg:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold text-brand-1">
            Frequently Asked Questions
          </h2>
          <div className="mt-12">
            <FAQAccordion items={faqItems} />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-lg text-gray-600">
            Ready to get started? Join Luggizztik today!
          </p>
          <Link
            href="/signup/shipper"
            className="mt-6 inline-flex rounded-lg bg-brand-2 px-8 py-3 text-base font-semibold text-white hover:opacity-90 transition-opacity"
          >
            SIGN UP
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
}
