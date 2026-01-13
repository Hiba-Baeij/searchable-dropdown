import { Title, Box, Group, Badge, Text, Divider, Anchor } from '@mantine/core';

export function Header() {
    return (
        <Box mb="xl">
            <Group gap="xs" mb="md">
                <Title order={1}>Searchable Dropdown</Title>
            </Group>

            <Divider mb="md" />

            <Group gap="lg" wrap="wrap" align="center">
                <Group gap="xs" wrap="nowrap">
                    <Text size="sm" c="dimmed">Created By</Text>
                    <Badge variant="light" color="blue" size="lg">
                        Hiba Baeej
                    </Badge>
                </Group>

                <Anchor
                    href="mailto:hibabeiaj@gmail.com"
                    size="sm"
                    c="blue"
                    underline="hover"
                >
                    📧 hibabeiaj@gmail.com
                </Anchor>

                <Anchor
                    href="tel:+963967283981"
                    size="sm"
                    c="teal"
                    underline="hover"
                >
                    📱 +963967283981
                </Anchor>

                <Anchor
                    href="https://github.com/Hiba-Baeij/searchable-dropdown-.git"
                    target="_blank"
                    rel="noopener noreferrer"
                    size="sm"
                    c="dark"
                    underline="hover"
                >
                    🔗 GitHub Repo
                </Anchor>

                <Anchor
                    href="https://www.linkedin.com/in/hiba-baeej"
                    target="_blank"
                    rel="noopener noreferrer"
                    size="sm"
                    c="indigo"
                    underline="hover"
                >
                    💼 LinkedIn Profile
                </Anchor>
            </Group>
        </Box>
    );
}
