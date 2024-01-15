import applyCssVariables from './generateStyling.js';
import type { CssVariablesPluginGenerator } from './types.js';

/**
 * Plugin to setup some default styling, including the
 * generation of the given css variables.
 *
 * @param styleLocation The regex of your app style file location.
 * @param variables The set of css variables to use in the project.
 * The first element is the default styling, while the rest represent
 * the different page widths for media queries.
 * Leave a variable out to use the default.
 * Reference another prop key to use that value.
 * Make the value null to omit the variable entirely.
 * @returns
 */
const cssVariablesPlugin: CssVariablesPluginGenerator = (
	styleLocation,
	variables
) => {
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
