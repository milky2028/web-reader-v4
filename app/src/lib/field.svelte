<script lang="ts">
	const { type, ...rest } = $props<{ type: 'email' | 'password' | 'text' }>();
</script>

<input {...rest} {type} />
