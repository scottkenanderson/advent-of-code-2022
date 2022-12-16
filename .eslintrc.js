module.exports = {
	env: {
		es2021: true,
		node: true,
	},
	extends: [
		'xo',
	],
	overrides: [
		{
			extends: [
				'xo-typescript/space',
			],
			files: [
				'*.ts',
				'*.tsx',
			],
		},
	],
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
	},
	rules: {
		'capitalized-comments': ['off'],
	},
};
