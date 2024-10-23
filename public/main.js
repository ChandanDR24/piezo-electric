window.history.pushState(null, "", window.location.href);
window.onpopstate = function () {
  window.history.pushState(null, "", window.location.href);
};





let list = document.querySelector('.slider .list');
let items = document.querySelectorAll('.slider .list .item');
let dots = document.querySelectorAll('.slider .dots li');
let prev = document.getElementById('prev');
let next = document.getElementById('next');

let active = 1; // Start at the first real item
let lengthItems = items.length;

// Clone the first and last items for smooth infinite scrolling
let firstClone = items[0].cloneNode(true);
let lastClone = items[lengthItems - 1].cloneNode(true);

list.appendChild(firstClone);
list.insertBefore(lastClone, items[0]);

// Update the NodeList after cloning
items = document.querySelectorAll('.slider .list .item');
lengthItems = items.length; // Update the length to include clones

// Set the initial position to the first real image
list.style.transition = 'none';
list.style.left = `-${items[active].offsetLeft}px`; // Start at the first real item

// Function to move to the next image
next.onclick = function () {
  active++;
  list.style.transition = 'left 1s ease';
  list.style.left = `-${items[active].offsetLeft}px`;

  updateDots();

  // When reaching the cloned first item (after the last real item), snap to the real first item
  if (active === lengthItems - 1) {
    setTimeout(() => {
      list.style.transition = 'none';
      active = 1; // Snap to the first real item
      list.style.left = `-${items[active].offsetLeft}px`;
    }, 1000); // Wait for the transition to end before snapping
  }
};

// Function to move to the previous image
prev.onclick = function () {
  active--;
  list.style.transition = 'left 1s ease';
  list.style.left = `-${items[active].offsetLeft}px`;

  updateDots();

  // When reaching the cloned last item (before the first real item), snap to the real last item
  if (active === 0) {
    setTimeout(() => {
      list.style.transition = 'none';
      active = lengthItems - 2; // Snap to the last real item
      list.style.left = `-${items[active].offsetLeft}px`;
    }, 1000); // Wait for the transition to end before snapping
  }
};

// Dots click event
dots.forEach((li, key) => {
  li.addEventListener('click', function () {
    active = key + 1; // Adjust for the cloned items
    list.style.transition = 'left 1s ease';
    list.style.left = `-${items[active].offsetLeft}px`;
    updateDots();
  });
});

// Auto-slide functionality
let refreshSlider = setInterval(() => {
  next.click();
}, 3000);

// Function to update dots based on the current active slide
function updateDots() {
  let lastActiveDot = document.querySelector('.slider .dots li.active');
  if (lastActiveDot) {
    lastActiveDot.classList.remove('active');
  }
  
  let realActiveIndex = (active - 1) % dots.length;
  dots[realActiveIndex].classList.add('active'); // Update dot for the active image
}

// Reload function to reset slider and dots when manually clicked
function reloadSlider() {
  let checkleft = items[active].offsetLeft;
  list.style.left = -checkleft + "px";

  updateDots(); // Ensure dots update after each slide
  
  clearInterval(refreshSlider);
  refreshSlider = setInterval(() => {
    next.click();
  }, 3000);
}






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
  // setInterval(fetchCurrentValues, 1000);
};