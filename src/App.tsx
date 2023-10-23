import cx from 'clsx';
import style from './App.module.css'
import '@mantine/core/styles.css';
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { Container, createTheme, MantineProvider, Text } from '@mantine/core';
import Login from './pages/Login';
import Panel from '@pages/Panel';
import VerifyEmail from '@pages/verify-email';
import { AuthProvider, ROLES } from '@features/auth/auth-context';
import { PrivateEndpoint } from '@features/auth/auth-private-endpoint';

const router = createBrowserRouter([
  {
    path: "/",
    index: true,
    element: <div>Landing page</div>
  },
  {
    path: "/app",
    element: <AuthProvider />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "panel",
        element: <Panel />
      },
      {
        path: "professor",
        element: <PrivateEndpoint role={ROLES.STUDENT}>
          <Text>Professor!</Text>
        </PrivateEndpoint>
      },
      {
        path: "validate",
        element: <VerifyEmail />
      }
    ]
  },

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
      <RouterProvider router={router} />
    </MantineProvider >

  )
}

export default App
