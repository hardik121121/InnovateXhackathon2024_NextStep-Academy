import requests
import json

# Groq API URL and key
API_URL = "https://api.groq.com/openai/v1/chat/completions"
API_KEY = "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"  # Use your correct API key here

# Define a set of EdTech-related keywords
EDTECH_KEYWORDS = {
    "gate exam", "study tips", "online learning", "education", "exam preparation",
    "university", "college", "courses", "study materials", "tutorial", "distance learning",
    "learning platform", "virtual classroom", "e-learning", "student success", "career guidance"
}

def is_edtech_related(user_input):
    """
    Check if the user's question is related to EdTech by looking for keywords.
    Returns True if the question contains EdTech-related keywords, otherwise False.
    """
    user_input_lower = user_input.lower()
    
    # Check if any EdTech-related keyword is found in the user's input
    for keyword in EDTECH_KEYWORDS:
        if keyword in user_input_lower:
            return True
    return False



def get_bot_response(user_input):
    """
    Get the bot's response from the Groq API.
    """
    # Prepare the request payload
    payload = {
        "model": "llama3-8b-8192",  # Model can be updated based on your preference or Groq's available models
        "messages": [{"role": "user", "content": user_input}]
    }
    
    # Set the headers for authorization
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {API_KEY}"
    }
    
    # Make the POST request to Groq's API
    response = requests.post(API_URL, headers=headers, data=json.dumps(payload))
    
    # Check if the response was successful
    if response.status_code == 200:
        # Parse the response JSON
        response_data = response.json()
        
        # Extract the chatbot's reply from the response
        bot_reply = response_data.get("choices", [{}])[0].get("message", {}).get("content", "Sorry, I couldn't process your request.")
        return bot_reply
    else:
        # Handle error in case of failure
        return f"Error: {response.status_code} - {response.text}"

def chat():
    print("Hello! I'm here to assist you with exam preparation.")
    print("Type 'exit' to end the chat.")
    
    while True:
        # Get user input
        user_input = input("You: ")

        # If the user types 'exit', break the loop and end the chat
        if user_input.lower() == 'exit':
            print("Goodbye!")
            break
        
        # Check if the question is related to EdTech
        if is_edtech_related(user_input):
            # Get the bot's response based on user input
            bot_response = get_bot_response(user_input)
        else:
            # Provide a response for unrelated questions
            bot_response = "I'm only able to assist with questions related to education, exams, or study resources. Please ask an EdTech-related question."
        
        # Display the bot's response
        print("Bot:", bot_response)

if __name__ == "__main__":
    chat()