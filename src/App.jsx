import { useEffect, useRef, useState } from "react"
import { io } from "socket.io-client"
import Name from "./components/Name";
import Chat from "./components/Chat";
import { Slide, ToastContainer } from "react-toastify";

function App() {
  const socketRef = useRef()
  
  const [isNameSet, setIsNameSet] = useState(false)
  const [name, setName] = useState('')

  useEffect(() => {
    if(import.meta.env.VITE_NODE_ENV === 'production'){
      socketRef.current = io(import.meta.env.VITE_SOCKET_URL)
    }
    if(import.meta.env.VITE_NODE_ENV === 'development'){
      socketRef.current = io("http://localhost:3000")
    }

    
  }, [])

  return (
    <>
      <ToastContainer
      position="top-right"
      autoClose={1500}
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

      {isNameSet ? <Chat socketRef={socketRef} name={name} /> : <Name socketRef={socketRef} setIsNameSet={setIsNameSet} name={name} setName={setName} />
      }
    </>
  )
}

export default App
