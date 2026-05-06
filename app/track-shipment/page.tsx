import TrackShipmentClient from "@/features/driver/components/TrackShipmentClient";

export const metadata = {
  title: "Track Shipment",
};

type PageProps = {
  searchParams?: Promise<{ trackingId?: string }>;
};

export default async function TrackShipmentPage({ searchParams }: PageProps) {
  const resolved = await searchParams;
  const initialTrackingId = resolved?.trackingId ?? "";

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <TrackShipmentClient initialTrackingId={initialTrackingId.toUpperCase()} />
    </main>
  );
}
