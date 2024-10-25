window.history.pushState(null, "", window.location.href);
window.onpopstate = function () {
  window.history.pushState(null, "", window.location.href);
};

function loaderAnimation(){
  var tl = gsap.timeline();
  tl
      .from(".main .loader .slogan p",{
          opacity:0,
          delay:0.8,
          duration:.4,
          stagger:.1,
          ease:Expo
      },"one")
      .from(".main .loader .logo",{
          opacity:0,
          delay:0.8,
          duration:.4,
          stagger:.1,
          ease:Expo
      },"one")
      .from("#load .loader-animation",{
        opacity:0,
        ease:Expo
      })
      .to(".main .loader .slogan p",{
          y:"-100%",
          opacity:0,
          delay:1,
      },"two")
      .to(".main .loader .logo",{
          y:"-100%",
          opacity:0,
          delay:1,
      },"two")
      .to("#load .loader-animation",{
        opacity:0,
      })
      .to(".loader", {
          height: 0,
          duration: 1,
          ease: Circ.easeInOut
      },"three")
      .to("#green", {
          height: "100vh",
          top: 0,
          ease:Circ.easeInOut
      },"three")
      .to("#green", {
          height: "0vh",
          top: 0,
          duration: 0.3,
          delay:-.2,
          ease: Circ.easeInOut,
          // onComplete:function(){
          //     animateHomepage();
          // }

      })
}

loaderAnimation();


// async function fetchCurrentValues() {
//     try {
//       const response = await fetch('/api/latest');
//       const currentData = await response.json();
  
//       if (currentData) {
//         document.getElementById('current-voltage').textContent = currentData.voltage.toFixed(2); // Display voltage with 2 decimal places
//         document.getElementById('current-current').textContent = currentData.current.toFixed(2); // Display current with 2 decimal places
//       }
//     } catch (error) {
//       console.error('Error fetching current values:', error);
//     }
//   }
  
//   async function fetchHistory() {
//     try {
//       const response = await fetch('/api/history');
//       const data = await response.json();
  
//       const tableBody = document.getElementById('data-table-body');
//       tableBody.innerHTML = '';
  
//       data.forEach(entry => {
//         const row = `<tr>
//             <td>${new Date(entry.timestamp).toLocaleString()}</td> <!-- Format timestamp -->
//             <td>${entry.voltage.toFixed(2)}</td> <!-- Display voltage with 2 decimal places -->
//             <td>${entry.current.toFixed(2)}</td> <!-- Display current with 2 decimal places -->
//           </tr>`;
//         tableBody.innerHTML += row;
//       });
//     } catch (error) {
//       console.error('Error fetching history:', error);
//     }
//   }
  
//   // Call the functions to load historical data and set up interval for current values on page load
//   window.onload = async () => {
//     await fetchHistory(); // Existing function to fetch historical data
//     fetchCurrentValues(); // Fetch current values immediately
  
//     // Update current values every second (1000 milliseconds)
//     // setInterval(fetchCurrentValues, 1000);
//   };



