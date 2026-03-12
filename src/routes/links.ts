import { resolve } from '$app/paths';

type Link = {
	href: ReturnType<typeof resolve>;
	name: string;
};

export const links: Link[] = [
	{ href: resolve('/form'), name: 'form' },
	{
		href: resolve('/ui'),
		name: 'ui'
	}
];
