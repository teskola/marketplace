import { useRef, useState, useContext } from 'react';
import { useMutation } from 'react-query';

import Button from '../../shared/components/button/Button';
import Card from '../../shared/components/card/Card';
import Input from '../../shared/components/input/Input';

import { loginUser, signUpUser } from '../api/users';
import { AuthContext } from '../../shared/context/auth-context';

import './Authenticate.css';
import { Alert } from '@mui/material';
import LoadingSpinner from '../../shared/components/loadingspinner/LoadingSpinner';

const Authenticate = () => {
  const [isLoading, setIsLoading] = useState(false);
  const nameRef = useRef();
  const emailRef = useRef();
  const phoneRef = useRef();
  const passwordRef = useRef();
  const [error, setError] = useState(null);
  const [isLoginMode, setLoginMode] = useState(true);
  const auth = useContext(AuthContext);

  const switchModeHandler = () => {
    setError(null);
    setLoginMode(prevMode => !prevMode);
  }

  const signUpUserMutation = useMutation({
    mutationFn: signUpUser,
    onSuccess: (data) => {
      setIsLoading(false);
      if (data.OK) {
        auth.login(data.id, data.name, data.email, data.phone, data.token);
        console.log(data);
      } else {
        setError(data.error);
      }
    },    
  });

  const loginUserMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      setIsLoading(false);
      if (data.OK) {
        auth.login(data.id, data.name, data.email, data.phone, data.token);
        console.log(data);
      } else {
        setError(data.error);
      }
    },
  });

  const onSubmitHandler = event => {
    event.preventDefault();
    setIsLoading(true);
    if(isLoginMode) {
      loginUserMutation.mutate({
        email: emailRef.current.value,
        password: passwordRef.current.value
      });
    } else {
      signUpUserMutation.mutate({
        name: nameRef.current.value,
        email: emailRef.current.value,
        phone: phoneRef.current.value,
        password: passwordRef.current.value
      });
    }
  }

  if (isLoading) 
    return (
      <div className='center'>
        <LoadingSpinner/>
      </div>
    )

  return (
    <Card className="authentication">
      <h2>{isLoginMode? 'Login': 'Sign Up'}</h2>
      <form onSubmit={onSubmitHandler}>
        {error && <Alert severity='error'>{error}</Alert>}
        {!isLoginMode && (
          <div>
          <Input id="name" ref={nameRef} type="text" label="Name" minLength={4} maxLength={100} required/>
          <Input id="phone" ref={phoneRef} type="tel" label="Phone" minLength={7} maxLength={14}/> 
          </div>
        )}
        <Input id="email" ref={emailRef} type="email" label="Email" maxLength={255} required/>        
        <Input id="password" ref={passwordRef} type="password" label="Password" required/> 
        <Button type="submit">
          {isLoginMode? 'LOGIN' : 'SIGNUP'}
        </Button>
      </form>
      <Button inverse onClick={switchModeHandler}>
        {isLoginMode? 'SignUp':'Login'} instead?
      </Button>
    </Card>
  )
};

export default Authenticate;