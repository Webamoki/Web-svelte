import { bundledLanguages, bundledThemes, createHighlighter } from 'shiki';

const highlighterPromise = createHighlighter({
	themes: Object.keys(bundledThemes), // all bundled themes
	langs: Object.keys(bundledLanguages) // all bundled languages
});

export async function highlight(code: string, lang: string = 'svelte', theme: string = 'nord') {
	const highlighter = await highlighterPromise;
	return highlighter.codeToHtml(code, { lang, theme });
}
