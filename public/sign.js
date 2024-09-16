

  // Login user
  document.getElementById('loginForm').addEventListener('submit', async function (event) {
    event.preventDefault();
    const email = document.getElementById('emailLogin').value;
    const password = document.getElementById('passwordLogin').value;

    const response = await fetch('/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const result = await response.json();
    
    if (response.ok) {
        window.location.href = 'welcome.html';
      } else {
        document.getElementById('responseMessage').textContent = result.message;
      }
  });