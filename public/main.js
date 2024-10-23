window.history.pushState(null, "", window.location.href);
window.onpopstate = function () {
  window.history.pushState(null, "", window.location.href);
};

let list = document.querySelector('.slider .list');
let items = document.querySelectorAll('.slider .list .item');
let dots = document.querySelectorAll('.slider .dots li');
let prev = document.getElementById('prev');
let next = document.getElementById('next');

let active = 0;
let lengthItems = items.length;

// Clone the first and last items for seamless looping
let firstClone = items[0].cloneNode(true);
let lastClone = items[lengthItems - 1].cloneNode(true);

// Append and prepend the cloned items
list.appendChild(firstClone);
list.insertBefore(lastClone, items[0]);

// Update the items NodeList after cloning
items = document.querySelectorAll('.slider .list .item');

// Set the total number of items, including the clones
lengthItems = items.length;

// Offset the list to start at the first "real" item
list.style.left = -items[1].offsetLeft + "px";

next.onclick = function() {
  active++;
  reloadSlider();
};

prev.onclick = function() {
  active--;
  reloadSlider();
};

dots.forEach((li, key) => {
  li.addEventListener('click', function() {
    active = key + 1; // Adjust for the cloned items
    reloadSlider();
  });
});

let refreshSlider = setInterval(() => {
  next.click();
}, 1000 );

function reloadSlider() {
  if (active >= lengthItems - 1) {
    // When reaching the cloned first item (which looks like the last image),
    // snap back to the first actual item instantly
    list.style.transition = 'left 1.2s ease'; // Smooth transition to the clone
    list.style.left = -items[active].offsetLeft + 'px';
    
    // After the smooth transition, quickly reset to the first actual item
    setTimeout(() => {
      active = 1;
      list.style.transition = 'none'; // Disable transition for the snap
      list.style.left = -items[active].offsetLeft + 'px';
    }, 3000); // Adjust the delay to match the transition duration (0.3s)
  } else if (active <= 0) {
    // When reaching the cloned last item (which looks like the first image),
    // snap back to the last actual item instantly
    list.style.transition = 'left 1.2s ease'; // Smooth transition to the clone
    list.style.left = -items[active].offsetLeft + 'px';
    
    setTimeout(() => {
      active = lengthItems - 2;
      list.style.transition = 'none'; // Disable transition for the snap
      list.style.left = -items[active].offsetLeft + 'px';
    }, 3000);
  } else {
    // Normal smooth sliding between images
    list.style.transition = 'left 1.2s ease'; // Smooth transition
    list.style.left = -items[active].offsetLeft + 'px';
  }

  // Update active dot (adjusting for the cloned items)
  let lastActiveDot = document.querySelector('.slider .dots li.active');
  if (lastActiveDot) {
    lastActiveDot.classList.remove('active');
  }
  dots[(active - 1 + dots.length) % dots.length].classList.add('active');

  // Reset the automatic slide interval
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