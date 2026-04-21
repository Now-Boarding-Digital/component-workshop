import Button from '@/components/Button'

export default function ComponentShowcase() {
  return (
    <div className="min-h-screen bg-bg-grey p-10">
      <div className="max-w-4xl mx-auto space-y-12">

        <header>
          <h1 className="text-3xl font-bold text-text-primary font-heading">Component Workshop</h1>
          <p className="text-text-secondary mt-1">Live preview of generated components</p>
        </header>

        {/* ── Button ───────────────────────────────────────────── */}
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-widest text-text-secondary mb-4">
            Button
          </h2>
          <div className="flex flex-wrap gap-4 items-center">
            <Button>Label</Button>
            <Button disabled>Label</Button>
          </div>
        </section>

      </div>
    </div>
  )
}
