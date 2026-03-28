import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import { execSync } from 'child_process';

const currentTag = (() => {
	try {
		return execSync('git describe --tags --abbrev=0', { encoding: 'utf-8' }).trim();
	} catch {
		return 'v0.0.0';
	}
})();

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit()
	],
	define: {
		__APP_VERSION__: JSON.stringify(currentTag)
	}
});
