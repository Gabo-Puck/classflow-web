import { Group, Code, ScrollArea, rem, Title } from '@mantine/core';
import {
    IconNotes,
    IconCalendarStats,
    IconGauge,
    IconPresentationAnalytics,
    IconFileAnalytics,
    IconAdjustments,
    IconLock,
} from '@tabler/icons-react';
import { UserButton } from './UserButton';
import { LinkButton } from './LinksGroup';
import classes from './NavbarNested.module.css';
import { useLocation } from 'react-router-dom';
import { ROLES, useRole } from '@features/auth/auth-context';


export function NavbarNested() {
    const location = useLocation();
    const role = useRole();
    if (role === undefined)
        throw new Error("NavbarNested should be defined as children of AuthProvider")
    const mockdata = [
        {
            label: 'Tablero',
            icon: IconGauge,
            link: "/app/tablero",
            active: location.pathname.includes("/app/tablero") || location.pathname.includes("/app/clase"),
            show: true
        },
        {
            label: 'Plantillas parcial',
            icon: IconGauge,
            link: "/app/parciales",
            active: location.pathname.includes("/app/parciales"),
            show: role === ROLES.PROFESSOR
        },
        {
            label: 'Plantillas formulario',
            icon: IconGauge,
            link: "/app/formulario",
            active: location.pathname.includes("/app/formulario"),
            show: role === ROLES.PROFESSOR
        },
        {
            label: 'Invitaciones',
            icon: IconPresentationAnalytics,
            link: "/app/invitaciones",
            active: location.pathname.includes("/app/invitaciones"),
            show: role === ROLES.STUDENT
        },
    ];
    const links = mockdata.map((item) => <LinkButton {...item} key={item.label} active={item.active} />);
    return (
        <>
            <div className={classes.header}>
                <Group justify="space-between">
                    <Title order={3} >
                        Classflow
                    </Title>
                </Group>
            </div>

            <ScrollArea className={classes.links}>
                <div className={classes.linksInner}>{links}</div>
            </ScrollArea>

            <div className={classes.footer}>
                <UserButton />
            </div>
        </>

    );
}