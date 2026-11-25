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
    <Box as="form" onSubmit={handleSubmit} noValidate p={5} borderWidth="1px" borderRadius="lg" bg="white">
      <Stack spacing={4}>
        <FormControl isInvalid={Boolean(errors.title)}>
          <FormLabel>Título</FormLabel>
          <Input value={values.title} onChange={handleChange('title')} placeholder="Ej: Entregar tarea de matemáticas" />
          <FormErrorMessage>{errors.title}</FormErrorMessage>
        </FormControl>

        <FormControl>
          <FormLabel>Descripción</FormLabel>
          <Textarea value={values.description} onChange={handleChange('description')} rows={3} />
        </FormControl>

        <HStack spacing={4} align="flex-start" wrap="wrap">
          <FormControl isInvalid={Boolean(errors.dueDate)} flex="1" minW="180px">
            <FormLabel>Fecha límite</FormLabel>
            <Input type="date" value={values.dueDate} onChange={handleChange('dueDate')} />
            <FormErrorMessage>{errors.dueDate}</FormErrorMessage>
          </FormControl>

          <FormControl flex="1" minW="180px">
            <FormLabel>Estado</FormLabel>
            <Select value={values.status} onChange={handleChange('status')}>
              {Object.entries(STATUS_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </Select>
          </FormControl>

          <FormControl flex="1" minW="180px">
            <FormLabel>Prioridad</FormLabel>
            <Select value={values.priority} onChange={handleChange('priority')}>
              {Object.entries(PRIORITY_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </Select>
          </FormControl>
        </HStack>

        <HStack justify="flex-end">
          {onCancel && (
            <Button variant="ghost" onClick={onCancel}>Cancelar</Button>
          )}
          <Button type="submit" colorScheme="teal">
            {isEditing ? 'Guardar cambios' : 'Crear tarea'}
          </Button>
        </HStack>
      </Stack>
    </Box>
  );
}
