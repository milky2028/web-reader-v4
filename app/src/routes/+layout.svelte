<script>
	import Divider from '$lib/divider.svelte';
	import Title from '$lib/title.svelte';
</script>

<style>
	.outer-container {
		display: grid;
		grid-template: 'menu main';
		grid-template-columns: 20rem 1fr;
		height: 100%;
	}

	.menu-wrapper {
		padding: 2.5rem;
	}

	.app-title {
		display: grid;
		grid-template-columns: 2rem 1fr;
		align-items: center;
		column-gap: 0.75rem;
		text-decoration: none;

		& img {
			max-width: 2rem;
			border-radius: 0.25rem;
		}
	}

	main {
		margin: 2.5rem;
		padding: 2.5rem;
		border-radius: 3rem;
		box-shadow: 0 0 2rem 0 rgba(0, 0, 0, 0.1);
		background-color: rgb(235, 235, 235);

		@media (prefers-color-scheme: dark) {
			background-color: rgb(15, 15, 15);
		}
	}

	menu {
		list-style: none;
		margin: 0;
		padding-left: 1rem;
	}
</style>

<section class="outer-container">
	<section class="menu-wrapper">
		<a class="app-title" href="/">
			<img src="/reader-180x180.png" alt="Comic Reader application icon" />
			<Title>Comic Reader</Title>
		</a>
		<Divider />
		<menu>
			<style>
				li {
					font-size: 1rem;
					padding-bottom: 0.5rem;
				}
			</style>

			<li>Route 1</li>
			<li>Route 2</li>
			<li>Route 3</li>
			<li>Route 4</li>
		</menu>
	</section>
	<main><slot /></main>
</section>
