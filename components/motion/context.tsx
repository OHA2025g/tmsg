'use client';

import {createContext, useContext} from 'react';

export const MotionOn = createContext(false);

export function useMotionOn() {
  return useContext(MotionOn);
}
