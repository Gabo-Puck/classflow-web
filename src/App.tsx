import cx from 'clsx';
import style from './App.module.css'
import '@mantine/core/styles.css';
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { Container, createTheme, MantineProvider, Text } from '@mantine/core';
import { Notifications } from "@mantine/notifications";
import { ModalsProvider } from "@mantine/modals";
import Login from './pages/login';
import Panel from '@pages/panel';
import Signup from "@pages/signup";
import VerifyEmail from '@pages/verify-email';
import { AuthProvider, ROLES } from '@features/auth/auth-context';
import { PrivateEndpoint } from '@features/auth/auth-private-endpoint';
import '@mantine/notifications/styles.css';
import { ClassDetailContext, ClassProvider } from '@features/class/class-detail.context';
import ClassHeader from '@features/class/class-header.component';
import ClassBoard from '@pages/class-board';
import { InvitationProvider } from '@features/invitations/invitations-list.context';
import Invitations from '@pages/Invitations';
const router = createBrowserRouter([
  {
    path: "/",
    index: true,
    element: <div>Landing page</div>
  },
  {
    path: "/registrarse",
    element: <Signup />
  },
  {
    path: "login",
    element: <Login />,
  },
  {
    path: "/app",
    element: <AuthProvider />,
    children: [
      {
        path: "tablero",
        element: <Panel />,
        index: true
      },
      {
        path: "clase",
        children: [
          {
            path: "crear",

          },
          {
            path: ":classId",
            element: <ClassProvider />,
            children: [{
              element: <ClassBoard />,
              index: true
            }]
          }
        ]
      },
      {
        path: "invitaciones",
        element: (
          <PrivateEndpoint role={ROLES.STUDENT} />
        ),
        children: [
          {
            index: true,
            element: <Invitations />
          }
        ]

      },
      {
        path: "professor",
        element: <PrivateEndpoint role={ROLES.STUDENT}>
          <Text>Professor!</Text>
        </PrivateEndpoint>
      },
    ]
  },
  {
    path: "validate",
    element: <VerifyEmail />
  }

])
const theme = createTheme({
  components: {
    Container: Container.extend({
      classNames: (_, { size }) => ({
        root: cx({ [style.responsiveContainer]: size === 'responsive' }),
      }),
    }),
  },
});
function App() {
  return (
    <MantineProvider defaultColorScheme='dark' theme={theme}>
      <ModalsProvider>

        <RouterProvider router={router} />
        <Notifications position='bottom-right' />
      </ModalsProvider>
    </MantineProvider >

  )
}

export default App
