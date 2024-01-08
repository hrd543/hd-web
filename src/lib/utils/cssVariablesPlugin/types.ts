import type { PluginOption } from 'vite';

export type CssVariablesDefined = {
	backgroundColour: string;
	foregroundColour: string;
	highlightColour: string;
	fontColourMain: string;
	fontColourSecondary: string;
	success: string;
	failure: string;
	neutral: string;
	headerHeight: string;
	headerColour: string;
	headerPopoverColour: string;
	pagePadding: string;
	pageMaxWidth: string;
	fontSize: string;
};

/**
 * Css variables used throughout the project.
 * Leave blank to use the default.
 * Use another key to reference that value.
 */
export type CssVariables = Partial<CssVariablesDefined>;

export type DerivedCssVariables = {
	calculatedPadding: string;
};

export type CssVariablesPluginGenerator = (
	styleLocation: RegExp,
	variables: CssVariables
) => PluginOption;
