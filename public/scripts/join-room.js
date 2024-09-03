const socket = io();

const form = document.querySelector('.form');
const room = document.querySelector('.room');

socket.on('message', (bot, message) =>{
    console.log(bot, message);
})

form.addEventListener('submit', function(e){
    const nickname = form.nickname.value;
    const roomName = room.options[room.selectedIndex].text;
    e.preventDefault();
    localStorage.setItem('nickname', nickname);
    localStorage.setItem('room', roomName);
    location.assign('/chat');
})

