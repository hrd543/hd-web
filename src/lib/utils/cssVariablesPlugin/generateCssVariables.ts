import type { CssVariablesDefined, CssVariables, DerivedCssVariables } from './types.js';

/**
 * These are the default values.
 * Using the reference to another prop if not itself defined.
 */
const defaultVariables: CssVariablesDefined = {
	backgroundColour: 'white',
	foregroundColour: 'backgroundColour',
	highlightColour: 'blue',
	fontColourMain: 'black',
	fontColourSecondary: 'fontColourMain',
	success: '#44632c',
	failure: '#772e1a',
	neutral: '#574c41',
	headerHeight: '64px',
	headerColour: 'backgroundColour',
	headerPopoverColour: 'backgroundColour',
	pagePadding: '32px',
	pageMaxWidth: '1200px',
	fontSize: '24px'
};

const derivedVariables: DerivedCssVariables = {
	calculatedPadding: 'max(calc(50vw - var(--pageMaxWidth) / 2), var(--pagePadding))'
};

const defaultProperties: Record<string, any> = {
	// make sure clicking on anchor elements scrolls smoothly
	'scroll-behavior': 'smooth'
};

const valueIsCssKey = (value: string): value is keyof CssVariables => value in defaultVariables;

const getVariable = (variables: CssVariables, name: keyof CssVariables) => {
	const value = variables[name] ?? defaultVariables[name];

	if (valueIsCssKey(value)) {
		return variables[value] ?? defaultVariables[value];
	} else {
		return value;
	}
};

/**
 * Transform the given variables (which may have undefined/missing values)
 * into a full set by filling in defaults / keys
 */
const generateCssVariables = (variables: CssVariables) => {
	return Object.keys(defaultVariables).reduce((all, name) => {
		const typedName = name as keyof CssVariables;
		all[typedName] = getVariable(variables, typedName);

		return all;
	}, {} as CssVariablesDefined);
};

/**
 * Add the css variables to the :root selector, replacing any missing values
 * with the default or the relevant keyed value
 */
const applyCssVariables = (rawVariables: CssVariables) => {
	// we can just use rem units by setting the font size on the html
	const { fontSize, ...variables } = generateCssVariables(rawVariables);
	let style = `:root{font-size:${fontSize};`;

	// add the default properties
	Object.entries(defaultProperties).forEach(([key, value]) => {
		style += `${key}: ${value};`;
	});

	// add each of the variables
	Object.entries({ ...variables, ...derivedVariables }).forEach(([key, value]) => {
		style += `--${key}:${value};`;
	});

	style += '}';

	return style;
};

export default applyCssVariables;
