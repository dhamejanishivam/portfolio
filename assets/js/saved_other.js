const GITHUB_TOKEN = "ghp_your_token_here"; // Replace with your token

// Save data to a new Gist
async function saveToGist(data) {
  const response = await fetch("https://api.github.com/gists", {
    method: "POST",
    headers: {
      "Authorization": `token ${GITHUB_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      description: "My stored data", // Optional
      public: true, // Must be true for free accounts
      files: {
        "data.json": { // Filename
          content: JSON.stringify(data) // Data to store
        }
      }
    })
  });
  return await response.json();
}

// Example usage:
const userData = { name: "John", id: 123 };
saveToGist(userData)
  .then(gist => console.log("Gist URL:", gist.html_url))
  .catch(console.error);