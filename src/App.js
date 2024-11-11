import ChatIcon from '@mui/icons-material/Chat';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import AttachFileRoundedIcon from '@mui/icons-material/AttachFileRounded';
import {useState, useEffect} from 'react';

const App = () => {

  const [value, setValue] = useState(null)
  const [message, setMessage] = useState(null)
  const [previousChats, setPreviousChats] = useState([])
  const [currentTitle, setCurrentTitle] = useState(null)

  const createNewChat = () => {
    setMessage(null)
    setValue("")
    setCurrentTitle(null)
  }

  const handleClick = (uniqueTitle) => {
    setCurrentTitle(uniqueTitle)
    setValue("")
    setCurrentTitle(null)
  }

  const getMessage = async () => {
    const options = {
      method: "POST",
      body: JSON.stringify({
        message: value
      }),
      headers: {
        "Content-Type": "application/json"
      }
    }
    try{
      const response = await fetch('http://localhost:8000/completions', options)
      const data = await response.json()
      setMessage(data.choices[0].message)
    } catch(error) {
      console.log(error)
    }
  }

  useEffect(() => {
    console.log(currentTitle, value, message)
    if(!currentTitle && value && message) {
      setCurrentTitle(value)
    }
    if(currentTitle && value && message) {
      setPreviousChats(prevChats => (
        [...prevChats,
          {
            title: currentTitle,
            role: "user",
            content: value
          },
          {
            title: currentTitle,
            role: message.role,
            content: message.content
          }
        ]
      ))
    }
  }, [message, currentTitle])

  const currentChat = previousChats.filter(previousChat => previousChats.title === currentTitle)
  const uniqueTitles = Array.from(new Set(previousChats.map(previousChat => previousChat.title)))

  return (
    <div className="app">
      <section className="sidebar">
        <button onClick={createNewChat}><ChatIcon fontSize='small'/></button>
        <ul className="history">
          {uniqueTitles?.map((uniqueTitle, index) => <li key={index} onClick={handleClick(uniqueTitle)}>{uniqueTitle}</li>)}
        </ul>
      </section>
      <section className="main">
        {!currentTitle && <h1>BarclaysGPT</h1>}
        <ul className="feed">
          {currentChat.map((chatMessage, index) => <li key={index} 
              style={{backgroundColor: chatMessage.role === 'User' ? 'rgb(0,94,145)' : 'rgb(0,174,239)'}}>
            <p className='role'>{chatMessage.role}</p>
            <p>{chatMessage.content}</p>
          </li>)}
        </ul>
        <div className="bottom-section">
          <div className="input-container">
            <input value={value} onChange={(e) => setValue(e.target.value)}/>
            <div id="attach">
              <AttachFileRoundedIcon/>
            </div>
            <div id="submit" onClick={getMessage}>
              <SendRoundedIcon/>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;