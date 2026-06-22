// router.jsx — React Router v6 configuration
import { createBrowserRouter } from 'react-router-dom'
import MainLayout  from '@/components/layout/MainLayout'
import DoctorPortal from '@/pages/DoctorPortal'
import NursePortal  from '@/pages/NursePortal'
import LoginPage    from '@/pages/LoginPage'

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <DoctorPortal />,
      },
      {
        path: 'nurse',
        element: <NursePortal />,
      },
    ],
  },
])

export default router
