import './App.css'
import Footer from './components/Footer'
import Landing from './pages/Landing'
import { Routes, Route } from 'react-router-dom'
import VolunteerRegistration from './pages/VolunteerRegistration'
import AdminDashboard from './pages/AdminDashboard'
import VolunteerDashboard from './pages/VolunteerDashboard'
import Login from './pages/Login'
import NewRequest from './pages/NewRequest'
import FAQ from './pages/FAQ'
function App() {

  return (
    <>
      
        <Routes>
          <Route path='/' element={<Landing/>} />
          <Route path='/volunteer-registration' element={<VolunteerRegistration/>} />
          <Route path='/admin-dashboard' element={<AdminDashboard/>} />
          <Route path='/volunteer-dashboard' element={<VolunteerDashboard/>} />
          <Route path='/login' element={<Login/>} />
          <Route path='/new-request' element={<NewRequest/>} />
          <Route path='/faq' element={<FAQ/>} />


        </Routes>
      
      <Footer/>
    </>
  )
}

export default App
