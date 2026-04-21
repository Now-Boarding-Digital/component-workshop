import { useState } from 'react'
import ComponentShowcase from '@/pages/ComponentShowcase'
import VariablesPage from '@/pages/VariablesPage'
import TypographyPage from '@/pages/TypographyPage'

type Page = 'components' | 'variables' | 'typography'

export default function App() {
  const [page, setPage] = useState<Page>('variables')

  return (
    <div>
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-10 flex items-center gap-6">
        <span className="text-sm font-semibold text-gray-900 py-3 mr-2">Component Workshop</span>
        {([['variables', 'Variables'], ['typography', 'Typography'], ['components', 'Components']] as [Page, string][]).map(([p, label]) => (
          <button
            key={p}
            onClick={() => setPage(p)}
            className={`py-3 text-sm font-medium border-b-2 -mb-px transition-colors ${
              page === p
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      {page === 'variables' ? <VariablesPage /> : page === 'typography' ? <TypographyPage /> : <ComponentShowcase />}
    </div>
  )
}
