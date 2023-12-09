import { useState } from "react";
import axios from "axios";

const Register = () => {
    const [name, setName] = useState({ value: null, error: null });
    const [email, setEmail] = useState({ value: null, error: null });
    const [mobile, setMobile] = useState({ value: null, error: null });
    const [password, setPassword] = useState({ value: null, error: null });
    const [reenteredPwd, setReenteredPwd] = useState({ value: null, error: null });

    const onFinish = async () => {
        const data = {
            name: name,
            email: email,
            mobile: mobile,
            password: password
        };
        axios.post('https://lazy-plum-blackbuck-hem.cyclic.app/api/users', data)
            .then(res => res.data())
            .then(data => console.log(data))
            .catch(error => console.log(error));

    }
    const validateEmail = (email) => {
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailRegex.test(email)) {
            return true;
        } else {
            return false;
        }
    }
    const validateForm = (e) => {
        e.preventDefault();
        let valid = true;
        if (name.value == '' || name.value == null) {
            setName({
                ...name,
                error: "Please Enter Name"
            });
            valid = false;
        }
        if (mobile.value == '' || mobile.value == null) {
            setMobile({
                ...mobile,
                error: "Please Enter mobileNo"
            });
            valid = false;
        }
        if (password.value == '' || password.value == null) {
            setPassword({
                ...password,
                error: "Please Enter password"
            });
            valid = false;
        }
        if (reenteredPwd.value == '' || reenteredPwd.value == null) {
            setReenteredPwd({
                ...reenteredPwd,
                error: "Please Enter password"
            });
            valid = false;
        } else {
            console.log(password, reenteredPwd);
            if (password.value != reenteredPwd.value) {
                setReenteredPwd({
                    ...reenteredPwd,
                    error: "passwords didn't match"
                });
                valid = false;
            }
        }
        if (!validateEmail(email.value)) {
            setEmail({
                ...email,
                error: "Email Is Not Valid Please Enter Correct Email"
            });
            valid = false;
        }

        if (valid) {
            onFinish();
        }
    }
    return (
        <div className="container">
            <h2>SignUp</h2>
            <form onSubmit={validateForm}>
                <div className="form-group">
                    <label htmlFor="name">Name:</label>
                    <input type="text" className="form-control" id="name" placeholder="Enter name" name="name" onChange={(e) => setName({ value: e.target.value, error: null })} />
                    <p style={{ color: 'red' }}>{name.error && name.error}</p>
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input type="email" className="form-control" id="email" placeholder="Enter email" name="email" onChange={(e) => setEmail({ value: e.target.value, error: null })} />
                    <p style={{ color: 'red' }}>{email.error && email.error}</p>
                </div>
                <div className="form-group">
                    <label htmlFor="mobile">Mobile:</label>
                    <input type="text" className="form-control" id="mobile" placeholder="Enter mobile number" name="mobile" onChange={(e) => setMobile({ value: e.target.value, error: null })} />
                    <p style={{ color: 'red' }}>{mobile.error && mobile.error}</p>
                </div>
                <div className="form-group">
                    <label htmlFor="pwd">Password:</label>
                    <input type="password" className="form-control" id="pwd" placeholder="Enter password" name="pswd" onChange={(e) => setPassword({ value: e.target.value, error: null })} />
                    <p style={{ color: 'red' }}>{password.error && password.error}</p>
                </div>
                <div className="form-group">
                    <label htmlFor="pwd">Re-Enter Password:</label>
                    <input type="password" className="form-control" id="re-enterpwd" placeholder="Re-Enter password" name="repswd" onChange={(e) => setReenteredPwd({ value: e.target.value, error: null })} />
                    <p style={{ color: 'red' }}>{reenteredPwd.error && reenteredPwd.error}</p>
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    )
}

export default Register;