// Gallery lightbox and contact form validation
document.addEventListener('DOMContentLoaded', ()=>{
  // Font selector wiring
  const fontSelect = document.getElementById('fontSelect');
  if(fontSelect){
    fontSelect.addEventListener('change', ()=>{
      document.documentElement.style.setProperty('--brand-font', fontSelect.value);
    });
    // set initial
    document.documentElement.style.setProperty('--brand-font', fontSelect.value);
  }
  // Lightbox
  const lightbox = document.querySelector('.lightbox');
  const lightboxImg = lightbox && lightbox.querySelector('img');
  document.querySelectorAll('.gallery img').forEach(img=>{
    img.addEventListener('click', ()=>{
      if(!lightbox) return;
      lightboxImg.src = img.src;
      lightbox.classList.add('open');
    });
  });
  if(lightbox){
    lightbox.addEventListener('click', (e)=>{
      if(e.target === lightbox || e.target.tagName === 'IMG'){
        lightbox.classList.remove('open');
      }
    });
    document.addEventListener('keyup', e=>{if(e.key==='Escape') lightbox.classList.remove('open')});
  }

  // Form validation and WhatsApp integration
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  if(form){
    form.addEventListener('submit', (e)=>{
      e.preventDefault();
      status.textContent = '';
      const name = form.name.value.trim();
      const guests = form.guests.value.trim();

      if(!name || !guests){
        status.textContent = 'Por favor rellena todos los campos.';
        status.style.color = 'crimson';
        return;
      }

      // Validate guests is a number
      if(isNaN(guests) || guests < 1){
        status.textContent = 'Por favor ingresa una cantidad válida de personas.';
        status.style.color = 'crimson';
        return;
      }

      // Create WhatsApp message
      const message = `Hola! Me gustaría hacer una reserva.\n\nNombre: ${name}\nCantidad de personas: ${guests}`;
      const whatsappNumber = '5492944936080';
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

      // Open WhatsApp
      window.open(whatsappUrl, '_blank');

      // Show success message
      status.style.color = 'green';
      status.textContent = 'Abriendo WhatsApp...';

      setTimeout(()=>{
        form.reset();
        status.textContent = '';
      }, 2000);
    });
  }
});
