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
    <Box maxW="1100px" mx="auto" p={6}>
      <Flex justify="space-between" align="center" mb={5} wrap="wrap" gap={3}>
        <Heading size="lg" data-testid="month-title">
          {MONTH_NAMES[month]} {year}
        </Heading>
        <ButtonGroup size="sm" variant="outline">
          <Button onClick={() => goTo(-1)}>Mes anterior</Button>
          <Button onClick={goToday}>Hoy</Button>
          <Button onClick={() => goTo(1)}>Mes siguiente</Button>
        </ButtonGroup>
      </Flex>

      <Box overflowX="auto">
        <SimpleGrid columns={7} spacing="1px" bg="gray.200" borderWidth="1px" minW="700px">
          {WEEKDAYS.map((day) => (
            <Box key={day} bg="gray.100" p={2} textAlign="center" fontWeight="bold" fontSize="sm">
              {day}
            </Box>
          ))}

          {cells.map((day, index) => {
            if (day === null) return <Box key={`blank-${index}`} bg="gray.50" minH="100px" />;
            const iso = toISODate(new Date(year, month, day));
            const dayTasks = tasksByDate[iso] ?? [];
            return (
              <Box
                key={iso}
                data-testid={`day-${iso}`}
                bg={iso === todayISO ? 'teal.50' : 'white'}
                minH="100px"
                p={1}
              >
                <Text fontSize="sm" fontWeight={iso === todayISO ? 'bold' : 'normal'} color={iso === todayISO ? 'teal.700' : 'gray.600'}>
                  {day}
                </Text>
                {dayTasks.map((task) => (
                  <Box
                    key={task.id}
                    mt={1}
                    px={1}
                    py="2px"
                    borderRadius="sm"
                    fontSize="xs"
                    bg={`${STATUS_COLORS[task.status]}.100`}
                    noOfLines={2}
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
  );
}
