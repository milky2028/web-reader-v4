<script>
	import Button from '$lib/button.svelte';
	import Field from '$lib/field.svelte';
</script>

<style>
	form {
		display: grid;
		max-width: 25rem;
	}
</style>

<form>
	<Field type="email" name="email" placeholder="Email" />
	<Field type="password" name="password" placeholder="Password" />
	<Button type="submit" label="Log In" />
</form>
