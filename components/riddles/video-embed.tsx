'use client'

interface VideoEmbedProps {
  url: string
  title?: string
  className?: string
}

function getYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s?]+)/,
    /youtube\.com\/shorts\/([^&\s?]+)/,
  ]
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  return null
}

function getVimeoId(url: string): string | null {
  const match = url.match(/vimeo\.com\/(\d+)/)
  return match ? match[1] : null
}

function isCanvaUrl(url: string): boolean {
  return url.includes('canva.com')
}

function isMp4Url(url: string): boolean {
  return url.match(/\.(mp4|webm|ogg)(\?|$)/i) !== null || url.includes('/uploads/')
}

export function VideoEmbed({ url, title, className = '' }: VideoEmbedProps) {
  if (!url) return null

  const youtubeId = getYouTubeId(url)
  if (youtubeId) {
    return (
      <div className={`relative w-full aspect-video rounded-lg overflow-hidden ${className}`}>
        <iframe
          src={`https://www.youtube.com/embed/${youtubeId}`}
          title={title || 'YouTube Video'}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      </div>
    )
  }

  const vimeoId = getVimeoId(url)
  if (vimeoId) {
    return (
      <div className={`relative w-full aspect-video rounded-lg overflow-hidden ${className}`}>
        <iframe
          src={`https://player.vimeo.com/video/${vimeoId}`}
          title={title || 'Vimeo Video'}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      </div>
    )
  }

  if (isCanvaUrl(url)) {
    return (
      <div className={`relative w-full aspect-video rounded-lg overflow-hidden ${className}`}>
        <iframe
          src={url}
          title={title || 'Canva Presentation'}
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      </div>
    )
  }

  if (isMp4Url(url)) {
    return (
      <div className={`relative w-full aspect-video rounded-lg overflow-hidden bg-black ${className}`}>
        <video
          src={url}
          controls
          className="absolute inset-0 w-full h-full object-contain"
          title={title || 'Video'}
        >
          Your browser does not support the video tag.
        </video>
      </div>
    )
  }

  // Fallback: try as direct embed
  return (
    <div className={`relative w-full aspect-video rounded-lg overflow-hidden ${className}`}>
      <iframe
        src={url}
        title={title || 'Video'}
        allowFullScreen
        className="absolute inset-0 w-full h-full"
      />
    </div>
  )
}

export function getVideoPlatform(url: string): string {
  if (!url) return 'unknown'
  if (getYouTubeId(url)) return 'youtube'
  if (getVimeoId(url)) return 'vimeo'
  if (isCanvaUrl(url)) return 'canva'
  if (isMp4Url(url)) return 'mp4'
  return 'embed'
}
