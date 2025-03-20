document.addEventListener('DOMContentLoaded', () => {
    // Get modal elements
    const modal = document.getElementById('booking-modal');
    const closeBtn = document.querySelector('.close');
    const bookBtns = document.querySelectorAll('.book-btn');
    const bookingForm = document.getElementById('booking-form');
    const checkInInput = document.getElementById('check-in');
    const checkOutInput = document.getElementById('check-out');
    const pricePerNightSpan = document.getElementById('price-per-night');
    const totalPriceSpan = document.getElementById('total-price');
    const totalPriceInput = document.getElementById('total-price-input');
    
    // Set minimum check-in/check-out dates to today
    const today = new Date().toISOString().split('T')[0];
    checkInInput.min = today;
    checkOutInput.min = today;
    
    // Show modal when "Book Now" is clicked
    bookBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const roomId = btn.dataset.roomId;
        const roomNumber = btn.dataset.roomNumber;
        const roomPrice = btn.dataset.roomPrice;
        
        document.getElementById('room-id').value = roomId;
        document.getElementById('modal-room-number').textContent = roomNumber;
        pricePerNightSpan.textContent = roomPrice;
        
        modal.style.display = 'block';
      });
    });
    
    // Close modal when X is clicked
    closeBtn.addEventListener('click', () => {
      modal.style.display = 'none';
    });
    
    // Close modal when clicking outside of it
    window.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.style.display = 'none';
      }
    });
    
    // Calculate total price when dates change
    function calculateTotalPrice() {
      const checkIn = new Date(checkInInput.value);
      const checkOut = new Date(checkOutInput.value);
      
      if (checkIn && checkOut && checkOut >= checkIn) {
        const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
        const pricePerNight = parseFloat(pricePerNightSpan.textContent);
        const totalPrice = (nights * pricePerNight).toFixed(2);
        
        totalPriceSpan.textContent = totalPrice;
        totalPriceInput.value = totalPrice;
      } else {
        totalPriceSpan.textContent = '0.00';
        totalPriceInput.value = '';
      }
    }
    
    checkInInput.addEventListener('change', () => {
      // Set minimum check-out date to check-in date
      checkOutInput.min = checkInInput.value;
      calculateTotalPrice();
    });
    
    checkOutInput.addEventListener('change', calculateTotalPrice);
    
    // Handle booking form submission
    bookingForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const formData = new FormData(bookingForm);
      const bookingData = {};
      
      formData.forEach((value, key) => {
        bookingData[key] = value;
      });
      
      try {
        const response = await fetch('/api/bookings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(bookingData)
        });
        
        const result = await response.json();
        
        if (response.ok) {
          alert('Booking confirmed! Your booking ID is: ' + result.booking_id);
          modal.style.display = 'none';
          window.location.reload(); // Refresh to update availability
        } else {
          alert('Error: ' + result.message);
        }
      } catch (error) {
        alert('An error occurred. Please try again.');
        console.error('Error:', error);
      }
    });
  });
