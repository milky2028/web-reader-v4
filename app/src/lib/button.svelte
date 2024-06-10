<script lang="ts">
	const {
		type = 'button',
		label,
		...rest
	} = $props<Partial<HTMLButtonElement> & { type?: 'button' | 'submit'; label: string }>();
</script>

<style>
	button,
	input {
		display: block;
		text-align: center;
		cursor: pointer;
		font-size: 1rem;
		padding: 0.25rem 1rem;
		border-style: solid;
		border-width: 2px;
		background-color: white;
		border-color: black;
		border-radius: 0.5rem;
		color: black;

		@media (prefers-color-scheme: dark) {
			border-color: white;
			background-color: black;
			color: white;
		}
	}
</style>

{#if type === 'button'}
	<button {...rest}>{label}</button>
{:else}
	<input {...rest} value={label} type="submit" style="width: {label.length + 2}ch" />
{/if}
