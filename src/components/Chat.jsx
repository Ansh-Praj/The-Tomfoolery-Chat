import { useEffect, useRef, useState } from 'react'
import { Slide, toast } from "react-toastify"
import gsap from 'gsap';

function Chat({socketRef, name}) {

  const onlineRef = useRef()
  const ulRef = useRef()
  const timelineRef = useRef()
  const [totalOnline, setTotalOnline] = useState(null)
  const [inputValue, setInputValue] = useState('')
  const [messages, setMessages] = useState([])
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  function handleSubmit(e){
      e.preventDefault()
      socketRef.current.emit('chat message', {name, inputValue})
      setInputValue('')
  }

  function handleOnlineClick(){
      if (isSidebarOpen) {
          timelineRef.current.reverse()
      } else {
          timelineRef.current.play()
      }
      setIsSidebarOpen((prev)=> !prev)
  }

  useEffect(() => {
    if(messages.length) ulRef.current.scrollTo(0, ulRef.current.scrollHeight)
  }, [messages])

  useEffect(() => {
    timelineRef.current = gsap.timeline({paused: true})
    if(onlineRef.current){
      timelineRef.current.to(onlineRef.current, {
          right: '0%'
      })
    }

    socketRef.current.on('chat message', (msg)=>{
      setMessages((prev)=> [...prev, msg])
    })
      
    socketRef.current.on('joined', (name, onlinePeople)=>{
      setTotalOnline(onlinePeople)
      toast(`${name} joined`, {
      position: "top-right",
      autoClose: 1500,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      transition: Slide,
      });
    })

    socketRef.current.on('leave', (name, onlinePeople)=>{
      setTotalOnline(onlinePeople)
      toast(`${name} disconnected`, {
      position: "top-right",
      autoClose: 1500,
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

  return (
    <>
      <div className="flex justify-center items-center bg-slate-950 text-slate-50 gap-3 relative">
        <div className="absolute left-3 cursor-pointer">You: {name}</div>
        <h1>The Tomfoolery Chat</h1>
        <img src="https://cdn.discordapp.com/emojis/898907591911043092.webp?size=128" alt="cool emoji" className="w-8" />
        <div className="absolute right-3 cursor-pointer" onClick={handleOnlineClick}>Members 🟢</div>
      </div>

      {/* online list */}
      <ul ref={onlineRef} className="fixed right-[-10%] bg-[#222] text-slate-50 w-1/12 min-h-[calc(100vh-(--spacing(16)))]">
      {totalOnline && totalOnline.map((user, idx)=>(
        <li key={idx} className="bg-[#333] mb-1 px-3 py-2">{user}</li>
      ))}
      </ul>

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
      </form>
    </>
  )
}

export default Chat