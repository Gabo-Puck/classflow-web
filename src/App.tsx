import cx from 'clsx';
import style from './App.module.css'
import '@mantine/core/styles.css';
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom"
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
import { ClassProvider } from '@features/class/class-detail.context';
import ClassBoard from '@pages/class-board';
import Invitations from '@pages/invitations';
import CreateNotice from '@pages/notice-create';
import '@mantine/tiptap/styles.css';
import NoticeDetail from '@features/notices/notice-detail';
import ClassflowShell from '@pages/app-shell';
import Notices from '@pages/Notices';
import Assignments from '@features/assignments/assignments';
import Students from '@features/class-members/Students';
import NoticeTab from '@features/notices/notice-tab';
import ClassMembersTab from '@features/class-members/class-members-tab';
import AssignmentsTab from '@features/assignments/assignments-tab';
import TermsTemplateControls from '@features/terms-template/terms-template-controls.component';
import TermsTemplateForm from '@features/terms-template/terms-template-create-form.component';
import CreateTermTemplate from '@pages/term-template-create';
import CreateClass from '@pages/create-class';
import CreateFormTemplate from '@pages/form-template-create';
const theme = createTheme({
  components: {
    Container: Container.extend({
      classNames: (_, { size }) => ({
        root: cx({ [style.responsiveContainer]: size === 'responsive' }),
      }),
    }),
  },
});
const router = createBrowserRouter([
  {
    path: "",
    element: <>
      <MantineProvider defaultColorScheme='dark' theme={theme}>
        <ModalsProvider>
          <Outlet />
          <Notifications position='bottom-right' />
        </ModalsProvider>
      </MantineProvider>
    </>,
    children: [
      {
        path: "/",
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
        element: <ClassflowShell />,
        children: [
          {
            path: "tablero",
            element: <Panel />,
            children: [

            ]
          },
          {
            path: "clase",
            children: [
              {
                path: "crear",
                element: <CreateClass/>
              },
              {
                path: ":classId",
                element: <ClassBoard />,
                children: [
                  {
                    path: "anuncios",
                    element: <NoticeTab />,
                    children: [
                      {
                        index: true,
                        element: <Notices />,
                      },
                      {
                        path: "crear",
                        element: <CreateNotice />
                      },
                      {
                        path: "editar/:noticeId",
                        element: <CreateNotice />
                      },
                      {
                        path: "ver/:noticeId",
                        element: <NoticeDetail />
                      }
                    ]
                  },
                  {
                    path: "integrantes",
                    element: <ClassMembersTab />
                  },
                  {
                    path: "tareas",
                    element: <AssignmentsTab />
                  }
                ]
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
          {
            path: "parciales",
            element: <PrivateEndpoint role={ROLES.PROFESSOR} />,
            children: [
              {
                index: true,
                element: <TermsTemplateControls />
              },
              {
                path: "crear",
                element: <CreateTermTemplate />
              },
              {
                path: "editar/:templateId",
                element: <CreateTermTemplate />
              }
            ]
          },
          {
            path: "formularios",
            element: <PrivateEndpoint role={ROLES.PROFESSOR} />,
            children: [
              {
                index: true,
                element: <TermsTemplateControls />
              },
              {
                path: "crear",
                element: <CreateFormTemplate />
              },
              {
                path: "editar/:templateId",
                element: <CreateTermTemplate />
              }
            ]
          },
        ]
      },
      {
        path: "validate",
        element: <VerifyEmail />
      }
    ]
  },

])

function App() {
  return (
    <RouterProvider router={router} />
  )
}

export default App
