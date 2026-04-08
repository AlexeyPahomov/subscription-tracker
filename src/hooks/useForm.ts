import {
  useCallback,
  useState,
  type ChangeEvent,
  type Dispatch,
  type SetStateAction,
} from 'react';

export type FormChangeEvent = ChangeEvent<
  HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
>;

export function useForm<T extends Record<string, string> = Record<string, string>>(
  inputValues: T = {} as T,
): {
  values: T;
  handleChange: (event: FormChangeEvent) => void;
  setValues: Dispatch<SetStateAction<T>>;
} {
  const [values, setValues] = useState<T>(inputValues);

  const handleChange = useCallback((event: FormChangeEvent) => {
    const { value, name } = event.target;
    if (!name) return;
    setValues((prev) => ({ ...prev, [name]: value }) as T);
  }, []);

  return { values, handleChange, setValues };
}
