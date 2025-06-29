// src/types/next.d.ts
import 'next';

declare module 'next' {
  export type PageProps = {
    params?: Record<string, string>;
    searchParams?: Record<string, string | string[]>;
  };
}
