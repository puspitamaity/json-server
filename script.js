document.addEventListener('DOMContentLoaded', () => {
  const apiUrl = 'http://localhost:3000/tickets';

  const ticketForm = document.getElementById('ticketForm');
  const ticketsTable = document.getElementById('ticketsTable').querySelector('tbody');

  // Fetch and display tickets
  const fetchTickets = async () => {
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error('Failed to fetch tickets');
      const tickets = await response.json();
      displayTickets(tickets);
    } catch (error) {
      console.error(error);
      alert('Error fetching tickets');
    }
  };

  const displayTickets = (tickets) => {
    ticketsTable.innerHTML = '';
    tickets.forEach(ticket => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${ticket.title}</td>
        <td>${ticket.description}</td>
        <td>${ticket.status}</td>
        <td>${ticket.dueDate}</td>
        <td>${ticket.priority}</td>
        <td>
          <button onclick="editTicket(${ticket.id})">Edit</button>
          <button onclick="deleteTicket(${ticket.id})">Delete</button>
        </td>
      `;
      ticketsTable.appendChild(row);
    });
  };

  // Add or update ticket
  ticketForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const id = document.getElementById('ticketId').value;
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const status = document.getElementById('status').value;
    const dueDate = document.getElementById('dueDate').value;
    const priority = document.getElementById('priority').value;

    const ticket = { title, description, status, dueDate, priority };

    try {
      let response;
      if (id) {
        response = await fetch(`${apiUrl}/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(ticket)
        });
      } else {
        response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(ticket)
        });
      }

      if (!response.ok) throw new Error('Failed to save ticket');
      ticketForm.reset();
      await fetchTickets();
    } catch (error) {
      console.error(error);
      alert('Error saving ticket');
    }
  });

  // Edit ticket
  window.editTicket = async (id) => {
    try {
      const response = await fetch(`${apiUrl}/${id}`);
      if (!response.ok) throw new Error('Failed to fetch ticket');
      const ticket = await response.json();
      document.getElementById('ticketId').value = ticket.id;
      document.getElementById('title').value = ticket.title;
      document.getElementById('description').value = ticket.description;
      document.getElementById('status').value = ticket.status;
      document.getElementById('dueDate').value = ticket.dueDate;
      document.getElementById('priority').value = ticket.priority;
    } catch (error) {
      console.error(error);
      alert('Error fetching ticket');
    }
  };

  // Delete ticket
  window.deleteTicket = async (id) => {
    if (!confirm('Are you sure you want to delete this ticket?')) return;

    try {
      const response = await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete ticket');
      await fetchTickets();
    } catch (error) {
      console.error
    }
  }
})