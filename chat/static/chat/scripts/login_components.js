class Login extends React.Component{
    render(){
        return(
            <div class="container col-xl-3 col-lg-4 col-md-5 col-sm-5">
            <div class="row justify-content-center">
                <h1>Login</h1>
            </div>
            <form>
            <div class="mb-3">
              <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Email Address"/>
            </div>
            <div class="mb-3">
              <input type="password" class="form-control" id="exampleInputPassword1" placeholder="Password"/>
            </div>
            <div class="row justify-content-center">
            <button type="submit" class="btn btn-primary">Login</button>
            </div>
       
          </form>
            </div>
       
        
        )
    }
}

ReactDOM.render(<Login/>,document.getElementById('root'))