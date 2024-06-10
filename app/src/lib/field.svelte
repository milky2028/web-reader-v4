<script lang="ts">
	const { type, ...rest } = $props<
		Partial<HTMLInputElement> & { type: 'email' | 'password' | 'text' }
	>();
</script>

<style>
	input {
		display: block;
		margin-bottom: 0.5rem;
		border-style: solid;
		border-width: 2px;
		background-color: white;
		border-color: black;
		border-radius: 0.5rem;
		color: black;
		padding: 0.5rem 1rem;

		@media (prefers-color-scheme: dark) {
			border-color: white;
			background-color: black;
			color: white;
		}
	}
</style>

<input {...rest} {type} />
