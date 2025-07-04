// Function to update date and time
function updateDateTime() {
  const now = new Date();
  
  const date = now.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  const time = now.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
  
  document.getElementById('current-date').textContent = date; 
  document.getElementById('current-time').textContent = time;
}

// Update date and time every second
setInterval(updateDateTime, 1000);
updateDateTime();

// PASSWORD GATE
const overlay = document.getElementById("password-overlay");
const input = document.getElementById("password-input");
const button = document.getElementById("submit-password");
const error = document.getElementById("password-error");

// Use saved password from localStorage or default
let storedPassword = localStorage.getItem("journalPassword") || "chhavi123";

// If already authenticated in this session, skip overlay
if (sessionStorage.getItem("authenticated") === "true") {
  overlay.style.display = "none";
}

// Submit Password
button.addEventListener("click", () => {
  storedPassword = localStorage.getItem("journalPassword") || "chhavi123"; // always get fresh password
  
  if (input.value === storedPassword) {
    sessionStorage.setItem("authenticated", "true");
    overlay.style.display = "none";  // Hide overlay after successful login
    error.style.display = "none";    // Hide error message if login successful
  } else {
    error.style.display = "block";   // Show error if password is incorrect
    input.value = "";               // Clear the input field for retry
  }
});

// CHANGE PASSWORD MODAL
const modal = document.getElementById('change-password-modal');

document.getElementById('changePasswordBtn').addEventListener('click', () => {
  modal.classList.remove('modal-hidden');
});

document.getElementById('cancelChangePassword').addEventListener('click', () => {
  modal.classList.add('modal-hidden');

  // Clear inputs and error
  document.getElementById('old-password').value = '';
  document.getElementById('new-password').value = '';
  document.getElementById('change-password-error').style.display = 'none';
});

// Change Password Logic
document.getElementById('submitNewPassword').addEventListener('click', () => {
  const oldPass = document.getElementById('old-password').value;
  const newPass = document.getElementById('new-password').value;
  const savedPass = localStorage.getItem('journalPassword') || "chhavi123"; // fallback to default
  
  const errorMsg = document.getElementById('change-password-error');
  errorMsg.style.display = 'none'; // Hide any previous error message
  
  // Check if the old password is correct
  if (oldPass === savedPass) {
    // Only change the password if the old password is correct
    localStorage.setItem('journalPassword', newPass);
    
    // Show success message
    errorMsg.style.display = 'block';
    errorMsg.style.color = 'green';
    errorMsg.textContent = 'Password changed successfully!';
    
    // Close the modal and reset fields
    modal.classList.add('modal-hidden');
    document.getElementById('old-password').value = '';
    document.getElementById('new-password').value = '';
  } else {
    // Show error message if the old password is incorrect
    errorMsg.style.display = 'block';
    errorMsg.style.color = 'red';
    errorMsg.textContent = 'Incorrect current password!';
  }
});

// THEME TOGGLE FUNCTIONALITY
document.addEventListener("DOMContentLoaded", () => {
  const themeToggleButton = document.getElementById("theme-toggle");

  // Check if a theme preference is stored in localStorage
  const currentTheme = localStorage.getItem("theme");

  // Apply the saved theme if it exists
  if (currentTheme === "dark") {
    document.body.classList.add("dark-mode");
    themeToggleButton.textContent = "Switch to Light Mode";
  }

  // Toggle theme on button click
  themeToggleButton.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");

    // Save the new theme preference to localStorage
    const newTheme = document.body.classList.contains("dark-mode") ? "dark" : "light";
    localStorage.setItem("theme", newTheme);

    // Update the button text
    themeToggleButton.textContent = newTheme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode";
  });
});
