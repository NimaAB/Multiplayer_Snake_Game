let socket = io();

socket.on('connect', () => {
    console.log("I'm connected as ", socket.id);
});