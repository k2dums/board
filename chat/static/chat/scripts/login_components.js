class Login extends React.Component{
    render(){
        return(
            <div class="container col-xl-3 col-lg-4 col-md-5 col-sm-5">
            <div class="row justify-content-center">
                <h1>Login</h1>
            </div>
            <div class="mb-3">
              <input type="text" class="form-control" id="login_username" name='username' aria-describedby="emailHelp" placeholder="Username"/>
            </div>
            <div class="mb-3">
              <input type="password" class="form-control" id="login_password" name='password' placeholder="Password"/>
            </div>
            <div class="row justify-content-center">
            <button type="submit" class="btn btn-primary">Login</button>
            </div>
            </div>
       
        
        )
    }
}

ReactDOM.render(<Login/>,document.getElementById('root'))