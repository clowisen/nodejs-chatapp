const socket = io();

const nickname = localStorage.getItem('nickname');
const room = localStorage.getItem('room');

socket.emit('join-room', ({nickname, room}));

socket.on('join-message', (room, message, joinTime) =>{
    if(room === null ){
        location.assign('/');
    }
    else{
        const chatTab = document.querySelector('.chat-tab');
        const roomName = document.querySelector('.room-name');
        roomName.textContent = room;
        const addMessage = document.createElement('div');
        addMessage.textContent = message;
        addMessage.style.marginLeft = '5px';
        addMessage.style.marginTop = '10px';
        addMessage.style.marginBottom = '3px';
        addMessage.style.width = '98%';
        addMessage.style.color = 'whitesmoke';
        addMessage.style.wordBreak = 'break-word';
        addMessage.style.backgroundColor = '#ff4040';
        addMessage.style.borderRadius = '5px';
        addMessage.style.padding = '10px';
        const time = document.createElement('p');
        time.textContent = joinTime;
        time.style.float = 'right';
        time.style.color = '#a52a2a';
        chatTab.appendChild(addMessage);
        addMessage.appendChild(time);
    }
})

socket.on('user-exists', ()=>{
    location.assign('/');
    alert('User already exists!');
})

socket.on('left-message', (message, leftTime) =>{
    localStorage.removeItem('nickname');
    localStorage.removeItem('room');
    const chatTab = document.querySelector('.chat-tab');
    const roomName = document.querySelector('.room-name');
    roomName.textContent = room;
    const addMessage = document.createElement('div');
    addMessage.textContent = message;
    addMessage.style.marginLeft = '5px';
    addMessage.style.marginTop = '10px';
    addMessage.style.marginBottom = '3px';
    addMessage.style.width = '98%';
    addMessage.style.color = 'whitesmoke';
    addMessage.style.wordBreak = 'break-word';
    addMessage.style.backgroundColor = '#ff4040';
    addMessage.style.borderRadius = '5px';
    addMessage.style.padding = '10px';
    const time = document.createElement('p');
    time.textContent = leftTime;
    time.style.float = 'right';
    time.style.color = '#a52a2a';
    chatTab.appendChild(addMessage);
    addMessage.appendChild(time);
})

const message = document.querySelector('.message');
const sendButton = document.querySelector('.send-button');

sendButton.addEventListener('click', chatMessage);
message.addEventListener('keypress', function(e){
    if(e.key === 'Enter'){
        chatMessage(e);
    }
})

function chatMessage(e){
    if(message.value != ''){
        e.preventDefault();
        socket.emit('chat-message', localStorage.getItem('nickname'), message.value);
        message.value = '';
    } 
}

socket.on('send-message', (nickname, message, sendTime) =>{
    const chatTab = document.querySelector('.chat-tab');
    const addMessage = document.createElement('div');
    addMessage.textContent = `${nickname}: ${message}`;
    addMessage.style.marginLeft = '5px';
    addMessage.style.marginTop = '10px';
    addMessage.style.marginBottom = '3px';
    addMessage.style.width = '98%';
    addMessage.style.color = 'whitesmoke';
    addMessage.style.wordBreak = 'break-word';
    addMessage.style.backgroundColor = '#ff4040';
    addMessage.style.borderRadius = '5px';
    addMessage.style.padding = '10px';
    const time = document.createElement('p');
    time.textContent = sendTime;
    time.style.float = 'right';
    time.style.color = '#a52a2a';
    chatTab.appendChild(addMessage);
    addMessage.appendChild(time);
    chatTab.scrollTop = chatTab.scrollHeight;
})

const exitButton = document.querySelector('.exit-button');

exitButton.addEventListener('click', ()=>{
    localStorage.removeItem('nickname');
    localStorage.removeItem('room');
    location.assign('/');
})
