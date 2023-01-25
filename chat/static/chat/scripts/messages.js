
const wsUrl= 'ws://'+ window.location.host+ '/ws/chat/'+ user_id+ '/'
let chatSocket=null;
// let flag=false;

const openSocket=(wsUrl,waitTimer,waitSeed,multiplier)=>{
    chatSocket=new WebSocket(wsUrl);
    console.log(`trying to connect to :${chatSocket.url}`);

    chatSocket.onopen=()=>{
        console.log(`connection open to:${chatSocket.url}`);
        waitTimer=waitSeed;
        flag=false;
        onEnterKey(chatSocket)

        
    chatSocket.onmessage=(e)=>{
        const data=JSON.parse(e.data)
        console.log('[RECEIVING]',data);
        display_chat_messages(data);
    }
    
    chatSocket.onclose=()=>{
        console.log(`connection closed to: ${chatSocket.url}`);
        // if (!flag){
            openSocket(wsUrl,waitTimer,waitSeed,multiplier)
            // flag=true;
        // }
        }
   
    };
   
        chatSocket.onerror=()=>{
            if(waitTimer<60000){
                waitTimer=waitTimer*multiplier;
            }
            console.log(`error opening connection ${chatSocket.url}, next attempt in: ${waitTimer/1000} seconds`);
            setTimeout(()=>{openSocket(wsUrl,waitTimer,waitSeed,multiplier)},waitTimer)
         }
 
}
    


document.addEventListener('DOMContentLoaded',()=>{
getUsers();
openSocket(wsUrl, 1000, 1000, 2)
});


        
function onEnterKey(chatSocket){
    if(chatSocket.readyState===WebSocket.OPEN){
        const chat_input=document.querySelector("#current_chat_input");
        chat_input.addEventListener('keypress', (event)=>{
        // event.keyCode or event.which  property will have the code of the pressed key
        let keyCode = event.keyCode ? event.keyCode : event.which;
        // 13 points the enter key
        if(keyCode === 13) {
          // call click function of the buttonn 
          let message=document.querySelector("#current_chat_input").value;
          let receiver=document.querySelector('#chatting_with_user').innerHTML;
          let receiver_id=document.querySelector('#chatting_with_user').dataset.user_id;
          data= {
            'message':message,
            'receiver':receiver,
            'sender':username,
            'receiver_id':receiver_id,
            'sender_id':user_id,
        };   
            // try{ 
                if (chatSocket.readyState===WebSocket.OPEN){
                    console.log('[SENDING]',message,chatSocket); 
                    chatSocket.send(JSON.stringify(data));
                    chat_input.value="";
                }
                // else{//When reconnecting it seems there are two instances of websocket running causing problem
                //     chatSocket.close();
                // }  
            // }
            // catch(err){
            //     console.log(err);
            // }
        
        }
        });

    }
}

//function for displaying the message on the html element
function display_activeWindowMessage(data){
    const receiver=document.querySelector('#chatting_with_user').innerHTML
    if (data.sender==username && receiver==data.receiver){
        var div=render_senderMessage(data.message);
        document.querySelector('#chat_messages').append(div)
    }
    else if (data.sender==receiver && username==data.receiver){
        var div=render_receiverMessage(data.message);
        document.querySelector('#chat_messages').append(div);
    }
    
}


function render_senderMessage(data){
    const chat_sender=document.createElement('div');
    chat_sender.classList.add('chat_sender','mt-3','row','justify-content-end','mr-1');
    const inner_chat=document.createElement('div');
    inner_chat.classList.add('d-inline-block','p-2','inner_chat');
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
    inner_chat.classList.add('d-inline-block','p-2','inner_chat');
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
        messages.forEach(message=>create_appendRecentChatUser(message,div));
    });
}

function create_appendRecentChatUser(message,div){
    node=create_recentChatUser(message);
    div.append(node);
}


function create_recentChatUser(message){
    document.querySelector('#chatting_with_container').style.display='none';
    document.querySelector('#current_chat_input_container').style.display='none';

    let chat_user=document.createElement('div');
    chat_user.classList.add('chat_user','row','mt-3','mb-1','align-items-center');
    chat_user.addEventListener('click',()=>{chatWithUser(message.username,message.user_id)})
    chat_user.dataset.user_id=message.user_id
    chat_user.dataset.username=message.username

    //Col 1 will have only image
    let img_container=document.createElement('div');
    img_container.classList.add('col-4','img_container');
    let img_div=document.createElement('div');
    img_div.classList.add('img_div','d-flex','justify-content-center',);
    let img_pic=document.createElement('img');
    img_div.append(img_pic);
    img_container.append(img_div)
    //----------------------------

    //col 2 user and last message

    
    let user_message_container=document.createElement('div');
    user_message_container.classList.add('col-7','user_message_container');

    let user_div=document.createElement('div');
    user_div.classList.add('user_div')
    user_div.innerHTML=message.username
    let message_div=document.createElement('div');
    message_div.classList.add('message_div')
    message_div.innerHTML=message.message

    user_message_container.append(user_div);
    user_message_container.append(message_div);
    //--------------------------------------
    chat_user.append(img_container);
    chat_user.append(user_message_container);
    return chat_user;
}


function chatWithUser(chatUser,id){
document.querySelector('#chatting_with_container').style.display='flex';
document.querySelector('#current_chat_input_container').style.display='block';
document.querySelector('#chat_messages').innerHTML=""

let chatting_with_user=document.querySelector('#chatting_with_user')
chatting_with_user.innerHTML=chatUser
chatting_with_user.dataset.user_id=id
chatting_with_user.dataset.username=chatUser


fetch(`/chat/api/${username}/${chatUser}`)
.then(response=>response.json())
.then(messages=>{
    messages.forEach(message=>{
        display_activeWindowMessage(message);
    })
})
}


function display_chat_messages(message){
    let parentNode=document.querySelector("#recent_chat_users");
    let target=null;
    let firstChildElement=parentNode.firstElementChild;
    let newnode=null;
    //This block is for making changes in the recent chat users
    {
        if(user_id==message.receiver_id){
            target=document.querySelector(`[data-user_id='${message.sender_id}']`);
        }
       else if (user_id==message.sender_id){
            target=document.querySelector(`[data-user_id='${message.receiver_id}']`);
       }
        //if the node with the user_id is not present(not created) create the node
        if(!target){
            newnode=create_recentChatUser(message);
            console.log('just created',newnode);
            if (!firstChildElement){
                //if no firstChildElement
                parentNode.append(newnode);
            }
            else{
                console.log('newnode',newnode);
                parentNode.insertBefore(newnode,firstChildElement);
            }
        } 
        else{//if target user_id is present then 
            target.querySelector('.message_div').innerHTML=message.message //first change the text to latest text
            if (!firstChildElement){//if no first child append
                parentNode.append(target)
            }
            else{//if first child is present
                if(target != firstChildElement){//if it is not the  first child change the position to the firstChild
                    parentNode.insertBefore(target,firstChildElement);
                 }
            } 
        }
    }

    //checking to the active user and making changes to active window
    {
        
        let chatting_user_id=null
        if(user_id==message.receiver_id){
            chatting_user_id=message.sender_id;
        }
       else if (user_id==message.sender_id){
            chatting_user_id=message.receiver_id;
       }
       chatting_with=document.querySelector('#chatting_with_user').dataset.user_id
       if (chatting_with==chatting_user_id){
        display_activeWindowMessage(message);
       }
       
    }
    
}

