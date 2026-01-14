import { Box, Paper, Text, Group, Badge, Stack, Transition } from '@mantine/core';
import { SearchResult } from '../types';
import { useEffect, useState } from 'react';

interface SelectedItemCardProps {
    item: SearchResult | null;
}

export function SelectedItemCard({ item }: SelectedItemCardProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        if (item) {
            setMounted(true);
        } else {
            setMounted(false);
        }
    }, [item]);

    if (!item) return null;

    return (
        <Transition mounted={mounted} transition="slide-up" duration={300} timingFunction="ease">
            {(styles) => (
                <Paper
                    shadow="md"
                    p="xl"
                    radius="md"
                    withBorder
                    style={styles}
                    mb="xl"
                >
                    <Stack gap="md">
                        <Group justify="space-between" align="flex-start">
                            <Box>
                                <Text c="dimmed" size="sm" mb={4} fw={500}>
                                    Selected Item
                                </Text>
                                <Text size="xl" fw={700} mb="xs">
                                    {item.name}
                                </Text>
                            </Box>
                            <Badge color="blue" size="lg" variant="light">
                                ID: {item.id}
                            </Badge>
                        </Group>
                        <Group gap="xs">
                            <Badge color="green" variant="light">
                                ✓ Selected
                            </Badge>
                        </Group>
                    </Stack>
                </Paper>
            )}
        </Transition>
    );
}
