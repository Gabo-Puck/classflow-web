
import { Group, Box, ThemeIcon, UnstyledButton, rem } from '@mantine/core';
import classes from './NavbarLinksGroup.module.css';
import { Link } from 'react-router-dom';
import cx from 'clsx';
interface LinksGroupProps {
    icon: React.FC<any>;
    label: string;
    show?: boolean;
    link: string;
    active?: boolean
}

export function LinkButton({ icon: Icon, label, show, link, active }: LinksGroupProps) {
    return (
        <>
            <UnstyledButton component={Link} to={link} className={cx(classes.control, { [classes.active]: active }, { [classes.hide]: !show })} >
                <Group justify="space-between" gap={0}>
                    <Box style={{ display: 'flex', alignItems: 'center' }}>
                        <ThemeIcon variant="light" size={30}>
                            <Icon style={{ width: rem(18), height: rem(18) }} />
                        </ThemeIcon>
                        <Box ml="md">{label}</Box>
                    </Box>
                </Group>
            </UnstyledButton >
        </>
    );
}