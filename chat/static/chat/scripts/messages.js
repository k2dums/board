

document.addEventListener('DOMContentLoaded',()=>{




const roomName='norbu'
const wsStart='ws://'
const loc=window.location.host
const path=`/ws/chat/${roomName}/`
const endpoint=wsStart+loc+path

const chatSocket = new WebSocket(
    'ws://'
    + window.location.host
    + '/ws/chat/'
    + roomName
    + '/'
);

//When you get the message do this
chatSocket.onmessage=function(e){
        const data=JSON.parse(e.data)
        // display_message(data)
        console.log('I got a Data from server:',data);
        display_message(data)
};
chatSocket.onopen=function(e){
    console.log('websocket is ' + e.type);
}
//When the socket closes do this
chatSocket.onclose=function(e){
        console.error('Chat Socket closed unexpectedly')
};
const chat_input=document.querySelector("#current_chat_input")
chat_input.addEventListener('keypress', (event)=>{

    // event.keyCode or event.which  property will have the code of the pressed key
    let keyCode = event.keyCode ? event.keyCode : event.which;

    // 13 points the enter key
    if(keyCode === 13) {
      // call click function of the buttonn 
      const message=document.querySelector("#current_chat_input").value
      var receiver=document.querySelector('#current_chat_header_receiver').innerHTML
      console.log('username:',username)
      console.log('receiver:',receiver)
      chatSocket.send(JSON.stringify(
          {
              'message':message,
              'receiver':receiver,
              'sender':username,
          }
          ))
        chat_input.value=""
    }
      
  });
});


        
   

//function for displaying the message on the html element
function display_message(data){
    const receiver=document.querySelector('#current_chat_header_receiver').innerHTML
    if (data.sender==username && receiver==data.receiver){
        var div=render_senderMessage(data.message)
    }
    else{
        var div=render_receiverMessage(data.message)
    }
    const chat_container=document.querySelector('#current_chat_message_container').append(div)
}


function render_senderMessage(data){
    const chat_sender=document.createElement('div');
    chat_sender.classList.add('chat_sender','mt-3','row','justify-content-end','mr-1');
    const inner_chat=document.createElement('div');
    inner_chat.classList.add('d-inline-block','bg-success','rounded-pill','border','border-success','p-2');
    const message=document.createElement('span');
    message.innerHTML=data;
    chat_sender.append(inner_chat);
    inner_chat.append(message)
    return chat_sender
}

function render_receiverMessage(data){
    const chat_sender=document.createElement('div');
    chat_sender.classList.add('chat_sender','mt-3','mr-1');
    const inner_chat=document.createElement('div');
    inner_chat.classList.add('d-inline-block',  'bg-info','rounded-pill','border','border-info','p-2');
    const message=document.createElement('span');
    message.innerHTML=data;
    chat_sender.append(inner_chat);
    inner_chat.append(message)
    return chat_sender
}
