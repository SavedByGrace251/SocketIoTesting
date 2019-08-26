function toastMessage(toastProvider, data) {
	console.log('Message received:', data);
	if (data.message) {
		toastProvider(data.message, {
			variant: data.type ? data.type : "default",
			autoHideDuration: data.autoHideDuration ? data.autoHideDuration : 2000,
			anchorOrigin: { vertical: 'top', horizontal: 'right' }
		});
	} else {
		toastProvider(data, { 
			variant: "default", autoHideDuration: 2000,
			anchorOrigin: { vertical: 'top', horizontal: 'right' }
		});
	}
}
export default toastMessage