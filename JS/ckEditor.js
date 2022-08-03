ClassicEditor
	.create(document.querySelector('#ckEditor'))
	.then(editor => {
		console.log(editor);
	})
	.catch(error => {
		console.error(error);
	});

