# @hd-web/components

This package provides a set of components to use throughout your hd-web site.

NB: Some of these components require the variables defined within the `variables.css` file from the `@hd-web/create` package.
It's recommended to start your site using that package, or you can copy those variables into your own config.

## global

These components are intended to be used throughout your site, and will tend to have the same styling every time they're used.

Examples are buttons, images etc.

## head

These components are only relevant in the `head` html tag, defined via the `head` prop within your hd-web `Site` or `Page`

## local

These components are likely to only be used a handful of times in your site, and in many cases just once.

Examples include headers, carousels etc.

## shared

This includes utilities used by these folders, and have been exposed for consistency throughout the site.
