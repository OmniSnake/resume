document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[contenteditable]').forEach((element, index) => {
        saveContent(element, index);
        materialWave(element);
    });

    document.getElementById('download-button').addEventListener('click', () => {
        getPdf();
    });
});

function saveContent(element, index) {
    const savedContent = sessionStorage.getItem('content' + index);

    if (savedContent) {
        element.innerHTML = savedContent;
    }
    element.addEventListener('input', () => {
        sessionStorage.setItem('content' + index, element.innerHTML);
    });
}

function materialWave(element) {
    element.addEventListener('click', function (event) {
        const ripple = document.createElement('span');
        const maxSize = Math.max(this.clientWidth, this.clientHeight);
        const rect = this.getBoundingClientRect();

        ripple.classList.add('ripple');
        this.appendChild(ripple);
        ripple.style.width = ripple.style.height = `${maxSize}px`;
        ripple.style.left = `${event.clientX - rect.left - maxSize / 2}px`;
        ripple.style.top = `${event.clientY - rect.top - maxSize / 2}px`;

        ripple.addEventListener('animationend', () => {
            ripple.remove();
        });
    });
}

function getPdf() {
    const downloadBtn = document.querySelector('.download-button');
    const container = document.querySelector('.container');
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('p', 'pt', 'a4');
    downloadBtn.style.opacity = 0;

    html2canvas(container, {
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
}