import { Spinner } from "@/components/Spinner";

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-brand-5">
      <Spinner size="lg" />
      <p className="text-sm font-medium text-brand-1">Loading...</p>
    </div>
  );
}
