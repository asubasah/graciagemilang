/* ================================================
   PT GRACIA GEMILANG — Form Handler
   js/form.js
   ================================================ */

'use strict';

const WA_NUMBER = '6282318568258';
const WA_BASE   = `https://wa.me/${WA_NUMBER}`;

// ================================================
// CONTACT FORM → WhatsApp redirect
// ================================================
const contactForm = document.getElementById('contactForm');

if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const name    = document.getElementById('formName')?.value.trim() || '';
    const phone   = document.getElementById('formPhone')?.value.trim() || '';
    const service = document.getElementById('formService')?.value || '';
    const qty     = document.getElementById('formQty')?.value.trim() || '';
    const message = document.getElementById('formMessage')?.value.trim() || '';

    if (!name || !phone || !message) {
      showFormError('Mohon isi nama, nomor telepon, dan pesan terlebih dahulu.');
      return;
    }

    const text = buildMessage({ name, phone, service, qty, message });
    const url  = `${WA_BASE}?text=${encodeURIComponent(text)}`;

    showFormSuccess();
    setTimeout(() => window.open(url, '_blank'), 800);
  });
}

function buildMessage({ name, phone, service, qty, message }) {
  let msg = `*Halo PT Gracia Gemilang!*\n\n`;
  msg += `Saya ingin menanyakan informasi lebih lanjut.\n\n`;
  msg += `*Nama:* ${name}\n`;
  msg += `*No. Telepon:* ${phone}\n`;
  if (service) msg += `*Jenis Layanan:* ${service}\n`;
  if (qty)     msg += `*Estimasi Qty:* ${qty} pcs\n`;
  msg += `\n*Pesan:*\n${message}\n\n`;
  msg += `Terima kasih! 🙏`;
  return msg;
}

// ================================================
// QUICK WHATSAPP (buttons with data-wa)
// ================================================
document.querySelectorAll('[data-wa]').forEach(btn => {
  btn.addEventListener('click', () => {
    const textMsg = btn.dataset.wa || 'Halo, saya ingin menanyakan jasa konveksi PT Gracia Gemilang.';
    window.open(`${WA_BASE}?text=${encodeURIComponent(textMsg)}`, '_blank');
  });
});

// ================================================
// FORM UI HELPERS
// ================================================
function showFormError(msg) {
  removeFormFeedback();
  const el = document.createElement('div');
  el.className = 'form-feedback form-error';
  el.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> ${msg}`;
  contactForm.appendChild(el);
  setTimeout(removeFormFeedback, 5000);
}

function showFormSuccess() {
  removeFormFeedback();
  const el = document.createElement('div');
  el.className = 'form-feedback form-success';
  el.innerHTML = `<i class="fa-solid fa-circle-check"></i> Pesan disiapkan! Anda akan diarahkan ke WhatsApp...`;
  contactForm.appendChild(el);
}

function removeFormFeedback() {
  contactForm?.querySelector('.form-feedback')?.remove();
}

// ================================================
// INLINE FORM FEEDBACK STYLES (injected)
// ================================================
const style = document.createElement('style');
style.textContent = `
.form-feedback {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.25rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  margin-top: 1rem;
  animation: fadeInUp 0.35s ease both;
}
.form-error {
  background: #fff2f0;
  color: #cf3a24;
  border: 1px solid #ffc4bb;
}
.form-success {
  background: #f0fdf4;
  color: #16a34a;
  border: 1px solid #bbf7d0;
}
`;
document.head.appendChild(style);
