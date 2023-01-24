
class Chatbox_Left extends React.Component{
    render(){
        return(
                <div id="chatbox_left"  >
                        <div id='cb_left_header' style={{color: "black",top:'0',backgroundColor:'red',zIndex:'1'}} class="row justify-content-center position-sticky">
                            <div id='cb_left_title'></div><h1>{this.props.username}</h1>
                            
                        </div>
                        <div class="chats p-4">
                            <div class="row mb-3">
                                <div   style={{backgroundColor: "lightblue"}} class="col-5">Username</div>
                                <div   style={{backgroundColor: "white"}} class="col">Message is this </div>
                            </div>
                            <div class="row mb-3">
                                <div  style={{backgroundColor: "lightblue"}} class="col-5">Username</div>
                                <div  style={{backgroundColor: "white"}} class="col">Message is this </div>
                            </div>
                            <div class="row mb-3">
                                <div style={{backgroundColor: "lightblue"}}  class="col-5">Username</div>
                                <div style={{backgroundColor: "white"}} class="col">Message is this </div>
                            </div>
                            <div class="row mb-3">
                                <div style={{backgroundColor: "lightblue"}}  class="col-5">Username</div>
                                <div style={{backgroundColor: "white"}} class="col">Message is this </div>
                            </div>
                        </div>
                </div>
                )
    } 
}

class Chatbox_Right extends React.Component{

    render(){
        return (
            <div >
                <div id='chatbox_right' class="border-bottom border-dark" >
                <div id="cb_right_header" class="p-3 position-sticky" style={{top:'0',backgroundColor:'lightgrey',}}>
                    <div class="row ">
                        <div class="col-3 " id='current_chat_header_dp'><img style={{height:'90px',width:'100px',backgroundColor:'white'}}></img></div>
                        <div class="col " id='current_chat_header_title'><h4 >Current Chat</h4></div>
                    </div>
                </div>
            <div id='current_chat_message_container' class=' pl-3 pr-3 '   >
                <ChatMessageSender text='1 Hi how are you doing'/>
                <ChatMessageReciever text=' 2 I am doing well'/>
                <ChatMessageSender text='3 Hi how are you doing'/>
                <ChatMessageReciever text='4  I am doing well'/>
                <ChatMessageSender text='5 Hi how are you doing'/>
                <ChatMessageSender text='6 I am doing well'/>
                <ChatMessageReciever text='7 Hi how are you doing'/>
                <ChatMessageSender text='8  I am doing well'/>
                <ChatMessageSender text='9 Hi how are you doing'/>
                <ChatMessageReciever text='10 Hi how are you doing'/>
                <ChatMessageSender text='11 I am doing well'/>
                <ChatMessageReciever text='12 Hi how are you doing'/>
                <ChatMessageSender text='15 I am doing well'/>
                <ChatMessageReciever text='14 Hi how are you doing'/>
                <ChatMessageSender text='15 I am doing well'/>
            </div>
            <footer id='current_chat_input_container' class="p-4 position-sticky mt-3" style={{backgroundColor:'lightgrey',bottom:'0'}}>
                <input id='current_chat_input' type="text" class='rounded' placeholder="Enter....." style={{height:'50px',width:'100%'}}></input>
            </footer>
              
            </div>
            </div>
          
        )
    }
}


class ChatMessageSender extends React.Component{
    render(){
        return(        
        <div class="chat_sender mt-3 row justify-content-end mr-1 ">
            <div class='d-inline-block  bg-success rounded-pill border border-success  p-2 '>
               <span class='message '>{this.props.text}</span>
           </div>
        </div>

            )
    }
}


class ChatMessageReciever extends React.Component{
    render(){
        return(
            <div class="chat_receiver mt-3 ">
                 <div class='d-inline-block  bg-info rounded-pill border border-info  p-2'>
                    <span class='message'>{this.props.text}</span>
                </div>
            </div> 
        )
    }
}





ReactDOM.render(<Chatbox_Left username={username} />,document.querySelector("#chat_left_container"))
ReactDOM.render(<Chatbox_Right/>,document.querySelector("#chat_right_container"))
