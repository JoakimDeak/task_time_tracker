import {useEffect, useState, useCallback, useRef} from 'react';

export const useStateWithCallback = <T>(initialState: T) => {
  const [state, setState] = useState(initialState);
  let cb = useRef<((newState: T) => void) | null>(null);
  
  const setStateWithCallback = useCallback((newState: T, callback?: (newState: T) => void) => {
    setState(newState);
    if(callback){
      cb.current = callback;
    }
  }, []);

  useEffect(() => {
    if(cb.current){
      cb.current(state);
      cb.current = null;
    }
  }, [state, cb]);

  return [state, setStateWithCallback] as const;
}