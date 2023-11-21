import { useDisclosure } from '@mantine/hooks';
import { AppShell, Burger, Group, ScrollArea, Skeleton, Text, Title } from '@mantine/core';
import { Outlet } from 'react-router-dom';
import { AuthProvider, useFullname, useProfilePic } from '@features/auth/auth-context';
import AvatarClassflow from '@features/ui/avatar.component';
import { NavbarNested } from '@features/ui/Navbar';

function Classflow() {
    const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
    const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);
    const profilePic = useProfilePic();
    const fullname = useFullname();
    if (fullname === undefined || profilePic === undefined) {
        throw new Error("ClassflowShell should be defined as children of AuthProvider")
    }
    return (
        <AppShell
            mah="100vh"
            navbar={{
                width: 300,
                breakpoint: 'sm',
                collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
            }}

        >
            <AppShell.Navbar p="md">
                <NavbarNested />
            </AppShell.Navbar>
            <AppShell.Main>
                <Outlet />
            </AppShell.Main>
        </AppShell>
    );
}

export default function ClassflowShell() {
    return <AuthProvider>
        <Classflow />
    </AuthProvider>
}