import { bundledLanguages, bundledThemes, createHighlighter } from 'shiki';

const highlighterPromise = createHighlighter({
  langs: Object.keys(bundledLanguages), // all bundled languages
  themes: Object.keys(bundledThemes) // all bundled themes
});

export async function highlight(code: string, lang: string = 'svelte', theme: string = 'nord') {
  const highlighter = await highlighterPromise;
  return highlighter.codeToHtml(code, { lang, theme });
}
