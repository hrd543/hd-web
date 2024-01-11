<script lang="ts">
	import './NameEmailQuery.scss';
	import Form from '../Form/index.js';
	import { Button } from '../Button/index.js';

	export let action: string;
	export let titles = { query: 'Your Query', name: 'Name', email: 'Email' };
	let className = '';
	export { className as class };
</script>

<Form
	{action}
	minTimeToFillInForm={1000}
	hiddenTermsName="terms"
	class={`NameEmailQuery ${className}`}
>
	<div class="NameEmailQuery_Name">
		<label for="name">{titles.name}</label>
		<input name="name" type="text" id="name" required />
	</div>
	<div class="NameEmailQuery_Email">
		<label for="email">{titles.email}</label>
		<input name="email" type="email" id="email" required />
	</div>
	<div class="NameEmailQuery_Query">
		<label for="query">{titles.query}</label>
		<textarea name="query" id="query" rows={7} />
	</div>
	<Button title="Submit!" type="filled" />
</Form>
