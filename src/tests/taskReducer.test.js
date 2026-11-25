import { taskReducer } from '../context/TaskContext';

const deepFreeze = (obj) => {
  Object.values(obj).forEach((v) => typeof v === 'object' && v !== null && deepFreeze(v));
  return Object.freeze(obj);
};

const baseState = () =>
  deepFreeze([
    { id: '1', title: 'Primera', description: '', status: 'todo', dueDate: '2025-01-10', priority: 'low' },
    { id: '2', title: 'Segunda', description: '', status: 'in_progress', dueDate: '2025-01-11', priority: 'high' },
  ]);

describe('taskReducer', () => {
  test('ADD_TASK agrega una tarea sin mutar el estado anterior', () => {
    const state = baseState();
    const newTask = { id: '3', title: 'Tercera', description: '', status: 'todo', dueDate: '2025-01-12', priority: 'medium' };
    const next = taskReducer(state, { type: 'ADD_TASK', payload: newTask });
    expect(next).toHaveLength(3);
    expect(next[2]).toEqual(newTask);
    expect(state).toHaveLength(2);
    expect(next).not.toBe(state);
  });

  test('UPDATE_TASK edita los campos de la tarea indicada', () => {
    const state = baseState();
    const next = taskReducer(state, { type: 'UPDATE_TASK', payload: { id: '1', title: 'Editada', priority: 'high' } });
    expect(next[0]).toMatchObject({ id: '1', title: 'Editada', priority: 'high', status: 'todo' });
    expect(next[1]).toBe(state[1]);
    expect(state[0].title).toBe('Primera');
  });

  test('DELETE_TASK elimina la tarea por id', () => {
    const state = baseState();
    const next = taskReducer(state, { type: 'DELETE_TASK', payload: '1' });
    expect(next).toHaveLength(1);
    expect(next[0].id).toBe('2');
    expect(state).toHaveLength(2);
  });

  test('CHANGE_STATUS actualiza únicamente el estado', () => {
    const state = baseState();
    const next = taskReducer(state, { type: 'CHANGE_STATUS', payload: { id: '2', status: 'completed' } });
    expect(next[1]).toEqual({ ...state[1], status: 'completed' });
    expect(next[0]).toBe(state[0]);
    expect(state[1].status).toBe('in_progress');
  });

  test('una acción desconocida devuelve el mismo estado', () => {
    const state = baseState();
    expect(taskReducer(state, { type: 'OTRA' })).toBe(state);
  });
});
