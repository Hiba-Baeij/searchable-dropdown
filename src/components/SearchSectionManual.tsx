import { Box, Paper, Text, Group, Stack } from '@mantine/core';
import { SearchableDropdown } from './SearchableDropdown';
import { SearchResult } from '../types';

interface SearchSectionManualProps {
    onSelect: (item: SearchResult) => void;
}

export function SearchSectionManual({ onSelect }: SearchSectionManualProps) {
    return (
        <Stack gap="xl" mb="xl">
            {/* Manual Implementation Example */}
            <Paper shadow="sm" p="xl" radius="md" withBorder>
                <Stack gap="md">
                    <Group justify="space-between" align="center">
                        <Box>
                            <Text fw={600} size="lg" mb={4}>
                                1. Manual Implementation
                            </Text>
                            <Text c="dimmed" size="sm">
                                Custom-built searchable dropdown with advanced features
                            </Text>
                        </Box>
                    </Group>
                    <SearchableDropdown
                        placeholder="Search for items (e.g., 'laptop', 'phone', 'watch')..."
                        onSelect={onSelect}
                    />
                </Stack>
            </Paper>


        </Stack>
    );
}
