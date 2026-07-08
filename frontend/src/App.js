import {BrowserRouter, Route, Routes} from 'react-router-dom';
import Registration from './Components/Users/Register';
export default function App(){
  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path='/register' element={<Registration/>}/>
    </Routes>
    </BrowserRouter>
    </>
  )
}