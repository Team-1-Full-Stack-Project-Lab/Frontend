type Props = {
  activeFilters: string[]
  onToggle: (filter: string) => void
}

export default function FilterPanel({ activeFilters, onToggle }: Props) {
  const popular = ['Cabin', 'Hotel', 'Breakfast included', 'Payment during stay', 'Swimming pool', 'Futrono', 'Hot tub']

  return (
    <div className="mt-4">
      <h3 className="font-semibold mb-2">Filters</h3>
      <div className="text-sm text-muted-foreground mb-3 font-semibold">Recent Filters</div>

      <div className="mb-3">
        <div className="flex items-center mb-4">
          <input
            id="filter-acepta-mascotas"
            type="checkbox"
            checked={activeFilters.includes('Acepta mascotas')}
            onChange={() => onToggle('Acepta mascotas')}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          />
          <label htmlFor="filter-acepta-mascotas" className="ms-2 text-sm font-normal text-gray-900 dark:text-gray-300">
            Pets allowed
          </label>
        </div>
      </div>

      <div className="text-sm text-muted-foreground mb-2 font-semibold">Most Used Filters</div>
      <div className="space-y-2">
        {popular.map((f) => {
          const id = `filter-${f.replace(/\s+/g, '-').replace(/[^\w-]/g, '').toLowerCase()}`
          return (
            <div key={f} className="flex items-center">
              <input
                id={id}
                type="checkbox"
                checked={activeFilters.includes(f)}
                onChange={() => onToggle(f)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label htmlFor={id} className="ms-2 text-sm font-normal text-gray-900 dark:text-gray-300">
                {f}
              </label>
            </div>
          )
        })}
      </div>
    </div>
  )
}
