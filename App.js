import React, { useState } from 'react';
import './App.css';
import treeIcon from './treeIcon.png'

function App() {
  const [inputText, setInputText] = useState('');
  const [generatedText, setGeneratedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversation, setConversation] = useState([]); // Store the entire conversation

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:9000/generate-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: inputText }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setConversation([...conversation, { role: 'user', content: inputText }, { role: 'assistant', content: data.generatedText }]); // Append both user and AI responses to the conversation
      setInputText(''); // Clear the input for a new message
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
      setGeneratedText("Failed to generate text."); // Provide feedback on failure
    }
    setIsLoading(false);
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={treeIcon} alt="GPTree icon" className="App-logo" />
        <h1>GPTree</h1>
        <p>A tool for writers to plan their ideas with AI.</p>
      </header>
      <div>
        <input
          type="text"
          value={inputText}
          onChange={handleInputChange}
          disabled={isLoading}
          placeholder="Enter your prompt"
        />
        <button
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? 'Generating...' : 'Generate'}
        </button>
      </div>
      
      <div className="messages">
        {conversation.map((message, index) => (
          <div key={index} className={message.role === 'user' ? 'userText' : 'generatedText'}>
            {message.role !== 'user' && (
              <header className="second-header">
                <h2>Analysis</h2>
              </header>
            )}
            {message.content}
    </div>
  ))}
</div>

    </div>
  );
}

export default App;
