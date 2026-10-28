export function optimizeImage(url: string, opts?: { width?: number; height?: number; quality?: number }): string {
  if (url.includes('images.unsplash.com')) {
    const q = opts?.quality ?? 60
    const parts = url.split('?')
    const base = parts[0]
    const params = new URLSearchParams(parts[1] || '')

    params.set('q', String(q))
    params.set('fit', 'crop')

    if (opts?.width && !url.includes('w=')) params.set('w', String(opts.width))
    if (opts?.height && !url.includes('h=')) params.set('h', String(opts.height))

    return `${base}?${params.toString()}`
  }
  return url
}
