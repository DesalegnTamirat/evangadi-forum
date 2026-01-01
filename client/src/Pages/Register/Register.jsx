import React from 'react'
import axios from '../../axiosConfig'
// import {useNavigate} from 'react-router-dom'
import { useRef } from 'react';
const Register = () => {
    const userNameDom = useRef();
    const firstNameDom = useRef();
    const lastNameDom = useRef();
    const emailDom = useRef();
    const passwordDom = useRef();


    // const navigate = useNavigate();clear
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const userNameValue = userNameDom.current.value;
        const firstNameValue = firstNameDom.current.value;
        const lastNameValue = lastNameDom.current.value;
        const emailValue = emailDom.current.value;
        const passwordValue = passwordDom.current.value;
        if(!userNameValue || !firstNameValue || !lastNameValue || !emailValue || !passwordValue){
            alert("All fields are required");
            return;
        }
        try {
            await axios.post('/user/register', {
                username: userNameValue,
                firstName: firstNameValue,
                lastName: lastNameValue,
                email: emailValue,
                password: passwordValue
            });
            alert("Registration successful! Please login.");
            // navigate('/login');
            
        } catch (error) {
            console.log(error.response)

            
        }
    };
  return (
    <section>
        <form action="" onSubmit={handleSubmit}>
<div>
    <span>username : </span>
    <input type="text" placeholder='username' ref={userNameDom} />
</div>
<br />
<div>
    <span>First Name : </span>
    <input type="text" placeholder='first name' ref={firstNameDom}/>
</div>
<br />
<div>
    <span>Last Name : </span>
    <input type="text" placeholder='last name' ref={lastNameDom}/>
</div>
<br />
<div>
    <span>Email : </span>
    <input type="email" placeholder='email' ref={emailDom}/>
</div>
<br />
<div>
    <span>Password : </span>
    <input type="password" placeholder='password' ref={passwordDom}/>
</div>

<button type='submit'>Register</button>
        </form>
      
    </section>
  );
}

export default Register
