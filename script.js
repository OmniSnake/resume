document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[contenteditable]').forEach((element, index) => {
        const savedContent = sessionStorage.getItem('content' + index);
        if (savedContent) {
            element.innerHTML = savedContent;
        }
        element.addEventListener('input', () => {
            sessionStorage.setItem('content' + index, element.innerHTML);
        });
    });
});