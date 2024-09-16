// Register user
document.getElementById('registerForm').addEventListener('submit', async function (event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const response = await fetch('/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    });

    const result = await response.json();

    if (response.ok) {
        window.location.href = 'welcome.html';
      } else {
        document.getElementById('responseMessage').textContent = result.message;
      }
  });