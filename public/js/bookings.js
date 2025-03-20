document.addEventListener('DOMContentLoaded', () => {
    const bookingsList = document.getElementById('bookings-list');
    const searchInput = document.getElementById('search-input');
    const statusFilter = document.getElementById('status-filter');
    
    let bookings = [];
    
    // Fetch all bookings
    async function fetchBookings() {
      try {
        const response = await fetch('/api/bookings');
        bookings = await response.json();
        displayBookings(bookings);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        bookingsList.innerHTML = '<tr><td colspan="8">Error loading bookings. Please try again.</td></tr>';
      }
    }
    
    // Display bookings in the table
    function displayBookings(bookingsToShow) {
      if (bookingsToShow.length === 0) {
        bookingsList.innerHTML = '<tr><td colspan="8">No bookings found</td></tr>';
        return;
      }
      
      bookingsList.innerHTML = '';
      
      bookingsToShow.forEach(booking => {
        const row = document.createElement('tr');
        row.dataset.id = booking.id;
        
        // Format dates
        const checkInDate = new Date(booking.check_in_date).toLocaleDateString();
        const checkOutDate = new Date(booking.check_out_date).toLocaleDateString();
        const bookingDate = new Date(booking.booking_date).toLocaleString();
        
        row.innerHTML = `
          <td>${booking.id}</td>
          <td>${booking.room_number} (${booking.room_type})</td>
          <td>
            <div>${booking.guest_name}</div>
            <div class="email">${booking.guest_email}</div>
          </td>
          <td>${checkInDate}</td>
          <td>${checkOutDate}</td>
          <td>$${booking.total_price}</td>
          <td><span class="status status-${booking.status.toLowerCase()}">${booking.status}</span></td>
          <td>
            <select class="status-change">
              <option value="">Change Status</option>
              <option value="Confirmed" ${booking.status === 'Confirmed' ? 'disabled' : ''}>Confirmed</option>
              <option value="Checked-in" ${booking.status === 'Checked-in' ? 'disabled' : ''}>Checked-in</option>
              <option value="Checked-out" ${booking.status === 'Checked-out' ? 'disabled' : ''}>Checked-out</option>
              <option value="Cancelled" ${booking.status === 'Cancelled' ? 'disabled' : ''}>Cancelled</option>
            </select>
          </td>
        `;
        
        bookingsList.appendChild(row);
      });
      
      // Add event listeners to status change selects
      const statusChanges = document.querySelectorAll('.status-change');
      statusChanges.forEach(select => {
        select.addEventListener('change', handleStatusChange);
      });
    }
    
    // Filter bookings based on search and status
    function filterBookings() {
      const searchTerm = searchInput.value.toLowerCase();
      const statusValue = statusFilter.value;
      
      const filtered = bookings.filter(booking => {
        const nameMatch = booking.guest_name.toLowerCase().includes(searchTerm);
        const emailMatch = booking.guest_email.toLowerCase().includes(searchTerm);
        const statusMatch = statusValue === '' || booking.status === statusValue;
        
        return (nameMatch || emailMatch) && statusMatch;
      });
      
      displayBookings(filtered);
    }
    
    // Handle booking status change
    async function handleStatusChange(e) {
      const select = e.target;
      const newStatus = select.value;
      const row = select.closest('tr');
      const bookingId = row.dataset.id;
      
      if (!newStatus) return;
      
      try {
        // Note: In a real application, you would add an API endpoint to update booking status
        // For now, just update the UI to demonstrate functionality
        alert(`Booking #${bookingId} status would be updated to ${newStatus}`);
        
        // Update the status in the row
        const statusCell = row.querySelector('td:nth-child(7)');
        statusCell.innerHTML = `<span class="status status-${newStatus.toLowerCase()}">${newStatus}</span>`;
        
        // Reset the select
        select.value = '';
        
        // Update the booking in our local array
        const bookingIndex = bookings.findIndex(b => b.id == bookingId);
        if (bookingIndex !== -1) {
          bookings[bookingIndex].status = newStatus;
        }
      } catch (error) {
        console.error('Error updating booking status:', error);
        alert('Failed to update booking status');
      }
    }
    
    // Add event listeners
    searchInput.addEventListener('input', filterBookings);
    statusFilter.addEventListener('change', filterBookings);
    
    // Initial fetch
    fetchBookings();
  });