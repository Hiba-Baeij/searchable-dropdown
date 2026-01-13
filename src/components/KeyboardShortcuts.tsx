import { Paper, Text, Stack, Group, Kbd, Box } from '@mantine/core';

export function KeyboardShortcuts() {
    return (
        <Paper shadow="sm" p="xl" radius="md" withBorder>
            <Stack gap="md">
                <Text fw={600} size="lg" mb="xs">
                    Keyboard Shortcuts
                </Text>
                <Stack gap="sm">
                    <Group justify="space-between">
                        <Text size="sm">Navigate down</Text>
                        <Group gap={4}>
                            <Kbd>↓</Kbd>
                        </Group>
                    </Group>
                    <Group justify="space-between">
                        <Text size="sm">Navigate up</Text>
                        <Group gap={4}>
                            <Kbd>↑</Kbd>
                        </Group>
                    </Group>
                    <Group justify="space-between">
                        <Text size="sm">Select item</Text>
                        <Group gap={4}>
                            <Kbd>Enter</Kbd>
                        </Group>
                    </Group>
                    <Group justify="space-between">
                        <Text size="sm">Close dropdown</Text>
                        <Group gap={4}>
                            <Kbd>Esc</Kbd>
                        </Group>
                    </Group>
                </Stack>
                <Box mt="md" p="sm" style={{ backgroundColor: 'var(--mantine-color-blue-0)', borderRadius: 4 }}>
                    <Text size="xs" c="blue">
                        💡 Tip: Use mouse hover or keyboard to navigate through results
                    </Text>
                </Box>
            </Stack>
        </Paper>
    );
}
