import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {

    const [email, setEmail] = useState({ value: '', error: '' });
    const [password, setPassword] = useState({ value: '', error: '' });
    const navigate = useNavigate();

    const onFinish = async () => {
        try {
            const response = await axios.post('http://localhost:3001/login', {
                email: email.value,
                password: password.value
            });
            localStorage.setItem('token', response.data?.token);
            navigate('/', {replace: true});
        } catch (error) {
            console.log(error);
        }
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

        if (valid) {
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
                            <label htmlFor="email">Email:</label>
                            <input type="email" className="form-control" id="email" placeholder="Enter email" name="email" value={email.value} onChange={(e) => setEmail({ value: e.target.value, error: '' })} />
                            <p style={{ color: 'red' }}>{email.error && email.error}</p>
                        </div>
                        <div className="form-group">
                            <label htmlFor="pwd">Password:</label>
                            <input type="password" className="form-control" id="pwd" placeholder="Enter password" name="pswd" value={password.value} onChange={(e) => setPassword({ value: e.target.value, error: '' })} />
                            <p style={{ color: 'red' }}>{password.error && password.error}</p>
                        </div>
                        <button type="submit" className="btn btn-primary">Login</button>
                    </form>
                </div>
            </div>
        </div>
    )
};

export default Login;