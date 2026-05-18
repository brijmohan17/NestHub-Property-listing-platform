import './App.css'
import { createBrowserRouter,RouterProvider } from 'react-router-dom'
import Home from './pages/Home'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Newlisting from './pages/Newlisting'
import SingleListing from './components/SingleListing'
import ShowListing from './pages/ShowListing'
import UpdateListing from './pages/UpdateListing'
import ProtectedRoute from './components/ProtectedRoute'
import OAuthCallback from './pages/OAuthCallback'
import { Toaster } from 'react-hot-toast'

function App() {
  
  const router=createBrowserRouter([
    {
      path:'/',
      element:
      <div>
        <Home/>
      </div>
    },
    {
      path:'/signup',
      element:<Signup/>
    },
    {
      path:'/login',
      element:<Login/>
    },
    {
      path:'/oauth/callback',
      element:<OAuthCallback/>
    },
    {
      path:'/listing/new',
      element:(
        <ProtectedRoute>
          <Newlisting/>
        </ProtectedRoute>
      )
    },
    {
      path:`/listings/:id`,
      element:<ShowListing/>
    },
    {
      path:'/listings/:id/edit',
      element:
      (
        <ProtectedRoute>
          <UpdateListing/>
        </ProtectedRoute>
      )
    }
  ])

  return (
    <>
      <Toaster position="top-center" />
      <RouterProvider router={router}/>
    </>
  )
}

export default App
