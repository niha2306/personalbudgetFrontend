import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Register = () => {
    const [name, setName] = useState({ value: '', error: '' });
    const [email, setEmail] = useState({ value: '', error: '' });
    const [mobile, setMobile] = useState({ value: '', error: '' });
    const [password, setPassword] = useState({ value: '', error: '' });
    const [reenteredPwd, setReenteredPwd] = useState({ value: '', error: '' });

    const onFinish = async () => {
        const data = {
            name: name.value,
            email: email.value,
            mobile: mobile.value,
            password: password.value
        };
        axios.post('https://lazy-plum-blackbuck-hem.cyclic.app/api/users', data)
            .then(res => {
                setName({ value: '', error: '' });
                setEmail({ value: '', error: '' });
                setMobile({ value: '', error: '' });
                setPassword({ value: '', error: '' });
                setReenteredPwd({ value: '', error: '' });
                alert('User Created Successfully');
            })
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
    const validateForm = async (e) => {
        e.preventDefault();
        let valid = true;
        if (name.value === '' || name.value === null) {
            setName({
                ...name,
                error: "Please Enter Name"
            });
            valid = false;
        }
        if (mobile.value === '' || mobile.value === null) {
            setMobile({
                ...mobile,
                error: "Please Enter mobile number"
            });
            valid = false;
        } else {
            if (mobile.value.length !== 10) {
                setMobile({
                    ...mobile,
                    error: "mobile number should be 10 digits"
                });
                valid = false;
            }
        }
        if (password.value === '' || password.value === null) {
            setPassword({
                ...password,
                error: "Please Enter password"
            });
            valid = false;
        }
        if (reenteredPwd.value === '' || reenteredPwd.value === null) {
            setReenteredPwd({
                ...reenteredPwd,
                error: "Please Enter password"
            });
            valid = false;
        } else {
            console.log(password, reenteredPwd);
            if (password.value !== reenteredPwd.value) {
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
            try {
                const response = await axios.get('https://lazy-plum-blackbuck-hem.cyclic.app/api/users');
                const data = response.data;
                let isEmailAlreadyTaken = false;
                for (const d of data) {
                    if (d?.email === email.value) {
                        isEmailAlreadyTaken = true;
                        alert("Email is already in Use Please provide different email");
                        break;
                    }
                }
                if (!isEmailAlreadyTaken) {
                    onFinish();
                }
            } catch (error) {
                console.log(error);
            }
        }
    }
    return (
        <div className="container">
            <h2>SignUp</h2>
            <form onSubmit={validateForm}>
                <div className="form-group">
                    <label htmlFor="name">Name:</label>
                    <input type="text" className="form-control" id="name" placeholder="Enter name" name="name" value={name.value} onChange={(e) => setName({ value: e.target.value, error: '' })} />
                    <p style={{ color: 'red' }}>{name.error && name.error}</p>
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input type="email" className="form-control" id="email" placeholder="Enter email" name="email" value={email.value} onChange={(e) => setEmail({ value: e.target.value, error: '' })} />
                    <p style={{ color: 'red' }}>{email.error && email.error}</p>
                </div>
                <div className="form-group">
                    <label htmlFor="mobile">Mobile:</label>
                    <input type="text" className="form-control" id="mobile" placeholder="Enter mobile number" name="mobile" value={mobile.value} onChange={(e) => setMobile({ value: e.target.value, error: '' })} />
                    <p style={{ color: 'red' }}>{mobile.error && mobile.error}</p>
                </div>
                <div className="form-group">
                    <label htmlFor="pwd">Password:</label>
                    <input type="password" className="form-control" id="pwd" placeholder="Enter password" name="pswd" value={password.value} onChange={(e) => setPassword({ value: e.target.value, error: '' })} />
                    <p style={{ color: 'red' }}>{password.error && password.error}</p>
                </div>
                <div className="form-group">
                    <label htmlFor="pwd">Re-Enter Password:</label>
                    <input type="password" className="form-control" id="re-enterpwd" placeholder="Re-Enter password" name="repswd" value={reenteredPwd.value} onChange={(e) => setReenteredPwd({ value: e.target.value, error: '' })} />
                    <p style={{ color: 'red' }}>{reenteredPwd.error && reenteredPwd.error}</p>
                </div>
                <button type="submit" className="btn btn-primary">Register</button>
                <Link to={'/login'} className="btn btn-primary ml-5">Back To Login</Link>
            </form>
        </div>
    )
}

export default Register;