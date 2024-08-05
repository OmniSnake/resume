document.addEventListener('DOMContentLoaded', () => {
    const downloadBtn = document.querySelector('.download-button');
    document.querySelectorAll('[contenteditable]').forEach((element, index) => {
        const savedContent = sessionStorage.getItem('content' + index);
        if (savedContent) {
            element.innerHTML = savedContent;
        }
        element.addEventListener('input', () => {
            sessionStorage.setItem('content' + index, element.innerHTML);
        });

        element.addEventListener('click', function (event) {
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            this.appendChild(ripple);

            const maxSize = Math.max(this.clientWidth, this.clientHeight);
            ripple.style.width = ripple.style.height = `${maxSize}px`;
            const rect = this.getBoundingClientRect();
            ripple.style.left = `${event.clientX - rect.left - maxSize / 2}px`;
            ripple.style.top = `${event.clientY - rect.top - maxSize / 2}px`;

            ripple.addEventListener('animationend', () => {
                ripple.remove();
            });
        });
    });

    document.getElementById('download-button').addEventListener('click', () => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('p', 'pt', 'a4');
        const element = document.querySelector('.container');
        downloadBtn.style.opacity = 0;

        html2canvas(element, {
            scale: 2
        }).then(canvas => {
            const imgData = canvas.toDataURL('image/jpeg', 1.0);
            const imgWidth = 595.28;
            const pageHeight = 841.89;
            const imgHeight = canvas.height * imgWidth / canvas.width;
            let heightLeft = imgHeight;

            let position = 0;

            doc.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                doc.addPage();
                doc.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }
            doc.save('resume.pdf');
            downloadBtn.style.opacity = 1;
        });
    });
});