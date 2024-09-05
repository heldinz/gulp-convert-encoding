import eslint from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
	{
		ignores: ['**/dist/*', '**/coverage/*'],
	},
	eslint.configs.recommended,
	...tseslint.configs.strict,
	...tseslint.configs.stylistic,
	{
		languageOptions: {
			globals: {
				...globals.nodeBuiltin,
			},
		},
	},
);
