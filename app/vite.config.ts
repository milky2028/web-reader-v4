import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => {
	const isProd = mode === 'production';

	return {
		plugins: [sveltekit()],
		define: {
			__IS_DEV__: !isProd
		},
		minify: isProd ? 'terser' : false,
		worker: {
			format: 'es'
		}
	};
});
