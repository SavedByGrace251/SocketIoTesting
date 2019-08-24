function toastMessage(toastProvider, data) {
    console.log('Message received:', data);
    toastProvider(data.message, {
        variant: data.type ? data.type : "default",
        autoHideDuration: data.autoHideDuration ? data.autoHideDuration : 2000,
        anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
        }
    });
}

export default toastMessage