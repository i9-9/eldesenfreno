'use client';

import React from 'react';
import { ToastProvider } from '../context/ToastContext';

export default function ToastProviderWrapper({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return <ToastProvider>{children}</ToastProvider>;
} 