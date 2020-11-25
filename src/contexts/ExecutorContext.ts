import {createContext} from 'react';
import {FirstStepType, ExecutorUpdatedType} from '../hooks/useExecutor';

export const ExecutorContext = createContext({
  firstStepFinish: false,
  loading: false,
  saveFirstStep: ({}: FirstStepType) => {},
  createNewExecutor: async (): Promise<void> => {},
  add: (item: string, key: 'images' | 'serviceTypes'): void => {},
  change: (item: string, key: string): void => {},
  deleteExe: (item: string, key: 'images' | 'serviceTypes'): void => {},
  toFirstStep: (): void => {},
  getAll: async (): Promise<void> => {},
  executors: [] as ExecutorUpdatedType[],
  executor: {
    name: '',
    description: '',
    type: '',
    images: [] as string[],
    serviceTypes: [] as string[],
  },
});
