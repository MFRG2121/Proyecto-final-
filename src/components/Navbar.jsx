import { Badge, Flex, Heading, HStack, Link, Spacer } from '@chakra-ui/react';
import { NavLink } from 'react-router-dom';
import { useTasks } from '../context/TaskContext';

export default function Navbar() {
  const { pendingCount } = useTasks();

  const linkStyle = ({ isActive }) => ({
    fontWeight: isActive ? 700 : 500,
    textDecoration: isActive ? 'underline' : 'none',
  });

  return (
    <Flex as="nav" bg="teal.600" color="white" px={6} py={3} align="center" wrap="wrap" gap={4}>
      <Heading size="md">Gestor de Tareas</Heading>
      <HStack spacing={4} ml={6}>
        <Link as={NavLink} to="/" end style={linkStyle}>
          Lista
        </Link>
        <Link as={NavLink} to="/calendar" style={linkStyle}>
          Calendario
        </Link>
      </HStack>
      <Spacer />
      <Badge data-testid="pending-count" colorScheme="yellow" fontSize="sm" px={3} py={1} borderRadius="md">
        Pendientes: {pendingCount}
      </Badge>
    </Flex>
  );
}
