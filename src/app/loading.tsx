export default function Loading() {
  return (
    <div className="animate-pulse">
      <div className="section grid gap-10 pb-16 pt-10 lg:grid-cols-2 lg:items-center lg:pt-16">
        <div>
          <div className="h-5 w-32 rounded bg-blush-light" />
          <div className="mt-3 h-12 w-3/4 rounded bg-cream-deep" />
          <div className="mt-5 h-4 w-full max-w-md rounded bg-cream-deep" />
          <div className="mt-2 h-4 w-2/3 max-w-sm rounded bg-cream-deep" />
          <div className="mt-8 flex gap-3">
            <div className="h-12 w-36 rounded-full bg-cream-deep" />
            <div className="h-12 w-40 rounded-full bg-cream-deep" />
          </div>
        </div>
        <div className="aspect-[4/5] w-full max-w-md justify-self-center rounded-[999px_999px_20px_20px] bg-blush-light lg:max-w-none" />
      </div>

      <div className="section py-16">
        <div className="h-8 w-56 rounded bg-cream-deep" />
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
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
    </div>
  );
}
