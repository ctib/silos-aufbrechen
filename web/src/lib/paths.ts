/** Prefix a path with the configured Astro base URL. */
export function basePath(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}${path.startsWith('/') ? path : '/' + path}`;
}
