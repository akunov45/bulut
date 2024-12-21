class FileUploadApi {
	async uploadFile(file, path) {
		const formData = new FormData();
		formData.append('file', file);
		formData.append('upload_preset', 'ml_default');
		formData.append('folder', path);
		
		const response = await fetch(process.env.REACT_APP_CLOUDINARY_URL + '/image/upload', {
			method: 'POST',
			body: formData,
		});
		
		if (!response.ok) {
			throw new Error('Ошибка загрузки изображения');
		}
		
		const data = await response.json();
		console.log(data,'data---upload');
		return data; // Возвращаем URL загруженного изображения
	};
	
	async deleteImage(publicId) {
		try {
			const response = await fetch(process.env.REACT_APP_CLOUDINARY_URL+'/api/delete-image', {
				method: 'DELETE',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({publicId}),
			});
			
			const result = await response.json();
			
			if (response.ok) {
				alert('Файл успешно удалён');
			} else {
				alert('Ошибка удаления: ' + result.message);
			}
		} catch (error) {
			console.error('Ошибка удаления изображения:', error);
			alert('Не удалось удалить изображение');
		}
	};
	
	
}

export default FileUploadApi;
