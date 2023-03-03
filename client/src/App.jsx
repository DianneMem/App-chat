import { useState, useEffect } from 'react'
import './App.css'
import io from 'socket.io-client';

const socket = io('http://localhost:4000')

function App() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault(); //Para que no refresca la pag, y no se borran los datos carrgados 
    socket.emit('message', message)//Desde el front del input al back, envío un evento y como parámetro va un a string '' que es un nombre y el 2do es un valor o la variable del estado
    const newMessage = {
      body: message,
      from: "Me"
    }
    setMessages([newMessage, ...messages])

    setMessage('');
  }

  useEffect(() => {
    const receiveMessage = (message) => {
      setMessages([message, ...messages]);
    };
    socket.on('message', receiveMessage);

    return () => {
      socket.off('message', receiveMessage)
    };
  }, [messages]);


  return (
    <div className="h-screen bg-zinc-800 text-white flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-zinc-900 p-10">
        <h1 className='text-2x1 font-bold my-2'>Chat React</h1>
        <input
          type="text"
          onChange={(e) => setMessage(e.target.value)}
          value={message} 
          className="border-2 border-zinc-500 p-2 text-black w-full"
          />
        <ul className='h-80 overflow-y-auto'>
        {messages.map((message, index) => (
          <li key={index}
           className={`my-2 p-2 table text-sm rounded-md ${message.from === "Me" ? "bg-sky-700 ml-auto" : "bg-black"}`}
           >
            <p>
              {message.from}:{message.body}
              </p>
          </li>
          ))}
          </ul>
        
      </form>



    </div>
  )
}

export default App
