module.exports = {
	root: true,
	env: {
		es6: true,
		node: true
	},
	extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		project: ['./tsconfig.json'],
		sourceType: 'module'
	},
	ignorePatterns: [
		'/lib/**/*', // Ignore built files.
		'/generated/**/*' // Ignore generated files.
	],
	plugins: ['@typescript-eslint']
};
