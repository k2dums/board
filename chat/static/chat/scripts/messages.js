let enterKeyPress=false;
let pageCounter=1
const wsUrl= 'ws://'+ window.location.host+ '/ws/chat/'+ user_id+ '/';
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
        display_chat_Onmessages(data);
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
          // call click function of the button
          enterKeyPress=true;
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

function render_senderMessage(data){
    if ( (data.sender!=username ) && !data.read )
    {
        fetch(`/chat/api/message/${data.id}/`,{
            method:'PUT',
            body:JSON.stringify({
                read:true
            })
        })
    }

 
    const chat_sender=document.createElement('div');
    chat_sender.classList.add('message_container','sender','mt-3','row','justify-content-end','mr-1');
    const message_div=document.createElement('div');
    message_div.classList.add('message','d-inline-block','p-2');
    message_div.dataset.message_id=data.id;
    const message=document.createElement('span');
    message.innerHTML=data.message;
    chat_sender.append(message_div);
    message_div.append(message)
    return chat_sender
}

function render_receiverMessage(data){
    if ( (data.sender!=username ) && !data.read )
    {
        fetch(`/chat/api/message/${data.id}/`,{
            method:'PUT',
            body:JSON.stringify({
                read:true
            })
        })
    }

    const chat_receiver=document.createElement('div');
    chat_receiver.classList.add('message_container','receiver','mt-3','mr-1');
    const message_div=document.createElement('div');
    message_div.dataset.message_id=data.id;
    message_div.classList.add('message','d-inline-block','p-2');
    const message=document.createElement('span');
    message.innerHTML=data.message;
    chat_receiver.append(message_div);
    message_div.append(message)
    return chat_receiver
}



function getUsers(){
    div=document.querySelector('#recent_chat_users');
    fetch(`/chat/api/${username}`,{
        method:'GET',
    })
    .then(response=>response.json())
    .then(messages=>{
        console.log('[Received GetUser]',messages)
        messages.forEach(message=>create_appendRecentChatUser(message,div));
    });
}

function create_appendRecentChatUser(message,div){
    node=create_recentChatUser(message);
    div.append(node);
}


//Creates the recent chat users on the left chatbox
function create_recentChatUser(message){
    document.querySelector('#chatting_with_container').style.display='none';
    document.querySelector('#current_chat_input_container').style.display='none';

    let chat_user=document.createElement('div');
    chat_user.classList.add('chat_user','row','mt-3','mb-1','align-items-center');
    chat_user.addEventListener('click',()=>{chatWithUser(chat_user,message.username,message.user_id)})
    chat_user.dataset.user_id=message.user_id
    chat_user.dataset.username=message.username
  

    //Col 1 will have only image
    let img_container=document.createElement('div');
    img_container.classList.add('col-3','img_container','pr-0','d-inline-block','mr-2');
    let img_div=document.createElement('div');
    img_div.classList.add('img_div','d-inline-block');
    let img_pic=document.createElement('img');
    img_div.append(img_pic);
    img_container.append(img_div)
    //----------------------------

    //col 2 user and last message
    let user_message_unread_container=document.createElement('div');
    user_message_unread_container.classList.add('col-8','user_message_unread_container');
    let user_message_unread_wrapper=document.createElement('div');
    user_message_unread_wrapper.classList.add('user_message_unread_wrapper','row');


    let user_message_container=document.createElement('div');
    user_message_container.classList.add('col','user_message_container','pr-1','pl-1');

    let user_div=document.createElement('div');
    user_div.classList.add('user_div')
    user_div.innerHTML=message.username
    let message_div=document.createElement('div');
    message_div.classList.add('message_div',)
    message_div.innerHTML=message.message



    let status_container=document.createElement('div');
    status_container.classList.add('status_container','col-4','pl-0','pr-0','text-center');
    let status_wrapper=document.createElement('div',);
    status_wrapper.classList.add('status_wrapper','d-flex','col','flex-column','align-items-center','justify-content-end')
    let time_count=document.createElement('div');
    time_count.classList.add('time_count','pt-1');
    let unread_count=document.createElement('div',);
    unread_count.classList.add('unread_count','unread','rounded-circle','d-none');
    let mute_icon=document.createElement('div');
    mute_icon.classList.add('mute_icon');
    // mute_icon.innerHTML='muted';
    status_container.append(time_count);
    status_container.append(status_wrapper);
    status_wrapper.append(mute_icon);
    status_wrapper.append(unread_count);
    unread_count.dis
    

    date=getTime(message.time)
    // unread_count.innerHTML=1000;
    time_count.innerHTML=date;

    user_message_container.append(user_div);
    user_message_container.append(message_div);


    user_message_unread_wrapper.append(user_message_container);
    user_message_unread_wrapper.append(status_container);
    user_message_unread_container.append(user_message_unread_wrapper);
    //--------------------------------------
   
  
    chat_user.append(img_container);
    chat_user.append(user_message_unread_container);

    if(message.unread!=null){
        chat_user.querySelector('.unread_count').classList.remove('d-none');
        chat_user.querySelector('.unread_count').innerHTML=message.unread.count;
        chat_user.dataset.first_unread=message.unread.first_unreadId;
        chat_user.dataset.unread_count=message.unread.count;
    }

    return chat_user;
}



