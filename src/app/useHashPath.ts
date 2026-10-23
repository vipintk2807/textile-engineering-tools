import { useEffect, useState } from 'react';

/** Reads the route from the URL hash, e.g. "#/fabric/gsm" gives "/fabric/gsm". */
export function readHashPath(): string {
  const raw = window.location.hash.replace(/^#/, '');
  if (raw === '') {
    return '/';
  }
  const withSlash = raw.startsWith('/') ? raw : `/${raw}`;
  return withSlash.length > 1 ? withSlash.replace(/\/+$/, '') : withSlash;
}

/** Hash-based routing keeps the app working from static hosting and file servers. */
export function useHashPath(): string {
  const [path, setPath] = useState<string>(readHashPath);
  useEffect(() => {
    const onChange = () => setPath(readHashPath());
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return path;
}
