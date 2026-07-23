const toolDetails = {
  pdf: {
    title: 'PDF workflow',
    copy: 'Merge, split, compress, and watermark PDFs with a few clicks using the built-in utilities.'
  },
  image: {
    title: 'Image workflow',
    copy: 'Convert, resize, and compress images quickly for web uploads, sharing, or storage.'
  },
  qr: {
    title: 'QR workflow',
    copy: 'Generate QR codes for URLs, text, Wi-Fi, and contact details in seconds.'
  },
  text: {
    title: 'Text workflow',
    copy: 'Format JSON, convert cases, count words, and create passwords with a simple interface.'
  }
};

const title = document.getElementById('tool-title');
const copy = document.getElementById('tool-copy');

document.querySelectorAll('.tool-item').forEach((button) => {
  button.addEventListener('click', () => {
    const detail = toolDetails[button.dataset.tool];
    if (detail) {
      title.textContent = detail.title;
      copy.textContent = detail.copy;
    }
  });
});
