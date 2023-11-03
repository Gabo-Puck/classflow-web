import { UnstyledButton, Group, Avatar, Text, rem } from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';
import classes from './UserButton.module.css';
import { useEmail, useFullname, useProfilePic } from '@features/auth/auth-context';
import AvatarClassflow from './avatar.component';

export function UserButton() {
    const profilePic = useProfilePic();
    const fullname = useFullname();
    const email = useEmail();
    if (profilePic === undefined || fullname === undefined || email === undefined) {
        throw new Error("UserButton should be defined as children of AuthProvider")
    }
    return (
        <UnstyledButton className={classes.user}>
            <Group>
                <AvatarClassflow img={profilePic} />

                <div style={{ flex: 1 }}>
                    <Text size="sm" fw={500}>
                        {fullname}
                    </Text>

                    <Text c="dimmed" size="xs">
                        {email}
                    </Text>
                </div>

                <IconChevronRight style={{ width: rem(14), height: rem(14) }} stroke={1.5} />
            </Group>
        </UnstyledButton>
    );
}