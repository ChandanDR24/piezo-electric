async function fetchCurrentValues() {
    try {
      const response = await fetch('/api/latest');
      const currentData = await response.json();
  
      if (currentData) {
        document.getElementById('current-voltage').textContent = currentData.voltage.toFixed(2); // Display voltage with 2 decimal places
        document.getElementById('current-current').textContent = currentData.current.toFixed(2); // Display current with 2 decimal places
      }
    } catch (error) {
      console.error('Error fetching current values:', error);
    }
  }
  
  async function fetchHistory() {
    try {
      const response = await fetch('/api/history');
      const data = await response.json();
  
      const tableBody = document.getElementById('data-table-body');
      tableBody.innerHTML = '';
  
      data.forEach(entry => {
        const row = `<tr>
          <td>${new Date(entry.timestamp).toLocaleString()}</td> <!-- Format timestamp -->
          <td>${entry.voltage.toFixed(2)}</td> <!-- Display voltage with 2 decimal places -->
          <td>${entry.current.toFixed(2)}</td> <!-- Display current with 2 decimal places -->
        </tr>`;
        tableBody.innerHTML += row;
      });
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  }
  
  // Call the functions to load historical data and set up interval for current values on page load
  window.onload = async () => {
    await fetchHistory(); // Existing function to fetch historical data
    fetchCurrentValues(); // Fetch current values immediately
  
    // Update current values every second (1000 milliseconds)
    setInterval(fetchCurrentValues, 1000);
  };