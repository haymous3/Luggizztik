"use client";

export function NewsletterForm() {
  return (
    <form
      className="mt-2 flex gap-2"
      onSubmit={(e) => e.preventDefault()}
    >
      <input
        type="email"
        placeholder="Enter your email"
        className="flex-1 rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:border-brand-1 focus:outline-none focus:ring-1 focus:ring-brand-1"
        suppressHydrationWarning
      />
      <button
        type="submit"
        className="rounded bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800 transition-colors"
        suppressHydrationWarning
      >
        Subscribe
      </button>
    </form>
  );
}
