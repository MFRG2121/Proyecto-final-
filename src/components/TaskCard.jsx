import { Badge, Box, Flex, Heading, HStack, IconButton, Select, Text } from '@chakra-ui/react';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import {
  PRIORITY_COLORS,
  PRIORITY_LABELS,
  STATUS_COLORS,
  STATUS_LABELS,
} from '../utils/constants';

export default function TaskCard({ task, onEdit, onDelete, onChangeStatus }) {
  const isCompleted = task.status === 'completed';

  return (
    <Box
      as="article"
      data-testid={`task-${task.id}`}
      borderWidth="1px"
      borderColor="#E6DFD3"
      borderTopLeftRadius="2xl"
      borderBottomRightRadius="2xl"
      borderTopRightRadius="lg"
      borderBottomLeftRadius="lg"
      bg={isCompleted ? '#F3EFE8' : 'white'}
      boxShadow="0 2px 10px rgba(30, 36, 33, 0.04)"
      _hover={{
        borderColor: '#CBBFA9',
        boxShadow: '0 8px 20px rgba(30, 36, 33, 0.08)',
        transform: 'translateY(-2px)',
      }}
      transition="all 0.16s ease"
      p={4}
      display="flex"
      flexDirection="column"
      opacity={isCompleted ? 0.78 : 1}
    >
      <Flex justify="space-between" align="center" gap={2} mb={2}>
        <Text
          fontSize="11px"
          fontWeight="700"
          color="#6B706C"
          bg="#FAF7F2"
          px={2.5}
          py="2px"
          borderRadius="full"
        >
          {task.dueDate}
        </Text>

        <HStack spacing={0.5} flexShrink={0}>
          <IconButton
            size="xs"
            w="26px"
            h="26px"
            borderRadius="full"
            variant="ghost"
            color="#5C635F"
            _hover={{ bg: '#FAF7F2', color: '#1E2421' }}
            icon={<EditIcon boxSize={3} />}
            aria-label={`Editar ${task.title}`}
            onClick={() => onEdit(task)}
          />
          <IconButton
            size="xs"
            w="26px"
            h="26px"
            borderRadius="full"
            variant="ghost"
            color="#8C918E"
            _hover={{ bg: 'red.50', color: 'red.600' }}
            icon={<DeleteIcon boxSize={3} />}
            aria-label={`Eliminar ${task.title}`}
            onClick={() => onDelete(task.id)}
          />
        </HStack>
      </Flex>

      <Heading
        size="sm"
        fontWeight="700"
        color="#1E2421"
        lineHeight="1.35"
        textDecoration={isCompleted ? 'line-through' : 'none'}
      >
        {task.title}
      </Heading>

      {task.description && (
        <Text mt={1.5} fontSize="xs" color="#5C635F" lineHeight="1.5" noOfLines={2}>
          {task.description}
        </Text>
      )}

      <Flex mt="auto" pt={4} align="center" justify="space-between" gap={2} wrap="wrap">
        <HStack spacing={1.5}>
          <Badge
            colorScheme={STATUS_COLORS[task.status]}
            variant="subtle"
            borderRadius="full"
            px={2.5}
            py="2px"
            fontSize="10px"
            fontWeight="700"
          >
            {STATUS_LABELS[task.status]}
          </Badge>
          <Badge
            colorScheme={PRIORITY_COLORS[task.priority]}
            variant="subtle"
            borderRadius="full"
            px={2.5}
            py="2px"
            fontSize="10px"
            fontWeight="700"
          >
            {PRIORITY_LABELS[task.priority]}
          </Badge>
        </HStack>

        <Select
          size="xs"
          w="126px"
          borderRadius="full"
          bg="#FAF7F2"
          borderColor="#E6DFD3"
          color="#1E2421"
          fontWeight="600"
          _hover={{ borderColor: '#D2C8B8' }}
          _focus={{ bg: 'white', borderColor: '#E07A5F' }}
          aria-label={`Cambiar estado de ${task.title}`}
          value={task.status}
          onChange={(e) => onChangeStatus(task.id, e.target.value)}
        >
          {Object.entries(STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </Select>
      </Flex>
    </Box>
  );
}