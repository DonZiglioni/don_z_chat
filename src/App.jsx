import React, { useState, useEffect, useSyncExternalStore } from 'react';
import './App.css'



const App = () => {

  const [response, setResponse] = useState(null);
  const [message, setMessage] = useState(null);
  const [previousChats, setPreviousChats] = useState([]);
  const [currentTitle, setCurrentTitle] = useState(null);

  const createNewChat = () => {
    setMessage('');
    setResponse(null);
    setCurrentTitle(null);
  }

  const handleClick = (title) => {
    setCurrentTitle(title);
    setResponse(null);
    setMessage('');
  }

  const getMessages = async () => {
    const options = {
      method: "POST",
      body: JSON.stringify({
        message: message,
      }),
      headers: {
        "Content-Type": "application/json"
      },
    }
    try {
      const response = await fetch('http://localhost:8000/completions', options);
      const data = await response.json();
      setResponse(data.choices[0].message);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    // console.log(currentTitle, message, response);
    if (!currentTitle && message && response) {
      setCurrentTitle(message)
    };
    if (currentTitle, message, response) {
      setPreviousChats(prev => (
        [...prev, {
          title: currentTitle,
          role: "user",
          content: message,
        },
        {
          title: currentTitle,
          role: response.role,
          content: response.content,
        }]
      ))
    }
  }, [response, currentTitle]);

  console.log(previousChats);

  const currentChat = previousChats.filter(prev => prev.title === currentTitle);
  const titles = Array.from(new Set(previousChats.map(prev => prev.title)));
  console.log(titles);

  return (
    <div className='App'>
      <section className='sidebar'>
        <ul className='history'>
          {titles?.map((title, index) => <li key={index} onClick={() => handleClick(title)}>{title}</li>)}
        </ul>
        <button className='add-chat' onClick={createNewChat} >New Chat +</button>
        <nav><p>Made by Don Z</p></nav>
      </section>
      <section className='main'>
        {!currentTitle && <h1>Don Ziglioni AI</h1>}
        <ul className='feed'>
          {!currentTitle ? null : currentChat.map((msg, index) => <li key={index}>
            <p className='role'>{msg.role}</p>
            <p>{msg.content}</p>
          </li>)}
        </ul>
        <div className='bottom'>
          <div className='input-container'>
            <input value={message} onChange={(e) => setMessage(e.target.value)} />
            <div id='submit' onClick={getMessages}>➢</div>
          </div>
          <p className='info'>prompt I think something goes here</p>
        </div>
      </section>
    </div>
  )
}

export default App
