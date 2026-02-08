import Image from 'next/image'

interface EandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const sizes = {
  sm: { width: 28, height: 26 },
  md: { width: 36, height: 34 },
  lg: { width: 48, height: 45 },
  xl: { width: 64, height: 60 },
}

export function EandLogo({ size = 'md', className = '' }: EandLogoProps) {
  const { width, height } = sizes[size]
  return (
    <Image
      src="/eand-logo.svg"
      alt="e& Egypt"
      width={width}
      height={height}
      className={className}
      priority
    />
  )
}
