export const defaultCssVariables = [
	// default
	{
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
	},
	// desktop
	{},
	// tablet
	{
		fontSize: '20px',
		pageMaxWidth: '640px'
	},
	// mobile
	{ fontSize: '18px', pagePadding: '16px' }
];

// make sure to update _pageWidths.scss if changing these
/** The page widths used throughout for media queries */
export const defaultPageWidths = [
	{ name: 'desktop', value: 1200 },
	{ name: 'tablet', value: 820 },
	{ name: 'mobile', value: 500 }
];

export const defaultStyling = [
	{
		name: 'calculatedPadding',
		value: 'max(calc(50vw - var(--pageMaxWidth) / 2), var(--pagePadding))',
		type: 'variable'
	},
	// make sure clicking on anchor elements scrolls smoothly
	{ name: 'scroll-behavior', value: 'smooth', type: 'property' }
];
