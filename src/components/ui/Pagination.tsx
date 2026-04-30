interface PaginationProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  pageSize?: number
  onPageSizeChange?: (pageSize: number) => void
  total?: number
}

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100]

export default function Pagination({ page, totalPages, onPageChange, pageSize, onPageSizeChange, total }: PaginationProps) {
  return (
    <div className="flex items-center justify-between border-t border-gray-100 px-4 py-4">
      <div className="flex items-center gap-3 text-sm text-gray-500">
        {typeof total === 'number' && <span>共 {total} 条</span>}
        {pageSize != null && onPageSizeChange && (
          <label className="flex items-center gap-1">
            每页
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="rounded-lg border border-gray-200 px-2 py-1 text-sm outline-none"
            >
              {PAGE_SIZE_OPTIONS.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            条
          </label>
        )}
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(Math.max(0, page - 1))}
          disabled={page === 0}
          className="rounded-xl border border-gray-200 px-3 py-1.5 text-sm text-gray-600 transition hover:bg-gray-50 disabled:opacity-40"
        >
          上一页
        </button>
        <span className="text-sm text-gray-500">
          {page + 1} / {Math.max(totalPages, 1)}
        </span>
        <button
          onClick={() => onPageChange(Math.min(totalPages - 1, page + 1))}
          disabled={totalPages <= 1 || page >= totalPages - 1}
          className="rounded-xl border border-gray-200 px-3 py-1.5 text-sm text-gray-600 transition hover:bg-gray-50 disabled:opacity-40"
        >
          下一页
        </button>
      </div>
    </div>
  )
}
