import { useState } from "react";

const Login = () => {

    const [email, setEmail] = useState({ value: null, error: null });
    const [password, setPassword] = useState({ value: null, error: null });

    const onFinish = () => {
        console.log(email, password);
    }

    const validateForm = (e) => {
        e.preventDefault();
        let valid = true;
        if (email.value === '' || email.value === null) {
            setEmail({
                ...email,
                error: "Please Enter Email"
            });
            valid = false;
        }
        if (password.value === '' || password.value === null) {
            setPassword({
                ...password,
                error: "Please Enter Password"
            });
            valid = false;
        }

        if(valid) {
            onFinish();
        }
    }
    return (
        <div className="container">
            <div className="row">
                <div className="col-md-6 offset-md-3">
                    <h2 className="loginHeader">Login</h2>
                    <form onSubmit={validateForm}> 
                        <div className="form-group">
                            <label for="email">Email:</label>
                            <input type="email" className="form-control" id="email" placeholder="Enter email" name="email" />
                        </div>
                        <div className="form-group">
                            <label for="pwd">Password:</label>
                            <input type="password" className="form-control" id="pwd" placeholder="Enter password" name="pswd" />
                        </div>
                        <button type="submit" className="btn btn-primary">Submit</button>
                    </form>
                </div>
            </div>
        </div>
    )
};

export default Login;