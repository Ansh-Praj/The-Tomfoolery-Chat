function Name({socketRef, setIsNameSet, name, setName}) {

    

    function handleNameSubmit(e){
        e.preventDefault()
        socketRef.current.emit('name', name)
        setIsNameSet(true)
    }

  return (
    
    <div className="bg-[#222] h-screen w-screen flex justify-center items-center">
        <form action="" onSubmit={handleNameSubmit} className="space-x-2 text-slate-50 flex flex-col items-center">
          <label>Enter your name shawty</label>
          <img src="https://cdn.discordapp.com/emojis/898907591911043092.webp?size=128" alt="Cool Emoji" />
          <input 
          className="ring ring-indigo-600 p-3 outline-none text-slate-50"
          type="text" value={name} onChange={(e)=> setName(e.target.value)}/>
        </form>
    </div>

  )
}

export default Name