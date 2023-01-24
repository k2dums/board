
// This loads all the users the user has recently chatted with on the left component and all the online user in the right component
function load_chatbox_index(){
    fetch(`/chat/${user}/`)
    .then(response=>response.json)
    .then(chat_users=>{
        chat_users.forEach(chat_user=>{})
    });
}

// Loads the chat messages with the selected user in focus
function load_chatbox_with(){
 
}

