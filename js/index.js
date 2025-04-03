// Select DOM elements
const searchForm = document.getElementById('github-form');
const searchInput = document.getElementById('search');
const userList = document.getElementById('user-list');
const reposList = document.getElementById('repos-list');

// API base URL
const apiBaseUrl = 'https://api.github.com';

// Function to search for users
function searchUsers(query) {
  fetch(`${apiBaseUrl}/search/users?q=${query}`, {
    headers: {
      'Accept': 'application/vnd.github.v3+json'
    }
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      // Ensure there are items before trying to display them
      if (data.items && data.items.length > 0) {
        displayUsers(data.items);
      } else {
        alert('No users found.');
      }
    })
    .catch(error => {
      console.error('Error fetching users:', error);
      alert('Failed to fetch users. Please try again.');
    });
}

// Function to search for repositories of a specific user
function searchRepos(username) {
  fetch(`${apiBaseUrl}/users/${username}/repos`, {
    headers: {
      'Accept': 'application/vnd.github.v3+json'
    }
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      // Ensure there are repositories before trying to display them
      if (data.length > 0) {
        displayRepos(data);
      } else {
        reposList.innerHTML = '<li>No repositories found.</li>';
      }
    })
    .catch(error => {
      console.error('Error fetching repositories:', error);
      reposList.innerHTML = '<li>Failed to fetch repositories. Please try again.</li>';
    });
}

// Function to display users
function displayUsers(users) {
  userList.innerHTML = ''; // Clear previous user results
  reposList.innerHTML = ''; // Clear previous repo results

  users.forEach(user => {
    const li = document.createElement('li');
    li.innerHTML = `
      <img src="${user.avatar_url}" alt="${user.login}'s avatar" width="50">
      <a href="${user.html_url}" target="_blank">${user.login}</a>
    `;
    // When a user is clicked, fetch their repositories
    li.addEventListener('click', () => searchRepos(user.login)); 
    userList.appendChild(li);
  });
}

// Function to display repositories
function displayRepos(repos) {
  reposList.innerHTML = ''; // Clear previous repo results

  repos.forEach(repo => {
    const li = document.createElement('li');
    li.innerHTML = `
      <a href="${repo.html_url}" target="_blank">${repo.name}</a>
    `;
    reposList.appendChild(li);
  });
}

// Event listener for form submission
searchForm.addEventListener('submit', (event) => {
  event.preventDefault(); // Prevent the form from submitting normally
  const query = searchInput.value.trim();
  if (query) {
    searchUsers(query); // Search for users when the form is submitted
  }
});
