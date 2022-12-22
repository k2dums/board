class Chatbox_Left extends React.Component{
    render(){
        return(
                <div class="chatbox_left" >
                    <div style={{backgroundColor: "lightgrey",height:'100vh' }} class="container col-4 p-4">
                        <div style={{color: "black"}} class="row justify-content-center"><h1>Chatbox</h1></div>
                        <div class="chats">
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
                </div>
            
              )
    }
}

class Chatbox_Right extends React.Component{
    render(){
        return (
            <div class="chatbox_right">
                <div class="container col-5 pb-2" style={{backgroundColor: "lightgrey"}}>
                    <div class="current_chat_header  row justify-content-center border-bottom border-dark position-fixed pt-2 pr-3 pb-3 align-items-center" style={{width:'41.68%',backgroundColor:'lightgrey'}}>
                        <div class="col-3"><img style={{height:'90px',width:'100px',backgroundColor:'white'}}></img></div>
                        <div class="col"><h4 stlye={{width:'100%'}}>Current Chat</h4></div>
                    </div>
                    <div class='current_chat_message_container' style={{paddingTop:'130px'}} >
                        <div class="current_chat_message border border-primary p-2 bg-info rounded-pill" > 1 Hi how are you doing</div>
                        <div class="current_chat_message border border-success mt-3 p-2 bg-success rounded-pill"> 2 I am doing well</div>
                        <div class="current_chat_message border border-primary mt-3 p-2 bg-info rounded-pill">Hope you are doing well too.</div>
                        <div class="current_chat_message border border-success mt-3 p-2 bg-success rounded-pill">How is the weather there</div>
                        <div class="current_chat_message border border-primary mt-3 p-2 bg-info rounded-pill">Hi how are you doing</div>
                        <div class="current_chat_message border border-success mt-3 p-2 bg-success rounded-pill">I am doing well</div>
                        <div class="current_chat_message border border-primary mt-3 p-2 bg-info rounded-pill">Hope you are doing well too.</div>
                        <div class="current_chat_message border border-success mt-3 p-2 bg-success rounded-pill">How is the weather there</div>
                        <div class="current_chat_message border border-primary mt-3 p-2 bg-info rounded-pill">Hi how are you doing</div>
                        <div class="current_chat_message border border-success mt-3 p-2 bg-success rounded-pill">I am doing well</div>
                        <div class="current_chat_message border border-primary mt-3 p-2 bg-info rounded-pill">Hope you are doing well too.</div>
                        <div class="current_chat_message border border-success mt-3 p-2 bg-success rounded-pill">How is the weather there</div>
                        <div class="current_chat_message border border-primary mt-3 p-2 bg-info rounded-pill">Hi how are you doing</div>
                        <div class="current_chat_message border border-success mt-3 p-2 bg-success rounded-pill">I am doing well</div>
                        <div class="current_chat_message border border-primary mt-3 p-2 bg-info rounded-pill">Hope you are doing well too.</div>
                        <div class="current_chat_message border border-success mt-3 p-2 bg-success rounded-pill">How is the weather there</div>
                    </div>
                    <div class="current_chat_input mt-3 container">
                        <div class='row'>
                            <input type='text' class='rounded' placeholder="Enter....." style={{height:'50px',width:'100%'}}></input>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

ReactDOM.render(<Chatbox_Right/>,document.querySelector("#app"))