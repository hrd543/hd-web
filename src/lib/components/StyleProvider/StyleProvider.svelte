<!-- 
  @component
  
  Use this component to modify the css variables used throughout the project

  Leave a variable blank to use its default

  Variables can reference other keys to use that value instead
 -->

<script lang="ts">
	import type { CssVariables } from './types.js';
	import applyCssVariables from './generateCssVariables.js';

	export let variables: CssVariables;
</script>

<div style={applyCssVariables(variables)} class="StyleProvider">
	<slot />
</div>
