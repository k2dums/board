class Register extends React.Component {
  render() {
    return (
      <div class="container col-xl-6 col-lg-9 ">
        <form>
            <div class="row justify-content-center"><h1>Register</h1></div>
          {/* <div class="row">
            <div class="col">
              <input type="text" class="form-control" placeholder="First name" aria-label="First name"/>
            </div>
            <div class="col">
              <input type="text" class="form-control" placeholder="Last name" aria-label="Last name"/>
            </div>
          </div> */}
          <div class="row">
            <div class="col">
            <input type='text' class='form-control' placeholder="Username"></input>
            </div>
          </div>
          <div class="row">
            <div class="col">
            <input type='email' class='form-control' placeholder="Email"></input>
            </div>
          </div>
          <div class="row">
            <div class="col">
            <input type='password' class='form-control' placeholder="Password"></input>
            </div>
          </div>
          <div class="row">
            <div class="col">
            <input type='password' class='form-control' placeholder="Confirm Password"></input>
            </div>
          </div>
          
          
          
          <div class="row justify-content-center">
            <button type="submit" class="btn btn-primary ">Register</button>
          </div>
          
        </form>
      </div>
    );
  }

}

ReactDOM.render(<Register/>,document.querySelector("#root"))
