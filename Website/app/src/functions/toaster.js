export function toastMessage(toastProvider, data) {
	if (data.message) {
		toastProvider(data.message, {
			variant: data.type ? data.type : "default",
			autoHideDuration: data.autoHideDuration ? data.autoHideDuration : 1000,
			anchorOrigin: { vertical: 'top', horizontal: 'right' }
		});
	} else {
		toastProvider(data, { 
			variant: "default", autoHideDuration: 1000,
			anchorOrigin: { vertical: 'top', horizontal: 'right' }
		});
	}
}