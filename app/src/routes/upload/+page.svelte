<script lang="ts">
	const acceptedFileTypes = [
		// zip
		'.cbz',
		'.zip',
		'application/zip',
		'application/x-zip-compressed',
		'multipart/x-zip',
		// rar
		'.cbr',
		'application/vnd.rar',
		'application/x-rar-compressed',
		// both
		'application/octet-stream'
	];
</script>

<style>
	.container {
		display: grid;
		place-items: center;
		height: 90%;
	}

	.drop-zone {
		height: 40vh;
		width: 40vw;
		border-radius: 2rem;
		border-width: 1px;
		border-style: dashed;
		border-color: black;
		display: grid;
		grid-template-areas: 'main';
		place-items: center;

		@media (prefers-color-scheme: dark) {
			border-color: white;
		}
	}

	.drag-message-container {
		grid-area: main;

		h2 {
			font-weight: 100;
			font-size: 1rem;
		}
	}

	input {
		cursor: pointer;
		grid-area: main;
		height: 100%;
		width: 100%;
		opacity: 0;
	}
</style>

<div class="container">
	<div role="button" tabindex="0" class="drop-zone">
		<div class="drag-message-container"><h2>Drag and drop or click to upload a book</h2></div>
		<input type="file" accept={acceptedFileTypes.join()} multiple />
	</div>
</div>