//This is the right chatbox where the current user chats with another user
function chatWithUser(chat_userDiv,chatUser,id){
pageCounter=1;
let unread_count=null;
if ('unread_count' in chat_userDiv.dataset){
    unread_count=chat_userDiv.dataset.unread_count;
}

chat_userDiv.querySelector('.unread_count').classList.add('d-none');
document.querySelector('#chatting_with_container').style.display='flex';
document.querySelector('#current_chat_input_container').style.display='block';
const chat_messages_div=document.querySelector('#chat_messages');
chat_messages_div.innerHTML="";

let chatting_with_user=document.querySelector('#chatting_with_user')
chatting_with_user.innerHTML=chatUser
chatting_with_user.dataset.user_id=id
chatting_with_user.dataset.username=chatUser
//Pagination returns 15 objects per page
let end=null;
let start=pageCounter
if(unread_count>15){
    end=Math.ceil(unread_count/15);
    fetch(`/chat/api/${username}/${chatUser}?start=${start}&end=${end}`)
    .then(response=>response.json())
    .then(messages=>{
        console.log('ChatWithUser',messages);
        messages.forEach(message=>{
            display_activeWindowMessage(message);});
        })
    .then(()=>{
        if (('first_unread' in chat_userDiv.dataset)){
            first_unread=chat_userDiv.dataset.first_unread;
            const target=chat_messages_div.querySelector(`[data-message_id='${first_unread}']`);
            highlightFirstUnread(target);
            target.scrollIntoView({block:'center',behavior:'smooth'});
            delete chat_userDiv.dataset.first_unread;
     }
    });  
    pageCounter+=end;
}

else{//if unread is less than the paganition split number
    fetch(`/chat/api/${username}/${chatUser}?start=${start}`)
    .then(response=>response.json())
    .then(messages=>{
        console.log('ChatWithUser',messages);
        messages.forEach(message=>{
            display_activeWindowMessage(message);
        });
    })
    .then(()=>{
        if (('first_unread' in chat_userDiv.dataset)){
            first_unread=chat_userDiv.dataset.first_unread;
            const target=chat_messages_div.querySelector(`[data-message_id='${first_unread}']`);
            highlightFirstUnread(target);
            target.scrollIntoView({block:'center',behavior:'smooth'});
            delete chat_userDiv.dataset.first_unread;
        }
        else{
            lastChatMessage=chat_messages_div.lastElementChild;
            if (lastChatMessage){
                lastChatMessage.scrollIntoView({block:'start',behavior:'smooth'});
            }
        }
    }); 
}
pageCounter++;

}


//function for displaying the message on the html element
function display_activeWindowMessage(data,){
    const receiver_div=document.querySelector('#chatting_with_user')
    const receiver=receiver_div.innerHTML
    const chat_messages_div=document.querySelector('#chat_messages');
    if (data.sender==username && receiver==data.receiver){
        var div=render_senderMessage(data);
        chat_messages_div.append(div);
        // div.scrollIntoView({block: "start",behavior: "smooth"});//works for when you enter text also, also when last message was your message
        if(enterKeyPress){
            div.scrollIntoView({block: "start",behavior: "smooth"});
            enterKeyPress=false;
        }
    }
    else if (data.sender==receiver && username==data.receiver){
        var div=render_receiverMessage(data);
        chat_messages_div.append(div);
    }
    
}



//makes the changes to the chats when onmessage form websocket
function display_chat_Onmessages(message){
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
                if (message.unread!==null){
                    if (message.unread.count>0){
                        target.dataset.first_unread=message.unread.first_unreadId
                    }
                }

            }
        } 
        else{//if target user_id is present then 
            target.querySelector('.message_div').innerHTML=message.message //first change the text to latest text
            target.querySelector('.time_count').innerHTML=getTime(message.time);
            if(message.unread!=null){
                if(target.dataset.user_id!=document.querySelector('#chatting_with_user').dataset.user_id){
                    target.querySelector('.unread_count').classList.remove('d-none');
                    target.querySelector('.unread_count').innerHTML=message.unread.count;
                    target.dataset.unread_count=message.unread.count;
                    target.dataset.first_unread=message.unread.first_unreadId;
                }
            }
            // if (message.unread!==null){
            //     if (message.unread.count>0){
            //         target.dataset.first_unread=message.unread.first_unreadId;
            //     }
            // }
          
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

function loadMoreMesssagesActiveWindow(){
fetch(`/chat/api/${username}/${chatUser}?start=${pageCounter}`)
.then(response=>response.json())
.then(messages=>{
    messages.forEach(message=>{
        display_activeWindowMessage(message);
    });
})
pageCounter++;
}

function highlightFirstUnread(element){
    const parent=element.parentElement;
    const startcolor=[181,181,181];
    const endcolor=[104,103,103];
    // const endcolor=[61, 59, 59];
    const steps=10;
    const red_change = (startcolor[0] - endcolor[0]) / steps;
    const green_change = (startcolor[1] - endcolor[1]) / steps;
    const blue_change = (startcolor[2] - endcolor[2]) / steps;
    let stepcount=0;
    let currentcolor=startcolor
    var timer=setInterval(()=>{
        currentcolor[0]=parseInt(currentcolor[0]-red_change);
        currentcolor[1]=parseInt(currentcolor[1]-green_change);
        currentcolor[2]=parseInt(currentcolor[2]-blue_change);
        element.style.backgroundColor='rgb('+ currentcolor.toString()+')';
        parent.style.backgroundColor='rgb('+ currentcolor.toString()+')';
        stepcount+=1;
        if (stepcount>=steps){
            // element.style.backgroundColor='rgb('+ endcolor.toString()+')';
            element.style.backgroundColor='rgb(61,59,59)';
            parent.style.backgroundColor='rgb(104, 103, 103)';
            clearInterval(timer);
        }
    },200);
}

function getTime(date){
    let temp=new Date(date);
    let hour=temp.getHours();
    let min=temp.getMinutes();
    min=min.toString().padStart(2,'0');
    let ps='am';
    if (hour==0){
        hour=12;
    }
    if (hour>12){
        hour=hour-12;
        ps='pm';
    }
    return `${hour}:${min} ${ps}`;
}

