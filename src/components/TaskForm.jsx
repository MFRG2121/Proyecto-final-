import { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  Select,
  SimpleGrid,
  Stack,
  Textarea,
} from '@chakra-ui/react';
import { PRIORITY_LABELS, STATUS_LABELS } from '../utils/constants';

const EMPTY = {
  title: '',
  description: '',
  status: 'todo',
  dueDate: '',
  priority: 'medium',
};

function validate(values) {
  const errors = {};
  if (values.title.trim().length < 3) {
    errors.title = 'El título debe tener al menos 3 caracteres.';
  }
  if (!values.dueDate) {
    errors.dueDate = 'La fecha límite es obligatoria.';
  }
  return errors;
}

// Formulario reutilizable: si recibe `task` funciona en modo edición,
// de lo contrario crea una tarea nueva. Se resetea cambiando su `key`.
export default function TaskForm({ task, onSubmit, onCancel }) {
  const isEditing = Boolean(task);
  const [values, setValues] = useState(
    task
      ? {
          title: task.title,
          description: task.description ?? '',
          status: task.status,
          dueDate: task.dueDate,
          priority: task.priority,
        }
      : EMPTY
  );
  const [errors, setErrors] = useState({});

  const handleChange = (field) => (event) => {
    setValues((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    onSubmit({
      ...values,
      title: values.title.trim(),
      description: values.description.trim(),
    });
  };

  return (
    <Box
      as="form"
      onSubmit={handleSubmit}
      noValidate
      p={5}
      borderWidth="1px"
      borderColor="#E6DFD3"
      borderTopLeftRadius="2xl"
      borderBottomRightRadius="2xl"
      borderTopRightRadius="lg"
      borderBottomLeftRadius="lg"
      bg="white"
      boxShadow="0 6px 20px rgba(30, 36, 33, 0.05)"
    >
      <Stack spacing={3.5}>
        <FormControl isInvalid={Boolean(errors.title)}>
          <FormLabel fontSize="xs" fontWeight="700" color="#3D4440">
            Título
          </FormLabel>
          <Input
            size="sm"
            value={values.title}
            onChange={handleChange('title')}
            placeholder="Ej: Entregar tarea de matemáticas"
            bg="#FAF7F2"
            borderColor="#E6DFD3"
            _hover={{ borderColor: '#D2C8B8' }}
            _focus={{ bg: 'white', borderColor: '#E07A5F', boxShadow: '0 0 0 1px #E07A5F' }}
            borderRadius="xl"
          />
          <FormErrorMessage fontSize="xs">{errors.title}</FormErrorMessage>
        </FormControl>

        <FormControl>
          <FormLabel fontSize="xs" fontWeight="700" color="#3D4440">
            Descripción
          </FormLabel>
          <Textarea
            size="sm"
            value={values.description}
            onChange={handleChange('description')}
            rows={2}
            placeholder="Detalles breves..."
            bg="#FAF7F2"
            borderColor="#E6DFD3"
            _hover={{ borderColor: '#D2C8B8' }}
            _focus={{ bg: 'white', borderColor: '#E07A5F', boxShadow: '0 0 0 1px #E07A5F' }}
            borderRadius="xl"
          />
        </FormControl>

        <SimpleGrid columns={{ base: 1, sm: 3 }} spacing={3}>
          <FormControl isInvalid={Boolean(errors.dueDate)}>
            <FormLabel fontSize="xs" fontWeight="700" color="#3D4440">
              Fecha límite
            </FormLabel>
            <Input
              size="sm"
              type="date"
              value={values.dueDate}
              onChange={handleChange('dueDate')}
              bg="#FAF7F2"
              borderColor="#E6DFD3"
              _hover={{ borderColor: '#D2C8B8' }}
              _focus={{ bg: 'white', borderColor: '#E07A5F', boxShadow: '0 0 0 1px #E07A5F' }}
              borderRadius="xl"
            />
            <FormErrorMessage fontSize="xs">{errors.dueDate}</FormErrorMessage>
          </FormControl>

          <FormControl>
            <FormLabel fontSize="xs" fontWeight="700" color="#3D4440">
              Estado
            </FormLabel>
            <Select
              size="sm"
              value={values.status}
              onChange={handleChange('status')}
              bg="#FAF7F2"
              borderColor="#E6DFD3"
              _hover={{ borderColor: '#D2C8B8' }}
              _focus={{ bg: 'white', borderColor: '#E07A5F' }}
              borderRadius="xl"
            >
              {Object.entries(STATUS_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel fontSize="xs" fontWeight="700" color="#3D4440">
              Prioridad
            </FormLabel>
            <Select
              size="sm"
              value={values.priority}
              onChange={handleChange('priority')}
              bg="#FAF7F2"
              borderColor="#E6DFD3"
              _hover={{ borderColor: '#D2C8B8' }}
              _focus={{ bg: 'white', borderColor: '#E07A5F' }}
              borderRadius="xl"
            >
              {Object.entries(PRIORITY_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </Select>
          </FormControl>
        </SimpleGrid>

        <HStack justify="flex-end" pt={1.5} spacing={2}>
          {onCancel && (
            <Button variant="ghost" size="sm" borderRadius="full" color="#5C635F" onClick={onCancel}>
              Cancelar
            </Button>
          )}
          <Button
            type="submit"
            bg="#1E2421"
            color="white"
            _hover={{ bg: '#E07A5F' }}
            size="sm"
            px={5}
            borderRadius="full"
            fontWeight="700"
          >
            {isEditing ? 'Guardar cambios' : 'Crear tarea'}
          </Button>
        </HStack>
      </Stack>
    </Box>
  );
}