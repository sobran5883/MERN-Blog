import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom";
import { signInStart, signInSuccess, signInFailure } from "../redux/user/userSlice";
import {  useDispatch, useSelector } from "react-redux";

function SignIn() {
  const [formData, setFormData] = useState({});
  // const [errorMessage, setErrorMessage] = useState(null);
  // const [loading, setLoading] = useState(false);
  const {loading, error:errorMessage} = useSelector(state => state.user)
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleChange=(e)=>{
    setFormData(
      {...formData,[e.target.id]:e.target.value.trim()})
  };
  const handleSubmit = async (e)=>{
    e.preventDefault();
    if(!formData.email || !formData.password){
      // return setErrorMessage('Please fill out all fields');
      return dispatch(signInFailure('please fill all the fields'));
    }
    try {
      // setLoading(true);
      // setErrorMessage(null);
      dispatch(signInStart());
      const res = await fetch('/api/auth/signin',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify(formData),
      });
      const data= await res.json();
      if(data.success===false){
        // return setErrorMessage(data.message);
        dispatch(signInFailure(data.message));
      }
      // setLoading(false);
      if(res.ok){
        dispatch(signInSuccess(data));
        navigate('/');
      }
    } catch (error) {
      // setErrorMessage(error.message);
      // setLoading(false);
      dispatch(signInFailure(error.message));
    }
  }

  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        {/* left */}
        <div className="flex-1">
          <Link to='/' className="font-bold dark:text-white text-4xl">
            <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">Sobran's</span>
            <span>Blog</span>
          </Link>
          <p className="text-small mt-5">This is a demo project. You can sign In with your email and passord or with Google.</p>
        </div>
        {/* rigtht */}
        <div className="flex-1">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <Label value="Your email"/>
              <TextInput type="email" placeholder='Email' id="email" onChange={handleChange}/>
            </div>
            <div>
              <Label value="Your password"/>
              <TextInput type="password" placeholder='Password' id="password" onChange={handleChange}/>
            </div>
            <Button gradientDuoTone='purpleToPink' type="submit">
                {loading ?
                  (
                  <>
                    <Spinner size='sm'/>
                    <span className="pl-3">Loading...</span>
                  </>
                  )
                  :
                  ('Sign In')
                }
            </Button>
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <span>Dont an account?</span>
            <Link to='/sign-up' className="text-blue-500">
                Sign Up
            </Link>
          </div>
          {
            errorMessage && (<Alert className="mt-5" color='failure'>{errorMessage}</Alert>)
          }
        </div>
      </div>
    </div>
  )
}

export default SignIn