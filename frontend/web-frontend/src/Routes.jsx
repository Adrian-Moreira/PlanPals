import { Route, Routes } from 'react-router-dom'
import Home from './containers/Home.jsx'
import NotFound from './containers/NotFound.jsx'
import Login from './containers/Login.jsx'
import Signup from './containers/Signup.jsx'

export default function Links() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />;
      <Route path="/signup" element={<Signup />} />
      <Route path="*" element={<NotFound />} />;
    </Routes>
  )
}
