import {
	defaultCssVariables,
	defaultPageWidths,
	defaultStyling
} from './constants.js';
import type { CssVariableKey, CssVariables } from './types.js';

const valueIsCssKey = (value: string): value is CssVariableKey =>
	value in defaultCssVariables[0];

const getCssDeclaration = (
	name: string,
	value: string | null | undefined,
	isVariable = false
) => {
	return value ? `${isVariable ? '--' : ''}${name}:${value};` : '';
};

/**
 * Get the value of the variable "name", given
 * the inputted variables and the defaults
 */
const getVariable = (
	name: keyof CssVariables,
	variables: CssVariables,
	defaults: CssVariables
) => {
	const value = variables[name];

	// If null, we are going to remove it from the variables entirely.
	if (value === null) {
		return;
	}

	// if left blank, use the default
	if (value === undefined) {
		const defaultValue = defaults[name];
		if (!defaultValue) {
			return;
		}

		if (valueIsCssKey(defaultValue)) {
			return variables[defaultValue] ?? defaults[defaultValue];
		}

		return defaultValue;
	}

	if (valueIsCssKey(value)) {
		return variables[value] ?? defaults[value];
	} else {
		return value;
	}
};

/**
 * Transform the given variables into a style, replacing any
 * missing values with the default or the relevant keyed value
 */
const transformVariables = (
	variables: CssVariables = {},
	widthIndex: number
) => {
	const defaults = defaultCssVariables[widthIndex];
	if (!defaults) {
		throw 'Default variables not defined. Did you specify the right number of page widths?';
	}

	return Object.keys({ ...defaults, ...variables }).reduce((style, name) => {
		const value = getVariable(name as CssVariableKey, variables, defaults);

		// For font size, we can just set the property manually, and use rem units
		const declaration =
			name === 'fontSize'
				? getCssDeclaration('font-size', value, false)
				: getCssDeclaration(name, value, true);

		return `${style}${declaration}`;
	}, '');
};

/**
 * Generate the correct style given the css variables.
 */
const generateStyling = ([variables, ...mediaQueries]: [
	CssVariables,
	...CssVariables[]
]) => {
	let style = ':root{';

	// First, add the properties and derived css variables
	defaultStyling.forEach(({ name, value, type }) => {
		style += getCssDeclaration(name, value, type === 'variable');
	});

	// Then, add all the variables to the root selector
	style += transformVariables(variables, 0);
	style += '}';

	// Finally, add the media queries and relevant variables
	defaultPageWidths.forEach(({ value: width }, i) => {
		const mediaQuery = mediaQueries[i];
		const mediaStyle = transformVariables(mediaQuery, i + 1);
		if (mediaStyle) {
			style += `@media (max-width: ${width}){:root{${mediaStyle}}}`;
		}
	});

	return style;
};

export default generateStyling;
