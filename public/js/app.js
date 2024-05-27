const socket = io();

socket.on('newTransaction', (transaction) => {
  const tbody = document.querySelector('tbody');
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td class="py-2 px-4">${transaction.type}</td>
    <td class="py-2 px-4">${transaction.category.name}</td>
    <td class="py-2 px-4">${transaction.amount}</td>
    <td class="py-2 px-4">${new Date(transaction.date).toDateString()}</td>
    <td class="py-2 px-4">${transaction.recurring ? 'Yes' : 'No'}</td>
    <td class="py-2 px-4">${transaction.recurringInterval}</td>
  `;
  tbody.appendChild(tr);
});
