<script lang="ts">
	import Button from '$lib/button.svelte';
	import Field from '$lib/field.svelte';
	import { auth } from '$lib/auth';
	import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
	import { getUser } from '$lib/user.svelte';

	const user = $derived(getUser());

	async function signIn(event: SubmitEvent) {
		event.preventDefault();
		const data = new FormData(event.target as HTMLFormElement);

		const email = data.get('email');
		const password = data.get('password');
		if (typeof email === 'string' && typeof password === 'string') {
			await signInWithEmailAndPassword(auth, email, password);
		}
	}
</script>

<style>
	form {
		display: grid;
		max-width: 25rem;
	}
</style>

{#if user}
	<Button label="Sign Out" onclick={() => signOut(auth)} />
{:else}
	<form onsubmit={signIn}>
		<Field type="email" name="email" placeholder="Email" />
		<Field type="password" name="password" placeholder="Password" />
		<Button type="submit" label="Log In" />
	</form>
{/if}
