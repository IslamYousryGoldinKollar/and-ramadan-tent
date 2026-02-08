'use client'

import { LucideIcon, Download, ChevronDown } from 'lucide-react'

interface WellnessContentCardProps {
  id: string
  title: string
  content: string
  pdfUrl?: string | null
  displayOrder?: number
  icon: LucideIcon
  colorClass: { bg: string; shadow: string }
  isExpanded: boolean
  onToggle: () => void
}

export function WellnessContentCard({
  title,
  content,
  pdfUrl,
  icon: Icon,
  colorClass,
  isExpanded,
  onToggle,
}: WellnessContentCardProps) {
  const lines = content.split('\n').filter(Boolean)
  const preview = lines.slice(0, 2).join(' ')
  const hasMore = content.length > 120

  return (
    <div
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden active:scale-[0.99] transition-all"
    >
      <button
        onClick={onToggle}
        className="w-full text-left p-4 flex items-center gap-4"
      >
        <div className={`w-12 h-12 bg-gradient-to-br ${colorClass.bg} rounded-xl flex items-center justify-center flex-shrink-0 shadow-md ${colorClass.shadow}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-[15px] leading-snug">{title}</h3>
          {!isExpanded && hasMore && (
            <p className="text-sm text-gray-400 mt-0.5 truncate">{preview}</p>
          )}
        </div>
        <ChevronDown className={`h-5 w-5 text-gray-300 flex-shrink-0 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
      </button>

      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-4 pb-4 pt-0">
          <div className="border-t border-gray-100 pt-4">
            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{content}</p>
            {pdfUrl && (
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-gray-50 text-gray-700 text-sm font-medium hover:bg-gray-100 active:bg-gray-200 transition-colors"
              >
                <Download className="h-4 w-4" />
                Download PDF
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
