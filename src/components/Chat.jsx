import React, {useEffect, useState} from 'react';
import socketIOClient from 'socket.io-client';
import './chat.css';

function Chat() {
    const [chat, setChat] = useState([]);
    const [typing, setTyping] = useState("");
    const [formValues, setFormValues] = useState({
        handle: '',
        message: ''
    });
    const [url] = useState('http://192.168.1.16:5000');
    const socket = socketIOClient(url);
    useEffect(() => {
        socket.on('chat', data => addData(data));
    }, []);

    useEffect(()=> {
        socket.on('typing', data => isTyping(data));
    }, []);

    useEffect(()=> {
        if (formValues.message.length === 0) {
            setTyping('');
        }
    }, [formValues.message]);


    function addData(data) {
        setChat(item => {
            return [...item, data];
        })
    }

    function isTyping(data) {
        setTyping(()=>`${data} is typing a message...`);
    }

    function handleChange({target: {id, value}}) {
        setFormValues({...formValues, [id]: value});
    }

    function handleSubmit(e) {
        e.preventDefault();
        setTyping('');
        socket.emit('chat', formValues);
        setFormValues({...formValues, message: ''});
    }

    function handleTyping() {
        socket.emit('typing', formValues.handle);
    }

    return (
        <div id='mario-chat'>
            <div id='chat-window'>
                {chat.map((item, id) => (
                    <p key={id}><strong>{`${item.handle}: `}</strong>{`${item.message}`}</p>
                ))}
                {typing && <p><em>{`${typing}`}</em></p>}
            </div>
            <form onSubmit={handleSubmit}>
                <input id='handle' type='text' placeholder='handle' value={formValues.handle} onChange={handleChange} />
                <input id='message' type='text' placeholder='message' value={formValues.message}
                       onChange={handleChange} onKeyPress={handleTyping}/>
                <button type='submit'>Send</button>
            </form>
        </div>
    )
}

export default Chat;
