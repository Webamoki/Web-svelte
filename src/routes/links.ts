import { resolve } from '$app/paths';

type Link = {
	name: string;
	href: ReturnType<typeof resolve>;
};

export const links: Link[] = [
	{ name: 'form', href: resolve('/form') },
	{
		name: 'ui',
		href: resolve('/ui')
	}
];
