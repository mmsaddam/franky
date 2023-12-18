
const apiKey = 'PUT_YOUR_API_KEY_HERE';


function getSearchQuery() {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const query = urlSearchParams.get('q');
    return query;
}

function showResult(result) {
    const documentDiv = document.createElement('div');
    documentDiv.textContent = result;
    document.body.appendChild(documentDiv);
}

async function requestToChatCompletionLegacy(query) {
    const apiUrl = 'https://api.openai.com/v1/completions';  
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        "model": "gpt-3.5-turbo-instruct",
        "prompt": query,
        "max_tokens": 100,
        "temperature": 0,
      }),
    });
  
    const data = await response.json();
    const content = data.choices[0].text
    return content
  }


async function requestToChatCompletion(query) {
    const apiUrl = 'https://api.openai.com/v1/chat/completions';
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
          "model": "gpt-3.5-turbo",
          "messages": [
              {"role": "user", "content": query}
            ],
          "temperature": 0.7
      }),
    });
  
    const data = await response.json();
    const content = data.choices[0].message.content
    return content
  }

const promptText = getSearchQuery();

// (async () => {
//     const result = await requestToChatCompletion(promptText);
//     console.log(result)
// })();


// (async () => {
//     const response = await requestToChatCompletionLegacy(promptText);
//     showResult(response);
// })();
