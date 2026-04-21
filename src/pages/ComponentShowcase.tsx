import Button from '@/components/Button'

/**
 * ComponentShowcase
 *
 * This is the live preview page. As new components are generated,
 * import them here and add them to the showcase so they can be
 * reviewed visually during the session.
 */
export default function ComponentShowcase() {
  return (
    <div className="min-h-screen bg-gray-50 p-10">
      <div className="max-w-4xl mx-auto space-y-12">

        <header>
          <h1 className="text-3xl font-bold text-gray-900">Component Workshop</h1>
          <p className="text-gray-500 mt-1">Live preview of generated components</p>
        </header>

        {/* ── Button ───────────────────────────────────────────── */}
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-400 mb-4">
            Button
          </h2>
          <div className="flex flex-wrap gap-4 items-center">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="primary" disabled>Disabled</Button>
          </div>
        </section>

        {/*
          ADD NEW COMPONENTS BELOW THIS LINE
          ────────────────────────────────────
          Example:
            import Card from '@/components/Card'
            <section>
              <h2 className="...">Card</h2>
              <Card title="Hello" description="World" />
            </section>
        */}

      </div>
    </div>
  )
}
