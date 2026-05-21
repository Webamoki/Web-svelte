import { resolve } from '$app/paths';

type Link = {
  href: ReturnType<typeof resolve>;
  name: string;
};

export const links: Link[] = [
  { href: resolve('/fields'), name: 'fields' },
  {
    href: resolve('/ui'),
    name: 'ui'
  },
  { href: resolve('/form'), name: 'form' }
];
