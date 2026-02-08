'use client'

import { LucideIcon, ChevronDown, Image as ImageIcon, PlayCircle } from 'lucide-react'
import { VideoEmbed } from '@/components/riddles/video-embed'

interface RamadanArticleProps {
  id: string
  title: string
  excerpt?: string | null
  htmlContent: string
  category: string
  imageUrl?: string | null
  videoUrl?: string | null
  icon: LucideIcon
  colorClass: { bg: string; shadow: string }
  isExpanded: boolean
  onToggle: () => void
}

export function WellnessContentCard({
  title,
  excerpt,
  htmlContent,
  category,
  imageUrl,
  videoUrl,
  icon: Icon,
  colorClass,
  isExpanded,
  onToggle,
}: RamadanArticleProps) {
  return (
    <div
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden active:scale-[0.99] transition-all duration-300 hover:shadow-md"
    >
      <button
        onClick={onToggle}
        className="w-full text-left p-4 flex items-center gap-4"
      >
        <div className={`w-12 h-12 bg-gradient-to-br ${colorClass.bg} rounded-xl flex items-center justify-center flex-shrink-0 shadow-md ${colorClass.shadow}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">
              {category}
            </span>
            {(imageUrl || videoUrl) && (
              <div className="flex gap-1">
                {imageUrl && <ImageIcon className="h-3 w-3 text-gray-400" />}
                {videoUrl && <PlayCircle className="h-3 w-3 text-gray-400" />}
              </div>
            )}
          </div>
          <h3 className="font-semibold text-gray-900 text-[15px] leading-snug">{title}</h3>
          {!isExpanded && excerpt && (
            <p className="text-sm text-gray-400 mt-0.5 truncate">{excerpt}</p>
          )}
        </div>
        <ChevronDown className={`h-5 w-5 text-gray-300 flex-shrink-0 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
      </button>

      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-4 pb-4 pt-0">
          <div className="border-t border-gray-100 pt-4 space-y-4">
            {videoUrl && (
              <div className="rounded-xl overflow-hidden shadow-sm">
                <VideoEmbed url={videoUrl} title={title} />
              </div>
            )}
            
            {imageUrl && !videoUrl && (
              <img 
                src={imageUrl} 
                alt={title} 
                className="w-full h-48 sm:h-64 object-cover rounded-xl shadow-sm"
              />
            )}

            <div 
              className="prose prose-sm max-w-none text-gray-600 leading-relaxed [&_p]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_h1]:font-bold [&_h1]:text-gray-900 [&_h2]:font-bold [&_h2]:text-gray-900"
              dangerouslySetInnerHTML={{ __html: htmlContent }} 
            />
          </div>
        </div>
      </div>
    </div>
  )
}
