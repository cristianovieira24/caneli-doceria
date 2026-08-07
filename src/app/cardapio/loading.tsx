export default function Loading() {
  return (
    <div className="section animate-pulse py-12">
      <div className="h-5 w-28 rounded bg-blush-light" />
      <div className="mt-2 h-10 w-3/4 max-w-lg rounded bg-cream-deep" />
      <div className="mt-3 h-4 w-full max-w-xl rounded bg-cream-deep" />

      <div className="mt-8 flex gap-3">
        <div className="h-11 w-56 rounded-full bg-cream-deep" />
        <div className="h-11 w-40 rounded-full bg-cream-deep" />
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-9 w-24 rounded-full bg-cream-deep" />
        ))}
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-card bg-cream-soft shadow-soft">
            <div className="aspect-[4/3] bg-blush-light" />
            <div className="space-y-2 p-4">
              <div className="h-4 w-3/4 rounded bg-cream-deep" />
              <div className="h-3 w-1/2 rounded bg-cream-deep" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
