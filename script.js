document.addEventListener('DOMContentLoaded', () => {
    
    document.querySelectorAll('[contenteditable]').forEach((element, index) => {
        const savedContent = sessionStorage.getItem('content' + index);
        if (savedContent) {
            element.innerHTML = savedContent;
        }
        element.addEventListener('input', () => {
            sessionStorage.setItem('content' + index, element.innerHTML);
        });

        element.addEventListener('click', function (element) {
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            this.appendChild(ripple);

            const maxSize = Math.max(this.clientWidth, this.clientHeight);
            ripple.style.width = ripple.style.height = `${maxSize}px`;
            const rect = this.getBoundingClientRect();
            ripple.style.left = `${element.clientX - rect.left - maxSize / 2}px`;
            ripple.style.top = `${element.clientY - rect.top - maxSize / 2}px`;

            ripple.addEventListener('animationend', () => {
                ripple.remove();
            });
        });
    });
});