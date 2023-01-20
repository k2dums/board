

document.addEventListener('DOMContentLoaded',()=>{

getUsers();

});


        
   

//function for displaying the message on the html element
function display_message(data){
    const receiver=document.querySelector('#chatting_with_user').innerHTML
    if (data.sender==username && receiver==data.receiver){
        var div=render_senderMessage(data.message)
    }
    else{
        var div=render_receiverMessage(data.message)
    }
    const chat_container=document.querySelector('#chat_messages').append(div)
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
    chat_sender.classList.add('chat_receiver','mt-3','mr-1');
    const inner_chat=document.createElement('div');
    inner_chat.classList.add('d-inline-block',  'bg-info','rounded-pill','border','border-info','p-2');
    const message=document.createElement('span');
    message.innerHTML=data;
    chat_sender.append(inner_chat);
    inner_chat.append(message)
    return chat_sender
}

function getUsers(){
    div=document.querySelector('#recent_chat_users');
    fetch(`/chat/api/${username}`,{
        method:'GET',
    })
    .then(response=>response.json())
    .then(messages=>{
        messages.forEach(message=>create_recentChatDiv(message,div));
    });
}


function create_recentChatDiv(message,div){
    document.querySelector('#chatting_with_container').style.display='none';
    document.querySelector('#current_chat_input_container').style.display='none';
    chat_user=document.createElement('div');
    chat_user.classList.add('chat_user','row','mt-3','mb-1','justify-content-center');
    chat_user.addEventListener('click',()=>{chatWithUser(message.username)})
    user_div=document.createElement('div');
    user_div.classList.add('col-5', 'text-center');
    user_div.style.background='lightblue';
    user_div.innerHTML=message.username;
    message_div=document.createElement('div');
    message_div.classList.add('col-5', 'text-center');
    message_div.style.background='white';
    message_div.innerHTML=message.message;
    chat_user.append(user_div);
    chat_user.append(message_div);
    div.append(chat_user);
}

// //Recent Chat Users div
// <div class="chat_user row mt-3 mb-1 justify-content-center" >
//     <div   style="background-color: lightblue;" class="col-5 text-center">{{user}}</div>
//     <div   style='background-color: white;' class="col-5">Message... </div>
// </div> 




function chatWithUser(chatUser){
document.querySelector('#chatting_with_container').style.display='flex';
document.querySelector('#current_chat_input_container').style.display='block';
document.querySelector('#chat_messages').innerHTML=""
document.querySelector('#chatting_with_user').innerHTML=chatUser
const roomName='norbu'
// const wsStart='ws://'
// const loc=window.location.host
// const path=`/ws/chat/${roomName}/`
// const endpoint=wsStart+loc+path

const chatSocket = new WebSocket(
    'ws://'
    + window.location.host
    + '/ws/chat/'
    + roomName
    + '/'
);


fetch(`/chat/api/${username}/${chatUser}`)
.then(response=>response.json())
.then(messages=>{
    messages.forEach(message=>{
        display_message(message);
    })
})




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
}




// <div class="chat_sender mt-3 mb-1 row justify-content-end mr-1 ">
//     <div class='d-inline-block  bg-success rounded-pill border border-success  p-2 '>
//        <span class='message '>{this.props.text}</span>
//     </div>
//  </div>

//     <div class="chat_receiver mt-3 mb-1">
//         <div class='d-inline-block  bg-info rounded-pill border border-info  p-2'>
//            <span class='message'>{this.props.text1}</span>
//        </div>
//     </div>  