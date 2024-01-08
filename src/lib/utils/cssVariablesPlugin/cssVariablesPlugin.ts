import applyCssVariables from './generateCssVariables.js';
import type { CssVariablesPluginGenerator } from './types.js';

const cssVariablesPlugin: CssVariablesPluginGenerator = (styleLocation, variables) => {
	const styleToAdd = applyCssVariables(variables);

	return {
		name: 'css-variables-plugin',
		transform(code, id) {
			if (styleLocation.test(id)) {
				return {
					code: `${styleToAdd}\n${code}`
				};
			}
		}
	};
};

export default cssVariablesPlugin;
