<script lang="ts">
	import Divider from '$lib/divider.svelte';
	import Title from '$lib/title.svelte';
	import UnstyledButton from '$lib/unstyled-button.svelte';
	import DynamicMenuArea from '$lib/dynamic-menu-area.svelte';
	import { page } from '$app/stores';
	import { getUser } from '$lib/firebase/user.svelte';
	import { progress } from '$lib/progress.svelte';
	import { books } from '$lib/books.svelte';
	import { writeJSONFile } from '$lib/file-streams/writeJSONFile';

	const user = $derived(getUser());
	const routes = $derived([
		{
			name: 'Read',
			href: '/'
		},
		{
			name: 'Upload',
			href: '/upload'
		},
		{
			name: user ? 'Sign Out' : 'Log In',
			href: '/login'
		}
	]);

	$effect(() => {
		writeJSONFile(`/books.json`, books.entries());
	});

	function getTitle(href: string) {
		return routes.find((page) => page.href === href)?.name;
	}
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

	progress {
		appearance: none;
		top: 0;
		position: absolute;
		width: 100vw;
		padding: 0;
		margin: 0;
		height: 2px;
		border: none;

		&::-webkit-progress-bar {
			background-color: white;
		}

		&::-webkit-progress-value {
			background-color: #1f51ff;
		}

		&::-moz-progress-bar {
			background-color: #1f51ff;
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
	{#if progress.max}
		<progress value={progress.current} max={progress.max}></progress>
	{/if}
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
	<main>
		<Title>{getTitle($page.url?.pathname)}</Title>
		<Divider />
		<slot />
	</main>
</section>
