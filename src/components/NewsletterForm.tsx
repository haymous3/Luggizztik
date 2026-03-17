"use client";

export function NewsletterForm() {
  return (
    <form
      className="mt-2 flex flex-col sm:flex-row gap-2 min-w-0"
      onSubmit={(e) => e.preventDefault()}
    >
      <input
        type="email"
        placeholder="Enter your email"
        className="flex-1 min-w-0 rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:border-brand-1 focus:outline-none focus:ring-1 focus:ring-brand-1"
        suppressHydrationWarning
      />
      <button
        type="submit"
        className="rounded bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800 transition-colors shrink-0"
        suppressHydrationWarning
      >
        Subscribe
      </button>
    </form>
  );
}
