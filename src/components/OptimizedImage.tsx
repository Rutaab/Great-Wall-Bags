import React from 'react'
import { optimizeImage } from '../utils/images'

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string
  width?: number | string
  height?: number | string
  quality?: number
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({ src, quality, ...props }) => {
  const optimizedSrc = optimizeImage(src, { quality })

  return (
    <img
      {...props}
      src={optimizedSrc}
      loading="lazy"
      decoding="async"
    />
  )
}

export default OptimizedImage
