// auth.js - Page Guards (jQuery Version)

// Redirect to login if not authenticated
function requireAuth() {
  const token = localStorage.getItem("authToken");
  if (!token) {
    window.location.href = "login.html";
  }
}

// Redirect to dashboard if already authenticated (checks user type)
async function redirectIfLoggedIn() {
  const token = localStorage.getItem("authToken");
  if (token) {
    try {
      // Ensure we always use HTTPS
      let API_URL = window.API_URL || 'https://barbershop.ccs4thyear.com/api';
      // Force HTTPS if somehow http:// got in there
      API_URL = API_URL.replace(/^http:\/\//, 'https://');
      const res = await fetch(`${API_URL}/users/me`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      
      if (res.ok) {
        const data = await res.json();
        const userType = data.user?.user_type || 'user';
        redirectToDashboard(userType);
      } else {
        // Token invalid, clear it
        localStorage.removeItem("authToken");
      }
    } catch (err) {
      console.error("Error checking user type:", err);
      // On error, default to regular dashboard
      window.location.href = "dashboard.html";
    }
  }
}

// Redirect to appropriate dashboard based on user type
function redirectToDashboard(userType = null) {
  // If userType not provided, try to get it from localStorage or fetch
  if (!userType) {
    userType = localStorage.getItem("userType") || 'user';
  }
  
  switch(userType) {
    case 'admin':
      window.location.href = "admin-dashboard.html";
      break;
    case 'barber':
      window.location.href = "barber-dashboard.html";
      break;
    case 'user':
    default:
      window.location.href = "dashboard.html";
      break;
  }
}
