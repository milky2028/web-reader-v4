import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import isolation from 'vite-plugin-cross-origin-isolation';

export default defineConfig(({ mode }) => {
	const isProd = mode === 'production';

	return {
		plugins: [sveltekit(), isolation()],
		define: {
			__IS_DEV__: !isProd
		},
		minify: isProd ? 'terser' : false,
		worker: {
			format: 'es'
		}
	};
});
