import type { Plugin } from 'vite';
import type { defaultCssVariables } from './constants.js';

export type CssVariableKey = keyof (typeof defaultCssVariables)[0];

export type CssVariables = Partial<Record<CssVariableKey, string | null>>;

export type DerivedCssVariables = {
	calculatedPadding: string;
};

export type CssVariablesPluginGenerator = (
	styleLocation: RegExp,
	variables: [CssVariables, ...CssVariables[]]
) => Plugin;
