// FAQ Responses (lowercased for case-insensitive matching)
const faqResponses = {
    "what is this website about?": "This website is a chat-based FAQ system where you can ask questions and receive answers.",
    "how do i use this chat?": "Simply type your question in the input box below and click 'Send' or press Enter.",
    "is this a real person i'm chatting with?": "No, this is a chatbot designed to answer common questions.",
    "what kind of questions can i ask?": "You can ask about the website's features, usage, or common troubleshooting questions."
  };
  
  // DOM Elements
  const chatBox = document.querySelector(".chat-box");
  const inputField = document.querySelector(".chat-input input");
  const sendButton = document.querySelector(".chat-input button");
  const faqSection = document.getElementById("faq-section");
  
  // Event listeners
  sendButton.addEventListener("click", handleUserMessage);
  inputField.addEventListener("keydown", (event) => {
    if (event.key === "Enter") handleUserMessage();
  });
  faqSection.addEventListener("click", handleFAQClick);
  
  // Function to handle user messages
  async function handleUserMessage() {
    const userMessage = inputField.value.trim();
  
    if (userMessage === "") return; // Ignore empty messages
  
    displayMessage(userMessage, "user-message"); // Display user's message
    inputField.value = ""; // Clear the input field
  
    setTimeout(async () => {
      await generateBotResponse(userMessage); // Get bot response from FAQ or API
    }, 500); // Simulate bot response delay
  }
  
  // Function to handle FAQ clicks
  function handleFAQClick(event) {
    if (event.target.tagName === "LI") {
      const question = event.target.textContent.trim().toLowerCase();  // Normalize to lowercase
      displayMessage(question, "user-message");
      
      setTimeout(async () => {
        await generateBotResponse(question); // Get bot response from FAQ or API
      }, 500);
    }
  }
  
  // Function to display messages in the chat box
  function displayMessage(message, className) {
    const messageElement = document.createElement("div");
    messageElement.classList.add("message", className);
  
    const textParagraph = document.createElement("p");
    textParagraph.textContent = message;
    messageElement.appendChild(textParagraph);
  
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight; // Scroll to the latest message
  }
  
  // Function to generate bot response using FAQ or API call
  async function generateBotResponse(userMessage) {
    try {
      // Normalize the user message to lowercase to match FAQ keys
      const normalizedMessage = userMessage.trim().toLowerCase();
  
      // Check if the user's message matches any FAQ (case insensitive)
      if (faqResponses[normalizedMessage]) {
        const botReply = faqResponses[normalizedMessage];
        displayMessage(botReply, "bot-message");
      } else {
        // If no FAQ match, send the request to the API
        const response = await fetch('http://localhost:5000/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ user_input: userMessage }),
        });
  
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
  
        const data = await response.json();
        const botReply = data.bot_reply;
  
        displayMessage(botReply, "bot-message");
      }
    } catch (error) {
      console.error("Error fetching bot response:", error);
      displayMessage("I'm sorry, I couldn't get a response from the server. Please try again later.", "bot-message");
    }
  }
  
  // Function to preload FAQ in chat box as suggestions
  function preloadFAQ() {
    const faqList = faqSection.querySelector("ul");
    
    // Empty the current list to avoid duplicates
    faqList.innerHTML = '';
    
    for (const question in faqResponses) {
      const faqItem = document.createElement("li");
      faqItem.textContent = question;  // Add FAQ question text
      faqList.appendChild(faqItem);
    }
  }
  
  // Initialize chat with FAQ suggestions
  preloadFAQ();
  