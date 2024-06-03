<style>
	button {
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

<button {...$$restProps}><slot /></button>
