// // on first install open the options page to set the API key
// chrome.runtime.onInstalled.addListener(function (details) {
//     if (details.reason == "install") {
//         chrome.tabs.create({ url: "options.html" });
//     }
// });

// get the current time for context in the system message
let time = new Date().toLocaleString('en-US');

// create a system message
const systemMessage = "You are a helpful chat bot. Your answer should not be too long. current time: " + time;

// initialize the message array with a system message
let messageArray = [
    { role: "system", content: systemMessage }
];

// a event listener to listen for a message from the content script that says the user has openend the popup
chrome.runtime.onMessage.addListener(function (request) {
    // check if the request contains a message that the user has opened the popup
    if (request.openedPopup) {
        // reset the message array to remove the previous conversation
        messageArray = [
            { role: "system", content: systemMessage }
        ];
    }
});

// listen for a request message from the content script
chrome.runtime.onMessage.addListener(async function (request) {
    // check if the request contains a message that the user sent a new message
    if (request.input) {
        // get the API key from local storage
        let apiKey = await new Promise(resolve => chrome.storage.local.get(['apiKey'], result => resolve(result.apiKey)));
        
        // get the API model from local storage
        let apiModel = await new Promise(resolve => chrome.storage.local.get(['apiModel'], result => resolve(result.apiModel)));
        console.log(apiModel);

        // Add the user's message to the message array
        messageArray.push({ role: "user", "content": request.input });

        try {
            // send the request containing the messages to the OpenAI API
            let response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    "model": apiModel,
                    "messages": messageArray
                })
            });

            // check if the API response is ok Else throw an error
            if (!response.ok) {
                throw new Error(`Failed to fetch. Status code: ${response.status}`);
            }

            // get the data from the API response as json
            let data = await response.json();

            // check if the API response contains an answer
            if (data && data.choices && data.choices.length > 0) {
                // get the answer from the API response
                let response = data.choices[0].message.content;

                // send the answer back to the content script
                chrome.runtime.sendMessage({ answer: response });

                // Add the response from the assistant to the message array
                messageArray.push({ role: "assistant", "content": response });
            }
        } catch (error) {
            let message = error.message
            let code = error.code
            let errorMessage = "Error: " + message 
            chrome.runtime.sendMessage({ answer: errorMessage });
        }
    }
    // return true to indicate that the message has been handled
    return true;
});




async function sendRequest(messageArray) {
  // get the API key from local storage
  let apiKey = await new Promise(resolve => chrome.storage.local.get(['apiKey'], result => resolve(result.apiKey)));
  
  // get the API model from local storage
  let apiModel = await new Promise(resolve => chrome.storage.local.get(['apiModel'], result => resolve(result.apiModel)));
  console.log(apiModel);


  try {
      // send the request containing the messages to the OpenAI API
      let response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
              "model": apiModel,
              "messages": messageArray
          })
        });

      // check if the API response is ok Else throw an error
      if (!response.ok) {
          throw new Error(`Failed to fetch. Status code: ${response.status}`);
      }

      // get the data from the API response as json
      let data = await response.json();

      // check if the API response contains an answer
      if (data && data.choices && data.choices.length > 0) {
          // get the answer from the API response
          let response = data.choices[0].message.content;
          return response
          
      }
  } catch (error) {
    throw error
  }
}



// listen for a request message from the content script
chrome.runtime.onMessage.addListener(({ summarize, error }) => {
  console.log(summarize);
  if (summarize) {

  }
});
  


chrome.contextMenus.onClicked.addListener(async function (info) {
        // let message = "Summarize the following texts: \n" + info.selectionText;
        let message = "Who is Stev Jobs";
        // chrome.runtime.sendMessage({ input: message })
        chrome.runtime.sendMessage({ summarize: message });
    // }
});

// // A generic onclick callback function.
//  function genericOnClick(info) {
//     if (info.selectionText) {
//         console.log(info.selectionText);
//         let message = "Summarize the following texts: \n" + info.selectionText;
//         chrome.runtime.sendMessage({ input: message }, { 

//         });
//     }
    
//   switch (info.menuItemId) {
//     case 'radio':
//       // Radio item function
//       console.log('Radio item clicked. Status:', info.checked);
//       break;
//     case 'checkbox':
//       // Checkbox item function
//       console.log('Checkbox item clicked. Status:', info.checked);
//       break;
//     default:
//       // Standard context menu item function
//     //   console.log('Standard context menu item clicked.');
//   }
// }


chrome.runtime.onInstalled.addListener(function () {
  // Create one test item for each context type.
//   let contexts = [
//     'page',
//     'selection',
//     'link',
//     'editable',
//     'image',
//     'video',
//     'audio'
//   ];
  let contexts = [
    'selection'
  ];
  
  for (let i = 0; i < contexts.length; i++) {
    let context = contexts[i];
    let title = "Summarize"
    chrome.contextMenus.create({
      title: title,
      contexts: [context],
      id: context
    });
  }

//   // Create a parent item and two children.
//   let parent = chrome.contextMenus.create({
//     title: 'Test parent item',
//     id: 'parent'
//   });
//   chrome.contextMenus.create({
//     title: 'Child 1',
//     parentId: parent,
//     id: 'child1'
//   });
//   chrome.contextMenus.create({
//     title: 'Child 2',
//     parentId: parent,
//     id: 'child2'
//   });

//   // Create a radio item.
//   chrome.contextMenus.create({
//     title: 'radio',
//     type: 'radio',
//     id: 'radio'
//   });

//   // Create a checkbox item.
//   chrome.contextMenus.create({
//     title: 'checkbox',
//     type: 'checkbox',
//     id: 'checkbox'
//   });

//   // Intentionally create an invalid item, to show off error checking in the
//   // create callback.
//   chrome.contextMenus.create(
//     { title: 'Oops', parentId: 999, id: 'errorItem' },
//     function () {
//       if (chrome.runtime.lastError) {
//         console.log('Got expected error: ' + chrome.runtime.lastError.message);
//       }
//     }
//   );
});