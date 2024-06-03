<script>
	import Divider from '$lib/divider.svelte';
	import Title from '$lib/title.svelte';
	import UnstyledButton from '$lib/unstyled-button.svelte';
	import DynamicMenuArea from '$lib/dynamic-menu-area.svelte';

	const routes = [
		{
			name: 'Read',
			href: '/'
		},
		{
			name: 'Upload',
			href: '/upload'
		},
		{
			name: 'Log In',
			href: '/login'
		}
	];
</script>

<style>
	.app-container {
		display: grid;
		grid-template: 'menu main';
		grid-template-columns: 20rem 1fr;
		height: 100%;

		& :global(.arrow) {
			justify-self: end;
			transform: rotate(180deg);

			@media (prefers-color-scheme: dark) {
				filter: invert();
			}
		}
	}

	.menu-wrapper {
		display: grid;
		grid-template-rows: min-content min-content min-content min-content 1fr 4rem;
		padding: 4rem 0 3rem 2.5rem;
	}

	.app-title {
		display: grid;
		grid-template-columns: 2rem 1fr;
		align-items: center;
		column-gap: 0.75rem;

		& img {
			max-width: 2rem;
			border-radius: 0.25rem;
		}
	}

	menu {
		list-style: none;
		margin: 0;
		padding-left: 1rem;

		& li {
			font-size: 1rem;
		}

		& a {
			display: block;
			padding: 0.5rem 0;
			width: 100%;
		}
	}

	main {
		margin: 2.5rem;
		padding: 2.5rem;
		border-radius: 3rem;
		box-shadow: 0 0 2rem 0 rgba(0, 0, 0, 0.1);
		background-color: white;

		@media (prefers-color-scheme: dark) {
			background-color: rgb(15, 15, 15);
		}
	}
</style>

<section class="app-container">
	<section class="menu-wrapper">
		<a class="app-title" href="/">
			<img src="/reader-180x180.png" alt="Comic Reader application icon" />
			<Title>Comic Reader</Title>
		</a>
		<Divider />
		<menu>
			{#each routes as route (route.name)}
				<li><a href={route.href}>{route.name}</a></li>
			{/each}
		</menu>
		<Divider />
		<DynamicMenuArea />
		<UnstyledButton class="arrow"><img src="/forward.svg" alt="Arrow icon" /></UnstyledButton>
	</section>
	<main><slot /></main>
</section>
