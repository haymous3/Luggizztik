import Image from "next/image";
import Link from "next/link";
import {
  CubeTransparentIcon,
  CheckBadgeIcon,
  MapPinIcon,
  QuestionMarkCircleIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import { PublicLayout } from "@/components/landing-layout";

const features = [
  {
    icon: CubeTransparentIcon,
    title: "Efficient & Reliable Tracking",
    description: "Stay updated on every shipment.",
  },
  {
    icon: CheckBadgeIcon,
    title: "Verified Drivers",
    description: "Trusted and vetted carrier network.",
  },
  {
    icon: MapPinIcon,
    title: "Real-Time Tracking",
    description: "Track your cargo live.",
  },
  {
    icon: QuestionMarkCircleIcon,
    title: "24/7 Support",
    description: "We're here whenever you need us.",
  },
  {
    icon: ShieldCheckIcon,
    title: "Secure Payments",
    description: "Safe and transparent transactions.",
  },
  {
    icon: DocumentTextIcon,
    title: "Easy Paperwork",
    description: "Streamlined documentation.",
  },
];

export default function Home() {
  return (
    <PublicLayout activeNav="home">
      {/* Hero */}
      <section className="relative min-h-[360px] sm:min-h-[440px] md:min-h-[520px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/image_1.png"
            alt="Logistics - trucks and cargo"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gray-900/60" />
        </div>
        <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 py-12 sm:py-16 text-center">
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white">
            Connecting Trucks with Cargo Across Nigeria.
          </h1>
          <p className="mt-3 sm:mt-4 text-sm sm:text-base lg:text-lg text-white/90 max-w-2xl mx-auto">
            Join Nigeria&apos;s leading logistics platform, connecting cargo with
            trucks across Nigeria. We provide efficient, reliable, and secure
            logistics             solutions.
          </p>
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4">
            <Link
              href="#quote"
              className="inline-flex justify-center rounded-lg bg-brand-2 px-5 py-2.5 sm:px-6 sm:py-3 text-sm sm:text-base font-semibold text-brand-1 hover:opacity-90 transition-opacity"
            >
              Get a Quote Now
            </Link>
            <Link
              href="/signup/shipper"
              className="inline-flex justify-center rounded-lg bg-brand-2 px-5 py-2.5 sm:px-6 sm:py-3 text-sm sm:text-base font-semibold text-brand-1 hover:opacity-90 transition-opacity"
            >
              Sign up with us
            </Link>
          </div>
        </div>
      </section>

      {/* Join Our Growing Network */}
      <section className="py-10 sm:py-16 lg:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl sm:text-3xl font-bold text-brand-1">
            Join Our Growing Network
          </h2>
          <div className="mt-12 grid gap-8 md:grid-cols-2">
            <article className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
              <div className="aspect-square relative">
                <Image
                  src="/image_2.png"
                  alt="Shipper handing package to delivery person"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-brand-1">Shippers</h3>
                <p className="mt-2 text-gray-600">
                  Whether you&apos;re a small business or a large enterprise,
                  Luggizztik provides you with a platform to find reliable and
                  affordable transportation for your goods.
                </p>
                <Link
                  href="/signup/shipper"
                  className="mt-4 inline-block font-semibold text-brand-1 hover:underline"
                >
                  Read More
                </Link>
              </div>
            </article>
            <article className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
              <div className="aspect-square relative">
                <Image
                  src="/image_3.png"
                  alt="Carrier with tablet in truck"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-brand-1">Carriers</h3>
                <p className="mt-2 text-gray-600">
                  With a wide range of jobs available, Luggizztik helps you find
                  new clients and grow your business.
                </p>
                <Link
                  href="/signup/carrier"
                  className="mt-4 inline-block font-semibold text-brand-1 hover:underline"
                >
                  Read More
                </Link>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Why Choose Luggizztik */}
      <section className="py-10 sm:py-16 lg:py-24 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl sm:text-3xl font-bold text-brand-1">
            Why Choose Luggizztik?
          </h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="flex flex-col items-center text-center"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-brand-2 bg-white text-brand-2">
                  <feature.icon className="h-8 w-8" strokeWidth={2} />
                </div>
                <h3 className="mt-4 text-lg font-bold text-brand-1">
                  {feature.title}
                </h3>
                <p className="mt-1 text-sm text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Real-Time Tracking */}
      <section className="py-10 sm:py-16 lg:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:gap-12 lg:grid-cols-2 lg:items-center">
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
              <Image
                src="/image_4.png"
                alt="Real-time tracking on smartphone"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
                {[0, 1, 2, 3, 4].map((i) => (
                  <span
                    key={i}
                    className={`h-2 w-2 rounded-full ${
                      i === 0 ? "bg-brand-2" : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-brand-1">
                Real-Time Tracking.
              </h2>
              <p className="mt-4 text-gray-600">
                With advanced tracking systems, monitor your cargo&apos;s journey
                from pickup to delivery in real-time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sustainability Banner */}
      <section className="relative min-h-[200px] sm:min-h-[240px] lg:min-h-[280px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/image_5.png"
            alt="Trucks on highway"
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gray-900/50" />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 w-full py-8">
          <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold tracking-wide text-white text-center sm:text-left">
            THE ROAD TO SUSTAINABILITY STARTS HERE.
          </h2>
          <Link
            href="#sustainability"
            className="shrink-0 rounded-lg bg-brand-2 px-6 py-3 text-base font-semibold text-brand-1 hover:opacity-90 transition-opacity"
          >
            Learn More
          </Link>
        </div>
      </section>

      {/* Ready to Transform */}
      <section className="py-10 sm:py-16 lg:py-24 bg-gray-50">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-brand-1">
            Ready to Transform Your Logistics?
          </h2>
          <p className="mt-4 text-gray-600">
            Take control of your shipments with Luggizztik, efficient,
            transparent, and secure solutions.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="#quote"
              className="inline-flex rounded-lg bg-brand-2 px-6 py-3 text-base font-semibold text-brand-1 hover:opacity-90 transition-opacity"
            >
              Get a Quote Now
            </Link>
            <Link
              href="/solutions"
              className="inline-flex rounded-lg bg-brand-2 px-6 py-3 text-base font-semibold text-brand-1 hover:opacity-90 transition-opacity"
            >
              View Our Services
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
