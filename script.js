document.getElementById('start-btn').addEventListener('click', function(e) {
  e.preventDefault();
  const apiKeySection = document.getElementById('chat');
  const apiKeyInput = document.getElementById('api-key');  // Get the API key input field

  if (apiKeySection) {
    // Scroll to the API Key section
    apiKeySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // Focus on the API Key input field after scrolling
  if (apiKeyInput) {
    apiKeyInput.focus();
  }
});

const chatLog = document.getElementById('chat-log');
const chatInput = document.getElementById('chat-input');
const apiKeyInput = document.getElementById('api-key');  // Get API key input field
const apiEndpointInput = document.getElementById('api-endpoint');  // Get API endpoint input field

async function sendMessage(message) {
  const userMsg = document.createElement('p');
  userMsg.textContent = 'You: ' + message;
  chatLog.appendChild(userMsg);

  const apiKey = apiKeyInput.value.trim();  // Retrieve API key from input field
  const apiEndpoint = apiEndpointInput.value.trim();  // Retrieve API endpoint from input field

  if (!apiKey || !apiEndpoint) {
    const errorMsg = document.createElement('p');
    errorMsg.textContent = 'Please enter both your API key and API endpoint!';
    chatLog.appendChild(errorMsg);
    return;
  }

  try {
    const response = await fetch(apiEndpoint, {
      method: "POST",  // Or "GET" depending on the API
      headers: {
        "Authorization": `Bearer ${apiKey}`,  // Use user-provided API key
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: message  // Send the user's message as data, or customize based on the API
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      const err = document.createElement('p');
      err.textContent = `API Error (${response.status}): ${errorText}`;
      chatLog.appendChild(err);
      chatLog.scrollTop = chatLog.scrollHeight;
      return;
    }

    const data = await response.json();
    let reply = data.choices?.[0]?.message?.content || "(No response)";
    const botMsg = document.createElement('p');
    botMsg.textContent = 'Response: ' + reply;
    chatLog.appendChild(botMsg);
  } catch (e) {
    const err = document.createElement('p');
    err.textContent = 'Network/JS Error: ' + (e.message || e);
    chatLog.appendChild(err);
  }
  chatLog.scrollTop = chatLog.scrollHeight;
}

chatInput.addEventListener('keypress', function (e) {
  if (e.key === 'Enter' && chatInput.value.trim() !== '') {
    sendMessage(chatInput.value.trim());
    chatInput.value = '';
  }
});

document.getElementById('chat-send').addEventListener('click', function () {
  if (chatInput.value.trim() !== '') {
    sendMessage(chatInput.value.trim());
    chatInput.value = '';
  }
});
