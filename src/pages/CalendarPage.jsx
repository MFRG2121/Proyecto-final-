import { useMemo, useState } from 'react';
import { Box, Button, ButtonGroup, Flex, Heading, SimpleGrid, Text } from '@chakra-ui/react';
import { useTasks } from '../context/TaskContext';
import { MONTH_NAMES, STATUS_COLORS, WEEKDAYS } from '../utils/constants';
import { toISODate } from '../utils/dates';

// `initialDate` permite fijar el mes inicial (útil para pruebas).
export default function CalendarPage({ initialDate }) {
  const { tasks } = useTasks();
  const [current, setCurrent] = useState(() => {
    const base = initialDate ?? new Date();
    return new Date(base.getFullYear(), base.getMonth(), 1);
  });

  const year = current.getFullYear();
  const month = current.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  // Semana que inicia en lunes: getDay() => 0 (domingo) ... 6 (sábado)
  const offset = (new Date(year, month, 1).getDay() + 6) % 7;

  const tasksByDate = useMemo(() => {
    const map = {};
    tasks.forEach((task) => {
      (map[task.dueDate] ||= []).push(task);
    });
    return map;
  }, [tasks]);

  const cells = [
    ...Array(offset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const todayISO = toISODate(new Date());
  const goTo = (delta) => setCurrent(new Date(year, month + delta, 1));
  const goToday = () => {
    const now = new Date();
    setCurrent(new Date(now.getFullYear(), now.getMonth(), 1));
  };

  return (
    <Box bg="#FAF7F2" flex="1" minH="100vh" alignSelf="stretch">
      <Box maxW="1440px" w="full" mx="auto" px={{ base: 4, md: 6 }} pt={5} pb={8}>
        <Flex
          justify="space-between"
          align="center"
          mb={6}
          pb={4}
          borderBottom="1px solid"
          borderColor="#E6DFD3"
          wrap="wrap"
          gap={3}
        >
          <Heading size="lg" fontWeight="800" color="#1E2421" letterSpacing="-0.02em" data-testid="month-title">
            {MONTH_NAMES[month]} {year}
          </Heading>
          <ButtonGroup size="sm" isAttached bg="white" borderRadius="full" borderWidth="1px" borderColor="#E6DFD3" p="2px">
            <Button
              variant="ghost"
              color="#3D4440"
              borderRadius="full"
              fontSize="xs"
              fontWeight="600"
              _hover={{ bg: '#FAF7F2' }}
              onClick={() => goTo(-1)}
            >
              Mes anterior
            </Button>
            <Button
              variant="ghost"
              bg="#E07A5F"
              color="white"
              borderRadius="full"
              fontSize="xs"
              fontWeight="700"
              _hover={{ bg: '#C9654B' }}
              onClick={goToday}
            >
              Hoy
            </Button>
            <Button
              variant="ghost"
              color="#3D4440"
              borderRadius="full"
              fontSize="xs"
              fontWeight="600"
              _hover={{ bg: '#FAF7F2' }}
              onClick={() => goTo(1)}
            >
              Mes siguiente
            </Button>
          </ButtonGroup>
        </Flex>

        <Box
          overflowX="auto"
          bg="white"
          borderWidth="1px"
          borderColor="#E6DFD3"
          borderTopLeftRadius="2xl"
          borderBottomRightRadius="2xl"
          borderTopRightRadius="lg"
          borderBottomLeftRadius="lg"
          boxShadow="0 2px 10px rgba(30, 36, 33, 0.04)"
          p={3}
        >
          <SimpleGrid
            columns={7}
            spacing="4px"
            bg="#FAF7F2"
            borderRadius="xl"
            p="4px"
            minW="680px"
          >
            {WEEKDAYS.map((day) => (
              <Box
                key={day}
                bg="transparent"
                py={2}
                px={2}
                textAlign="center"
                fontWeight="700"
                fontSize="11px"
                color="#5C635F"
                textTransform="uppercase"
                letterSpacing="0.06em"
              >
                {day}
              </Box>
            ))}

            {cells.map((day, index) => {
              if (day === null) {
                return <Box key={`blank-${index}`} bg="#F3EFE8" borderRadius="lg" minH="102px" p={2} />;
              }
              const iso = toISODate(new Date(year, month, day));
              const isToday = iso === todayISO;
              const dayTasks = tasksByDate[iso] ?? [];
              return (
                <Box
                  key={iso}
                  data-testid={`day-${iso}`}
                  bg={isToday ? '#FFF3EE' : 'white'}
                  borderWidth="1px"
                  borderColor={isToday ? '#E07A5F' : '#ECE6DC'}
                  borderRadius="lg"
                  minH="102px"
                  p={1.5}
                >
                  <Flex justify="flex-end" mb={1}>
                    <Text
                      fontSize="xs"
                      fontWeight={isToday ? '800' : '600'}
                      color={isToday ? 'white' : '#3D4440'}
                      bg={isToday ? '#E07A5F' : 'transparent'}
                      w="22px"
                      h="22px"
                      borderRadius="full"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      {day}
                    </Text>
                  </Flex>
                  {dayTasks.map((task) => (
                    <Box
                      key={task.id}
                      mt={1}
                      px={2}
                      py="2px"
                      borderRadius="full"
                      fontSize="11px"
                      fontWeight="700"
                      bg={`${STATUS_COLORS[task.status]}.100`}
                      color={`${STATUS_COLORS[task.status]}.800`}
                      noOfLines={1}
                    >
                      {task.title}
                    </Box>
                  ))}
                </Box>
              );
            })}
          </SimpleGrid>
        </Box>
      </Box>
    </Box>
  );
}