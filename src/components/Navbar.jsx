import {
  Badge,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Heading,
  HStack,
  IconButton,
  Link,
  Stack,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import { NavLink } from 'react-router-dom';
import { useTasks } from '../context/TaskContext';

export default function Navbar() {
  const { pendingCount } = useTasks();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const navItems = (onItemClick) => (
    <Stack spacing={2}>
      <NavLink to="/" end onClick={onItemClick}>
        {({ isActive }) => (
          <Link
            as="span"
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            px={3.5}
            py={2.5}
            borderTopLeftRadius="xl"
            borderBottomRightRadius="xl"
            borderTopRightRadius="md"
            borderBottomLeftRadius="md"
            fontSize="sm"
            fontWeight={isActive ? '700' : '500'}
            bg={isActive ? '#E07A5F' : 'transparent'}
            color={isActive ? 'white' : '#C7C4BC'}
            position="relative"
            _hover={{
              bg: isActive ? '#E07A5F' : 'whiteAlpha.100',
              color: 'white',
              zIndex: 1,
              sx: {
                animation: 'tiltBounce 0.15s ease forwards',
              },
            }}
          >
            <Text>Lista</Text>
            <Text fontSize="xs">→</Text>
          </Link>
        )}
      </NavLink>

      <NavLink to="/calendar" onClick={onItemClick}>
        {({ isActive }) => (
          <Link
            as="span"
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            px={3.5}
            py={2.5}
            borderTopLeftRadius="xl"
            borderBottomRightRadius="xl"
            borderTopRightRadius="md"
            borderBottomLeftRadius="md"
            fontSize="sm"
            fontWeight={isActive ? '700' : '500'}
            bg={isActive ? '#E07A5F' : 'transparent'}
            color={isActive ? 'white' : '#C7C4BC'}
            position="relative"
            _hover={{
              bg: isActive ? '#E07A5F' : 'whiteAlpha.100',
              color: 'white',
              zIndex: 1,
              sx: {
                animation: 'tiltBounceAlt 0.15s ease forwards',
              },
            }}
          >
            <Text>Calendario</Text>
            <Text fontSize="xs">→</Text>
          </Link>
        )}
      </NavLink>
    </Stack>
  );

  return (
    <>
      <Box
        as="header"
        w="full"
        bg="#1E2421"
        color="#F5F3EE"
        px={{ base: 4, md: 6 }}
        py={3}
        borderBottom="1px solid"
        borderColor="whiteAlpha.100"
      >
        <Flex maxW="1440px" mx="auto" align="center" justify="space-between" gap={4}>
          <HStack spacing={3}>
            <IconButton
              aria-label="Abrir menú"
              icon={<HamburgerIcon />}
              size="sm"
              variant="ghost"
              color="#F5F3EE"
              borderRadius="lg"
              position="relative"
              _hover={{
                bg: 'whiteAlpha.100',
                zIndex: 1,
                sx: {
                  animation: 'tiltBounce 0.15s ease forwards',
                },
              }}
              onClick={onOpen}
            />

            <Flex align="center" gap={2.5}>
              <Flex
                w="30px"
                h="30px"
                borderTopLeftRadius="xl"
                borderBottomRightRadius="xl"
                borderTopRightRadius="sm"
                borderBottomLeftRadius="sm"
                bg="#E07A5F"
                color="white"
                align="center"
                justify="center"
                fontWeight="800"
                fontSize="sm"
              >
                ✦
              </Flex>
              <Heading size="sm" fontWeight="700" color="#F5F3EE" letterSpacing="-0.01em">
                Gestor de Tareas
              </Heading>
            </Flex>

            <HStack spacing={1.5} ml={4} display={{ base: 'none', md: 'flex' }}>
              <NavLink to="/" end>
                {({ isActive }) => (
                  <Button
                    as="span"
                    size="xs"
                    h="30px"
                    px={3.5}
                    borderRadius="full"
                    variant="ghost"
                    bg={isActive ? '#E07A5F' : 'transparent'}
                    color={isActive ? 'white' : '#C7C4BC'}
                    fontWeight={isActive ? '700' : '500'}
                    position="relative"
                    _hover={{
                      bg: isActive ? '#E07A5F' : 'whiteAlpha.100',
                      color: 'white',
                      zIndex: 1,
                      sx: {
                        animation: 'tiltBounce 0.15s ease forwards',
                      },
                    }}
                  >
                    Lista
                  </Button>
                )}
              </NavLink>

              <NavLink to="/calendar">
                {({ isActive }) => (
                  <Button
                    as="span"
                    size="xs"
                    h="30px"
                    px={3.5}
                    borderRadius="full"
                    variant="ghost"
                    bg={isActive ? '#E07A5F' : 'transparent'}
                    color={isActive ? 'white' : '#C7C4BC'}
                    fontWeight={isActive ? '700' : '500'}
                    position="relative"
                    _hover={{
                      bg: isActive ? '#E07A5F' : 'whiteAlpha.100',
                      color: 'white',
                      zIndex: 1,
                      sx: {
                        animation: 'tiltBounceAlt 0.15s ease forwards',
                      },
                    }}
                  >
                    Calendario
                  </Button>
                )}
              </NavLink>
            </HStack>
          </HStack>

          <Badge
            data-testid="pending-count"
            bg="#F2CC8F"
            color="#1E2421"
            fontSize="xs"
            fontWeight="800"
            px={3}
            py="3px"
            borderRadius="full"
            cursor="pointer"
            position="relative"
            _hover={{
              zIndex: 1,
              sx: {
                animation: 'jelly 0.6s linear infinite',
              },
            }}
          >
            Pendientes: {pendingCount}
          </Badge>
        </Flex>
      </Box>

      <Drawer isOpen={isOpen} placement="left" onClose={onClose} size="xs">
        <DrawerOverlay />
        <DrawerContent bg="#1E2421" color="#F5F3EE">
          <DrawerCloseButton color="#C7C4BC" _hover={{ color: 'white', bg: 'whiteAlpha.100' }} />
          <DrawerHeader borderBottomWidth="1px" borderColor="whiteAlpha.100" fontSize="md">
            Navegación
          </DrawerHeader>

          <DrawerBody py={5} display="flex" flexDirection="column" justifyContent="space-between">
            {navItems(onClose)}

            <Box
              bg="#29312D"
              borderWidth="1px"
              borderColor="whiteAlpha.200"
              borderTopLeftRadius="2xl"
              borderBottomRightRadius="2xl"
              borderTopRightRadius="md"
              borderBottomLeftRadius="md"
              p={3.5}
              mt={6}
            >
              <Text fontSize="10px" fontWeight="700" color="#A8A59E" textTransform="uppercase" letterSpacing="0.06em">
                En cola
              </Text>
              <Flex align="center" justify="space-between" mt={2} gap={2}>
                <Text fontSize="xs" color="#E5E2DC">
                  Por hacer / curso
                </Text>
                <Badge
                  bg="#F2CC8F"
                  color="#1E2421"
                  fontSize="xs"
                  fontWeight="800"
                  px={2.5}
                  py="2px"
                  borderRadius="full"
                >
                  {pendingCount}
                </Badge>
              </Flex>
            </Box>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}