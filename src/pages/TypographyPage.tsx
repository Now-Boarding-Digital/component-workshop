type TextStyle = {
  name: string
  group: string
  fontWeight: number
  fontSize: number
  lineHeight: string
  sizeClass: string
  uppercase?: boolean
}

const styles: TextStyle[] = [
  { name: 'H1',          group: 'Headings', fontWeight: 700, fontSize: 40, lineHeight: '120%',  sizeClass: 'text-heading-h1' },
  { name: 'H2',          group: 'Headings', fontWeight: 700, fontSize: 32, lineHeight: '120%',  sizeClass: 'text-heading-h2' },
  { name: 'H3',          group: 'Headings', fontWeight: 700, fontSize: 24, lineHeight: '125%',  sizeClass: 'text-heading-h3' },
  { name: 'H4',          group: 'Headings', fontWeight: 700, fontSize: 18, lineHeight: '132%',  sizeClass: 'text-heading-h4' },
  { name: 'H5',          group: 'Headings', fontWeight: 700, fontSize: 12, lineHeight: '120%',  sizeClass: 'text-heading-h5', uppercase: true },
  { name: 'Base',        group: 'Content',  fontWeight: 400, fontSize: 16, lineHeight: '24px',  sizeClass: 'text-content-base' },
  { name: 'Base Bold',   group: 'Content',  fontWeight: 700, fontSize: 16, lineHeight: '24px',  sizeClass: 'text-content-base' },
  { name: 'Small',       group: 'Content',  fontWeight: 400, fontSize: 14, lineHeight: '20px',  sizeClass: 'text-content-small' },
  { name: 'Small Bold',  group: 'Content',  fontWeight: 700, fontSize: 14, lineHeight: '20px',  sizeClass: 'text-content-small' },
  { name: 'XSmall',      group: 'Content',  fontWeight: 400, fontSize: 12, lineHeight: '16px',  sizeClass: 'text-content-xsmall' },
  { name: 'XSmall Bold', group: 'Content',  fontWeight: 700, fontSize: 12, lineHeight: '16px',  sizeClass: 'text-content-xsmall' },
  { name: 'Number Field',group: 'Content',  fontWeight: 700, fontSize: 30, lineHeight: '40px',  sizeClass: 'text-content-number' },
]

function StyleRow({ style }: { style: TextStyle }) {
  const weightClass = style.fontWeight === 700 ? 'font-bold' : 'font-normal'
  const previewClass = `text-text-primary font-body truncate ${style.sizeClass} ${weightClass}${style.uppercase ? ' uppercase' : ''}`

  return (
    <div className="grid grid-cols-[1fr_auto] gap-4 items-baseline border-b border-ui-line py-5 last:border-0">
      <div className={previewClass}>
        {style.group === 'Headings' ? 'Heading' : 'The quick brown fox jumps over the lazy dog'}
      </div>
      <div className="flex gap-6 shrink-0 text-right">
        <div className="text-xs text-text-secondary font-body w-24">
          <div className="text-text-primary font-medium">{style.group}/{style.name}</div>
          <div>Inter · {style.fontWeight === 400 ? 'Regular' : 'Bold'}</div>
        </div>
        <div className="text-xs text-text-secondary font-body w-16">
          <div className="text-text-primary font-medium">{style.fontSize}px</div>
          <div>font size</div>
        </div>
        <div className="text-xs text-text-secondary font-body w-16">
          <div className="text-text-primary font-medium">{style.lineHeight}</div>
          <div>line height</div>
        </div>
      </div>
    </div>
  )
}

export default function TypographyPage() {
  const groups = ['Headings', 'Content']

  return (
    <div className="min-h-screen bg-bg-grey p-10">
      <div className="max-w-4xl mx-auto space-y-10">
        <header>
          <h1 className="text-3xl font-bold text-text-primary font-heading">Typography</h1>
          <p className="text-text-secondary mt-1 font-body">Text styles from the Now Boarding Design System</p>
        </header>

        {groups.map(group => {
          const groupStyles = styles.filter(s => s.group === group)
          return (
            <section key={group} className="bg-neutral-white rounded-control-lg border border-ui-line px-6">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-text-secondary pt-5 pb-3 border-b border-ui-line font-body">
                {group}
              </h2>
              {groupStyles.map(style => (
                <StyleRow key={style.name} style={style} />
              ))}
            </section>
          )
        })}
      </div>
    </div>
  )
}
