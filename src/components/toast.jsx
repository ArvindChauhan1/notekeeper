const showToast = (message, type = 'default', duration = 3000) => {
    const toastElement = document.createElement('div');
    const classNames = ['fixed', 'top-10', 'right-48', 'w-1/5', 'p-4', 'rounded-md', 'shadow-md', 'font-medium', 'text-lg', 'tracking-wide', 'z-40'];

    switch (type) {
        case 'error':
            classNames.push('bg-red-500', 'text-white');
            break;
        case 'warning':
            classNames.push('bg-yellow-400', 'text-black');
            break;
        case 'success':
            classNames.push('bg-green-500', 'text-white');
            break;
        default:
            classNames.push('bg-gray-900', 'text-white');
    }

    toastElement.className = classNames.join(' ');
    toastElement.innerHTML = `<p>${message}</p>`;
    document.body.appendChild(toastElement);

    // Initial position when opening
    toastElement.style.transform = 'translateX(100%)';

    // Show toast with animation
    requestAnimationFrame(() => {
        toastElement.style.transition = 'transform 0.3s ease-in-out';
        toastElement.style.transform = 'translateX(0)';
    });

    setTimeout(() => {
        // Close toast with animation
        toastElement.style.transform = 'translateX(100%)';

        // Remove toast from DOM after animation finishes
        setTimeout(() => {
            toastElement.remove();
        }, 300);
    }, duration); // Hide the toast after the specified duration
};

export default showToast;
