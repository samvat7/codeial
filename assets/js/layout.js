function toggleChatWindow() {
    const chatWindow = document.querySelector('.chat-window');
    const chatBody = document.querySelector('.chat-body');
    
    if (chatBody.classList.contains('minimized')) {
        chatBody.classList.remove('minimized');
        chatWindow.style.height = "40vh"; // Maximized height
        chatWindow.style.bottom = "20px";
    } else {
        chatBody.classList.add('minimized');
        chatWindow.style.height = "0vh"; // Minimized height
        chatWindow.style.bottom = "80px";
    }
}