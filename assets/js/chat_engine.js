class ChatEngine {

    constructor(chatBoxId, userEmail) {
        this.chatBox = $(`#${chatBoxId}`);
        this.userEmail = userEmail;
        this.socket = io.connect('http://localhost:3001'); //TODO: 

        if (this.userEmail) {
            this.connectionHandler();
        }
    }

    connectionHandler() {
        let self = this;

        this.socket.on('connect', function() {
            console.log('Connection established using socket...');

            self.socket.emit('join_room', {
                user_email: self.userEmail,
                chatroom: 'codeial'
            });

            self.socket.on('user_joined', function(data) {
                console.log('a user has joined: ', data);
            });
        });

        // Adding click event listener for sending message
        $('#send-message').click(function() {
            let msg = $('#chat-message-input').val();

            if (msg != '') {
                self.socket.emit('send_message', {
                    message: msg,
                    user_email: self.userEmail,
                    chatroom: 'codeial'
                });
            }
        });

        self.socket.on('receive_message', function (data) {
            
            console.log('message received: ', data.message);

            let newMessage = $('<div class="message">');

            let messageType = 'friend-message';

            let messageParentType = 'temp2'

            if(data.user_email == self.userEmail){

                messageType = 'user-message';

                messageParentType = 'temp1';
            }

            newMessage.append($('<span>', {

                'html': data.message
            }));

            newMessage.append($('<sub>', {

                'html': data.user_email
            }));

            newMessage.addClass(messageType);

            newMessage.addClass(messageParentType);

            $('.chat-messages').append(newMessage);
        })
    }
}
