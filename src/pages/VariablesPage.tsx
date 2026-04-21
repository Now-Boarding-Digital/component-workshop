import { useState } from 'react'
import { figmaTokens, Collection, Token } from '@/data/figmaTokens'

function luminance(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255
  const toLinear = (c: number) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4))
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b)
}

function textOn(hex: string) {
  return luminance(hex) > 0.179 ? '#020617' : '#ffffff'
}

function groupBy<T>(items: T[], key: (item: T) => string): Record<string, T[]> {
  return items.reduce((acc, item) => {
    const k = key(item)
    ;(acc[k] = acc[k] || []).push(item)
    return acc
  }, {} as Record<string, T[]>)
}

function ColorSwatch({ hex, label }: { hex: string; label: string }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(hex)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }
  return (
    <button
      onClick={copy}
      title={`Copy ${hex}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-gray-200 text-left transition hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
    >
      <div className="h-14 w-full" style={{ backgroundColor: hex }}>
        <span
          className="flex h-full items-center justify-center text-xs font-mono opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ color: textOn(hex) }}
        >
          {copied ? 'Copied!' : hex}
        </span>
      </div>
      <div className="bg-white px-2 py-1.5">
        <p className="text-xs font-medium text-gray-800 truncate">{label}</p>
        <p className="text-xs text-gray-400 font-mono">{hex}</p>
      </div>
    </button>
  )
}

function SystemColoursSection({ collection }: { collection: Collection }) {
  const colors = collection.variables.filter((v): v is Extract<Token, { type: 'COLOR' }> => v.type === 'COLOR')
  const groups = groupBy(colors, v => v.name.split('/')[0])

  return (
    <div className="space-y-8">
      {Object.entries(groups).map(([group, vars]) => (
        <div key={group}>
          <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">{group}</h3>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
            {vars.map(v => (
              <ColorSwatch key={v.name} hex={v.values['Mode 1'].hex} label={v.name.split('/')[1]} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function ThemeSection({ collection }: { collection: Collection }) {
  const [mode, setMode] = useState<'Light' | 'Dark'>('Light')
  const bg = mode === 'Light' ? 'bg-white' : 'bg-gray-950'
  const text = mode === 'Light' ? 'text-gray-900' : 'text-white'
  const border = mode === 'Light' ? 'border-gray-200' : 'border-gray-700'
  const subtext = mode === 'Light' ? 'text-gray-500' : 'text-gray-400'
  const aliasText = mode === 'Light' ? 'text-gray-400' : 'text-gray-500'

  const colorVars = collection.variables.filter((v): v is Extract<Token, { type: 'COLOR' }> => v.type === 'COLOR')
  const floatVars = collection.variables.filter((v): v is Extract<Token, { type: 'FLOAT' }> => v.type === 'FLOAT')
  const groups = groupBy(colorVars, v => v.name.split('/')[0])

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <span className="text-sm text-gray-500">Preview mode:</span>
        <div className="flex rounded-lg border border-gray-200 overflow-hidden">
          {(['Light', 'Dark'] as const).map(m => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-3 py-1 text-sm font-medium transition ${
                mode === m ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <div className={`rounded-xl border ${border} ${bg} p-6 space-y-6 transition-colors`}>
        {Object.entries(groups).map(([group, vars]) => (
          <div key={group}>
            <h4 className={`text-xs font-semibold uppercase tracking-widest mb-3 ${subtext}`}>{group}</h4>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {vars.map(v => {
                const { hex, alias } = v.values[mode]
                const label = v.name.split('/').slice(1).join('/')
                return (
                  <div key={v.name} className={`flex items-center gap-3 rounded-lg border ${border} px-3 py-2`}>
                    <div
                      className="h-8 w-8 shrink-0 rounded-md border border-black/10"
                      style={{ backgroundColor: hex }}
                    />
                    <div className="min-w-0">
                      <p className={`text-xs font-medium truncate ${text}`}>{label}</p>
                      <p className={`text-xs font-mono ${subtext}`}>{hex}</p>
                      {alias && (
                        <p className={`text-xs truncate ${aliasText}`}>↳ {alias}</p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}

        {floatVars.length > 0 && (
          <div>
            <h4 className={`text-xs font-semibold uppercase tracking-widest mb-3 ${subtext}`}>Opacity</h4>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
              {floatVars.map(v => (
                <div key={v.name} className={`rounded-lg border ${border} px-3 py-2`}>
                  <p className={`text-xs font-medium truncate ${text}`}>{v.name.split('/')[1]}</p>
                  <p className={`text-xl font-semibold font-mono ${text}`}>{v.values[mode].value}%</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function BrandSection({ collection }: { collection: Collection }) {
  const colors = collection.variables.filter((v): v is Extract<Token, { type: 'COLOR' }> => v.type === 'COLOR')
  const floats = collection.variables.filter((v): v is Extract<Token, { type: 'FLOAT' }> => v.type === 'FLOAT')
  const strings = collection.variables.filter((v): v is Extract<Token, { type: 'STRING' }> => v.type === 'STRING')

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Colours</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {colors.map(v => (
            <ColorSwatch key={v.name} hex={v.values['Mode 1'].hex} label={v.name.split('/')[1]} />
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Typography & Identity</h3>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {strings.map(v => (
            <div key={v.name} className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3">
              <span className="text-sm text-gray-500">{v.name.replace('/', ' / ')}</span>
              <span className="text-sm font-semibold text-gray-900">{v.values['Mode 1']}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Border Radius</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {floats.map(v => {
            const px = v.values['Mode 1'].value
            const radius = px >= 100 ? '50%' : `${px}px`
            const label = v.name.split('/')[1]
            return (
              <div key={v.name} className="flex flex-col items-center gap-2 rounded-lg border border-gray-200 p-4">
                <div
                  className="h-10 w-10 border-2 border-gray-900 bg-gray-100"
                  style={{ borderRadius: radius }}
                />
                <p className="text-xs font-medium text-gray-700 text-center">{label}</p>
                <p className="text-xs font-mono text-gray-400">{px >= 100 ? 'full' : `${px}px`}</p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function BaseSizesSection({ collection }: { collection: Collection }) {
  const spacing = collection.variables.filter(v => v.name.startsWith('Spacing/')) as Extract<Token, { type: 'FLOAT' }>[]

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">Spacing Scale</h3>
        <div className="space-y-2">
          {spacing.map(v => {
            const px = v.values['Mode 1'].value
            const label = v.name.split('/')[1]
            return (
              <div key={v.name} className="flex items-center gap-4">
                <span className="w-16 text-right text-xs font-mono text-gray-400">{label}</span>
                <div className="flex items-center gap-2 flex-1">
                  <div
                    className="h-6 rounded bg-blue-500"
                    style={{ width: px === 0 ? 2 : px * 2, minWidth: px === 0 ? 2 : undefined }}
                  />
                  <span className="text-xs font-mono text-gray-500">{px}px</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function ResponsiveSection({ collection }: { collection: Collection }) {
  const modes = collection.modes
  const groups = groupBy(
    collection.variables as Extract<Token, { type: 'FLOAT' }>[],
    v => v.name.includes('/') ? v.name.split('/')[0] : 'General'
  )

  const icons: Record<string, string> = {
    'Desktop HD': '🖥',
    Desktop: '💻',
    Tablet: '📱',
    Mobile: '📲',
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="py-3 pr-6 text-left text-xs font-semibold uppercase tracking-widest text-gray-400 w-56">Token</th>
            {modes.map(m => (
              <th key={m} className="py-3 px-4 text-center text-xs font-semibold uppercase tracking-widest text-gray-400">
                <span className="mr-1">{icons[m] ?? ''}</span>{m}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Object.entries(groups).map(([group, vars]) => (
            <>
              <tr key={`${group}-header`}>
                <td
                  colSpan={modes.length + 1}
                  className="pt-5 pb-1 text-xs font-semibold uppercase tracking-widest text-gray-400"
                >
                  {group}
                </td>
              </tr>
              {vars.map((v, i) => {
                const label = v.name.includes('/') ? v.name.split('/').slice(1).join('/') : v.name
                return (
                  <tr
                    key={v.name}
                    className={`border-b border-gray-100 ${i % 2 === 0 ? 'bg-gray-50/50' : 'bg-white'}`}
                  >
                    <td className="py-2 pr-6 font-mono text-xs text-gray-700">{label}</td>
                    {modes.map(m => {
                      const cell = v.values[m]
                      return (
                        <td key={m} className="py-2 px-4 text-center font-mono text-xs text-gray-600">
                          <span>{cell.value}px</span>
                          {cell.alias && <span className="block text-gray-400 font-sans">↳ {cell.alias}</span>}
                        </td>
                      )
                    })}
                  </tr>
                )
              })}
            </>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const SECTION_COMPONENTS: Record<string, (props: { collection: Collection }) => JSX.Element> = {
  'System Colours': SystemColoursSection,
  'Theme': ThemeSection,
  'Brand': BrandSection,
  'Base Sizes': BaseSizesSection,
  'Responsive': ResponsiveSection,
}

export default function VariablesPage() {
  const [active, setActive] = useState(figmaTokens[0].name)
  const collection = figmaTokens.find(c => c.name === active)!
  const SectionComponent = SECTION_COMPONENTS[active] ?? (() => <p className="text-gray-400">No renderer for this collection.</p>)

  return (
    <div className="min-h-screen bg-gray-50 p-10">
      <div className="max-w-6xl mx-auto space-y-8">
        <header>
          <h1 className="text-3xl font-bold text-gray-900">Design Variables</h1>
          <p className="text-gray-500 mt-1">Synced from Figma — Now Boarding Design System Kit</p>
        </header>

        <nav className="flex gap-1 border-b border-gray-200" aria-label="Variable collections">
          {figmaTokens.map(col => (
            <button
              key={col.name}
              onClick={() => setActive(col.name)}
              className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
                active === col.name
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300'
              }`}
            >
              {col.name}
            </button>
          ))}
        </nav>

        <section>
          <SectionComponent collection={collection} />
        </section>
      </div>
    </div>
  )
}
