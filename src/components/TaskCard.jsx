import { Badge, Box, Flex, Heading, HStack, IconButton, Select, Text } from '@chakra-ui/react';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import {
  PRIORITY_COLORS,
  PRIORITY_LABELS,
  STATUS_COLORS,
  STATUS_LABELS,
} from '../utils/constants';

export default function TaskCard({ task, onEdit, onDelete, onChangeStatus }) {
  return (
    <Box
      as="article"
      data-testid={`task-${task.id}`}
      p={4}
      borderWidth="1px"
      borderRadius="lg"
      bg="white"
      shadow="sm"
      opacity={task.status === 'completed' ? 0.75 : 1}
    >
      <Flex justify="space-between" align="flex-start" gap={2}>
        <Heading size="sm" textDecoration={task.status === 'completed' ? 'line-through' : 'none'}>
          {task.title}
        </Heading>
        <HStack spacing={1}>
          <IconButton
            size="sm"
            variant="ghost"
            icon={<EditIcon />}
            aria-label={`Editar ${task.title}`}
            onClick={() => onEdit(task)}
          />
          <IconButton
            size="sm"
            variant="ghost"
            colorScheme="red"
            icon={<DeleteIcon />}
            aria-label={`Eliminar ${task.title}`}
            onClick={() => onDelete(task.id)}
          />
        </HStack>
      </Flex>

      {task.description && (
        <Text mt={2} fontSize="sm" color="gray.600">{task.description}</Text>
      )}

      <HStack mt={3} spacing={2} wrap="wrap">
        <Badge colorScheme={STATUS_COLORS[task.status]}>{STATUS_LABELS[task.status]}</Badge>
        <Badge colorScheme={PRIORITY_COLORS[task.priority]}>Prioridad {PRIORITY_LABELS[task.priority]}</Badge>
        <Text fontSize="xs" color="gray.500">Vence: {task.dueDate}</Text>
      </HStack>

      <Select
        mt={3}
        size="sm"
        aria-label={`Cambiar estado de ${task.title}`}
        value={task.status}
        onChange={(e) => onChangeStatus(task.id, e.target.value)}
      >
        {Object.entries(STATUS_LABELS).map(([value, label]) => (
          <option key={value} value={value}>{label}</option>
        ))}
      </Select>
    </Box>
  );
}
