import {BrowserRouter, Route, Routes} from 'react-router-dom';
import Registration from './Components/Users/Register';
import Login from './Components/Users/Login';
import Dashboard from './Components/Users/UserDashboard';
import PublicNavbar from './Components/NavBar/PublicNavBar';
import Home from './Components/Home/Home';
import { useAuth } from './AuthContext/AuthContext';
import PrivateNavbar from './Components/NavBar/PrivateNavBar';
import AuthRoute from './Components/AuthRoute/AuthRoute';
import BlogPostAIAssistant from './Components/ContentGeneration/GenerateContent';
import Plans from './Components/Plan/Plan';
import FreePlanSignup from './Components/StripePayment/FreePlansignUp';
import AboutUs from './Components/About/About';


export default function App(){
  const { isAuthenticated } = useAuth();
  return (
    <>
    <BrowserRouter>
    {isAuthenticated ? <PrivateNavbar/> : <PublicNavbar/>}
    <Routes>
      <Route path='/register' element={<Registration/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/dashboard' element={
        <AuthRoute><Dashboard/></AuthRoute>
      }/>
      <Route path='/' element={<Home/>} />
      <Route path='/generate-content' element = {<AuthRoute>
        <BlogPostAIAssistant/>
      </AuthRoute>} />
      <Route path='/plans' element={<Plans/>} />
      <Route path='/free-plan' element={<FreePlanSignup/>} />
      <Route path='/about' element={<AboutUs/>} />
    </Routes>
    </BrowserRouter> 
    </>
  )
}