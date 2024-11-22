from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes to allow cross-origin requests

# Define FAQs in a dictionary
FAQ_RESPONSES = {
    "What is your return policy?": "Our return policy allows returns within 30 days of purchase.",
    "How do I track my order?": "You can track your order using the tracking number sent to your email after purchase.",
    "What payment methods do you accept?": "We accept credit cards, debit cards, and PayPal.",
    "Can I cancel my order?": "Yes, you can cancel your order within 24 hours of purchase."
}

# Define the chat route
@app.route('/chat', methods=['POST'])
def chat():
    user_input = request.json.get("user_input")  # Get user input from JSON request body
    
    if user_input:
        # Check if the question is in the FAQs
        bot_reply = FAQ_RESPONSES.get(user_input)
        
        if not bot_reply:
            # Ensure the get_bot_response function is defined in chatbot.py
            from chatbot import get_bot_response  # Import dynamically
            bot_reply = get_bot_response(user_input)  # Custom bot logic if input is not an FAQ
            
        return jsonify({"bot_reply": bot_reply})  # Return the bot reply as JSON
    
    else:
        # Return error if no input is provided
        return jsonify({"error": "No input provided"}), 400

# Run the app
if __name__ == '__main__':
    app.run(debug=True)