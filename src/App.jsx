import { useEffect, useRef, useState } from "react"
import { Slide, toast, ToastContainer } from "react-toastify"
import { io } from "socket.io-client"

function App() {
  const ulRef = useRef()
  const socketRef = useRef()
  const [inputValue, setInputValue] = useState('')
  const [name, setName] = useState('')
  const [isNameSet, setIsNameSet] = useState(false)
  const [messages, setMessages] = useState([])
  
  function handleSubmit(e){
    e.preventDefault()
    socketRef.current.emit('chat message', {name, inputValue})
    setInputValue('')
  }
  
  function handleNameSubmit(e){
    e.preventDefault()
    socketRef.current.emit('name', name)
    setIsNameSet(true)
  }
  
  useEffect(() => {
    if(import.meta.env.VITE_NODE_ENV === 'production'){
      socketRef.current = io(import.meta.env.VITE_SOCKET_URL)
    }
    if(import.meta.env.VITE_NODE_ENV === 'development'){
      socketRef.current = io("http://localhost:3000")
    }
    
    socketRef.current.on('chat message', (msg)=>{
      setMessages((prev)=> [...prev, msg])
    })
    
    socketRef.current.on('joined', (name)=>{
      toast(`${name} joined`, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      transition: Slide,
      });
    })

    socketRef.current.on('leave', (name)=>{
      toast(`${name} disconnected`, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      transition: Slide,
      });
    })
    
    return () =>{
      socketRef.current.disconnect()
    }
  }, [])

  useEffect(() => {
    if(messages.length) ulRef.current.scrollTo(0, ulRef.current.scrollHeight)
  }, [messages])
  
  
  return (
    <>
      <ToastContainer
      position="top-right"
      autoClose={2000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick={false}
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="dark"
      transition={Slide}
      />


      {isNameSet ? (<>
      <div className="flex justify-center items-center bg-slate-950 text-slate-50 gap-3">
        <h1>The Tomfoolery Chat</h1>
        <img src="https://cdn.discordapp.com/emojis/898907591911043092.webp?size=128" alt="cool emoji" className="w-8" />
      </div>
      <ul
        className="mx-auto overflow-auto max-h-[calc(100vh-(--spacing(16)))] " 
        ref={ulRef}>
          {messages.length > 0 && messages.map((mssg, idx)=>(
            <li key={idx}
            className="text-slate-50 bg-[#333] mb-1 px-5 py-2"
            ><p className="font-bold text-lg">{mssg.name}</p>
            <p>{mssg.inputValue}</p>
            </li>
          ))}
          
        </ul>
        <form onSubmit={handleSubmit} action="" className="flex gap-2 bg-black fixed bottom-0 inset-x-0 p-3">
          <input type="text" name="" onChange={(e)=> setInputValue(e.target.value)} value={inputValue} id="" className="bg-amber-50 outline-none flex-1/2 py-2 px-2" />
          <button className="bg-amber-50 px-4 py-2">Send</button>
        </form> </>) 
        : 
        <div className="bg-[#222] h-screen w-screen flex justify-center items-center">
          <form action="" onSubmit={handleNameSubmit} className="space-x-2 text-slate-50 flex flex-col items-center">
            <label>Enter your name shawty</label>
            <img src="https://cdn.discordapp.com/emojis/898907591911043092.webp?size=128" alt="Cool Emoji" />
            <input 
            className="ring ring-indigo-600 p-3 outline-none text-slate-50"
            type="text" value={name} onChange={(e)=> setName(e.target.value)}/>
          </form>
        </div>
      }
    
      
    </>
  )
}

export default App
