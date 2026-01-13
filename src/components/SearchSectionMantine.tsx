import { Box, Paper, Text, Group, Stack } from '@mantine/core';
import { SearchResult } from '../types';
import { MantineComboboxExample } from './MantineComboboxExample';

interface SearchSectionMantineProps {
    onSelect: (item: SearchResult) => void;
}

export function SearchSectionMantine({ onSelect }: SearchSectionMantineProps) {
    return (
        <Stack gap="xl" mb="xl">
            {/* Mantine UI Implementation Example */}
            <Paper shadow="sm" p="xl" radius="md" withBorder>
                <Stack gap="md">
                    <Group justify="space-between" align="center">
                        <Box>
                            <Text fw={600} size="lg" mb={4}>
                                2. Mantine UI Combobox
                            </Text>
                            <Text c="dimmed" size="sm">
                                Built using Mantine UI's Combobox component
                            </Text>
                        </Box>
                    </Group>
                    <MantineComboboxExample
                        placeholder="Search for items (e.g., 'laptop', 'phone', 'watch')..."
                        onSelect={onSelect}
                    />
                </Stack>
            </Paper>

        </Stack>
    );
}
