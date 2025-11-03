import type React from 'react';
import type * as ToastPrimitives from '@radix-ui/react-toast';

export type ToastActionElement = React.ReactElement<
  typeof ToastPrimitives.Action,
  string | React.JSXElementConstructor<ToastPrimitives.ToastActionProps>
>;
