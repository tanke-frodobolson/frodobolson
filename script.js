// Gallery lightbox and contact form validation
document.addEventListener('DOMContentLoaded', ()=>{
  // Sticky header with scroll effect
  const header = document.querySelector('.header');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if(currentScroll > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
  });

  // Gallery filters
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryImages = document.querySelectorAll('.gallery img');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Filter images
      galleryImages.forEach(img => {
        const category = img.dataset.category;

        if(filter === 'all' || category === filter) {
          img.classList.remove('hidden');
        } else {
          img.classList.add('hidden');
        }
      });
    });
  });

  // Lightbox
  const lightbox = document.querySelector('.lightbox');
  const lightboxImg = lightbox && lightbox.querySelector('img');
  document.querySelectorAll('.gallery img').forEach(img=>{
    img.addEventListener('click', ()=>{
      if(!lightbox) return;
      if(img.classList.contains('hidden')) return; // Don't open lightbox for hidden images
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

  // Custom Date Picker
  const dateModal = document.getElementById('dateModal');
  const dateModalClose = document.getElementById('dateModalClose');
  const dateModalTitle = document.getElementById('dateModalTitle');
  const currentMonthEl = document.getElementById('currentMonth');
  const calendarDaysEl = document.getElementById('calendarDays');
  const prevMonthBtn = document.getElementById('prevMonth');
  const nextMonthBtn = document.getElementById('nextMonth');

  let currentDate = new Date();
  let selectedDate = null;
  let activeInput = null;
  let minDate = new Date();
  minDate.setHours(0, 0, 0, 0);

  const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

  function openDateModal(inputElement, title) {
    activeInput = inputElement;
    dateModalTitle.textContent = title;

    // Set current date to the selected value if exists
    if(inputElement.dataset.isoDate) {
      currentDate = new Date(inputElement.dataset.isoDate);
    } else {
      currentDate = new Date();
    }

    renderCalendar();
    dateModal.classList.add('open');
  }

  function closeDateModal() {
    dateModal.classList.remove('open');
    activeInput = null;
  }

  function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    currentMonthEl.textContent = `${months[month]} ${year}`;

    // Get first day of month and number of days
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    calendarDaysEl.innerHTML = '';

    // Add empty cells for days before month starts
    for(let i = 0; i < firstDay; i++) {
      const emptyDay = document.createElement('div');
      emptyDay.className = 'calendar-day empty';
      calendarDaysEl.appendChild(emptyDay);
    }

    // Add days
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for(let day = 1; day <= daysInMonth; day++) {
      const dayDate = new Date(year, month, day);
      dayDate.setHours(0, 0, 0, 0);

      const dayEl = document.createElement('div');
      dayEl.className = 'calendar-day';
      dayEl.textContent = day;

      // Check if date is disabled
      let isDisabled = dayDate < minDate;

      // Additional check for checkout: must be after checkin
      if(activeInput && activeInput.id === 'checkout') {
        const checkinInput = document.getElementById('checkin');
        if(checkinInput.dataset.isoDate) {
          const checkinDate = new Date(checkinInput.dataset.isoDate);
          checkinDate.setHours(0, 0, 0, 0);
          if(dayDate <= checkinDate) {
            isDisabled = true;
          }
        }
      }

      if(isDisabled) {
        dayEl.classList.add('disabled');
      } else {
        // Check if selected
        if(activeInput && activeInput.dataset.isoDate) {
          const selectedDateObj = new Date(activeInput.dataset.isoDate);
          selectedDateObj.setHours(0, 0, 0, 0);
          if(dayDate.getTime() === selectedDateObj.getTime()) {
            dayEl.classList.add('selected');
          }
        }

        // Check if today
        if(dayDate.getTime() === today.getTime()) {
          dayEl.classList.add('today');
        }

        dayEl.addEventListener('click', () => {
          selectDate(dayDate);
        });
      }

      calendarDaysEl.appendChild(dayEl);
    }
  }

  function selectDate(date) {
    if(!activeInput) return;

    const isoDate = date.toISOString().split('T')[0];
    const displayDate = date.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });

    activeInput.value = displayDate;
    activeInput.dataset.isoDate = isoDate;

    // If selecting checkin, update minDate for checkout and clear checkout if needed
    if(activeInput.id === 'checkin') {
      const checkoutInput = document.getElementById('checkout');
      if(checkoutInput.dataset.isoDate) {
        const checkoutDate = new Date(checkoutInput.dataset.isoDate);
        if(checkoutDate <= date) {
          checkoutInput.value = '';
          checkoutInput.dataset.isoDate = '';
        }
      }
    }

    closeDateModal();
  }

  // Event listeners for modal
  if(dateModalClose) {
    dateModalClose.addEventListener('click', closeDateModal);
  }

  if(dateModal) {
    dateModal.addEventListener('click', (e) => {
      if(e.target === dateModal) {
        closeDateModal();
      }
    });
    document.addEventListener('keyup', e => {
      if(e.key === 'Escape') closeDateModal();
    });
  }

  if(prevMonthBtn) {
    prevMonthBtn.addEventListener('click', () => {
      currentDate.setMonth(currentDate.getMonth() - 1);
      renderCalendar();
    });
  }

  if(nextMonthBtn) {
    nextMonthBtn.addEventListener('click', () => {
      currentDate.setMonth(currentDate.getMonth() + 1);
      renderCalendar();
    });
  }

  // Attach date picker to inputs
  const checkinInput = document.getElementById('checkin');
  const checkoutInput = document.getElementById('checkout');

  if(checkinInput) {
    checkinInput.addEventListener('click', () => {
      openDateModal(checkinInput, 'Seleccionar Check-in');
    });
  }

  if(checkoutInput) {
    checkoutInput.addEventListener('click', () => {
      openDateModal(checkoutInput, 'Seleccionar Check-out');
    });
  }

  // Form validation and WhatsApp integration
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  if(form){
    form.addEventListener('submit', (e)=>{
      e.preventDefault();
      status.textContent = '';
      const name = form.name.value.trim();
      const checkinInput = form.checkin;
      const checkoutInput = form.checkout;
      const guests = form.guests.value.trim();
      const children = form.children.value.trim() || '0';

      if(!name || !checkinInput.dataset.isoDate || !checkoutInput.dataset.isoDate || guests === ''){
        status.textContent = 'Por favor rellena todos los campos.';
        status.style.color = 'crimson';
        return;
      }

      // Validate guests is a number
      if(isNaN(guests) || guests < 0){
        status.textContent = 'Por favor ingresa una cantidad válida de adultos.';
        status.style.color = 'crimson';
        return;
      }

      // Validate children is a number
      if(isNaN(children) || children < 0){
        status.textContent = 'Por favor ingresa una cantidad válida de menores.';
        status.style.color = 'crimson';
        return;
      }

      // Validate at least one person
      const totalPeople = parseInt(guests) + parseInt(children);
      if(totalPeople < 1){
        status.textContent = 'Debe haber al menos una persona en la reserva.';
        status.style.color = 'crimson';
        return;
      }

      // Validate checkout is after checkin
      const checkinDate = new Date(checkinInput.dataset.isoDate);
      const checkoutDate = new Date(checkoutInput.dataset.isoDate);
      if(checkoutDate <= checkinDate){
        status.textContent = 'La fecha de check-out debe ser posterior al check-in.';
        status.style.color = 'crimson';
        return;
      }

      // Create WhatsApp message
      let message = `Hola! Me gustaría hacer una reserva.\n\nNombre: ${name}\nCheck-in: ${checkinInput.value}\nCheck-out: ${checkoutInput.value}\nAdultos/mayores de 12: ${guests}`;

      if(parseInt(children) > 0){
        message += `\nMenores de 12 años: ${children}`;
      }

      message += `\nTotal de personas: ${totalPeople}`;

      const whatsappNumber = '5492944936080';
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

      // Open WhatsApp
      window.open(whatsappUrl, '_blank');

      // Show success message
      status.style.color = 'green';
      status.textContent = 'Abriendo WhatsApp...';

      setTimeout(()=>{
        form.reset();
        checkinInput.dataset.isoDate = '';
        checkoutInput.dataset.isoDate = '';
        status.textContent = '';
      }, 2000);
    });
  }
});
