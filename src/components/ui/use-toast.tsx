import * as React from 'react';
import { nanoid } from 'nanoid';

import type { ToastProps } from '@radix-ui/react-toast';
import type { ToastActionElement } from './use-toast.types';
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from './toast';

// Extend ToastProps to include custom variant support
type ToasterToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
  variant?: 'default' | 'success' | 'warning' | 'destructive';
};

const TOAST_REMOVE_DELAY = 4000;

export type Toast = ToasterToast;

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return;
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({
      type: 'REMOVE_TOAST',
      toastId,
    });
  }, TOAST_REMOVE_DELAY);

  toastTimeouts.set(toastId, timeout);
};

type Action =
  | {
      type: 'ADD_TOAST';
      toast: ToasterToast;
    }
  | {
      type: 'UPDATE_TOAST';
      toast: Partial<ToasterToast>;
    }
  | {
      type: 'DISMISS_TOAST';
      toastId?: string;
    }
  | {
      type: 'REMOVE_TOAST';
      toastId?: string;
    };

interface State {
  toasts: ToasterToast[];
}

const TOAST_LIMIT = 5;

const toastTimeoutReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'ADD_TOAST':
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };
    case 'UPDATE_TOAST':
      return {
        ...state,
        toasts: state.toasts.map((toast) =>
          toast.id === action.toast.id ? { ...toast, ...action.toast } : toast,
        ),
      };
    case 'DISMISS_TOAST': {
      const { toastId } = action;

      if (toastId) {
        addToRemoveQueue(toastId);
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id);
        });
      }

      return {
        ...state,
        toasts: state.toasts.map((toast) =>
          toast.id === toastId || toastId === undefined
            ? {
                ...toast,
                open: false,
              }
            : toast,
        ),
      };
    }
    case 'REMOVE_TOAST':
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        };
      }

      return {
        ...state,
        toasts: state.toasts.filter((toast) => toast.id !== action.toastId),
      };
    default:
      return state;
  }
};

const listeners: Array<(state: State) => void> = [];

let memoryState: State = { toasts: [] };

function dispatch(action: Action) {
  memoryState = toastTimeoutReducer(memoryState, action);
  listeners.forEach((listener) => listener(memoryState));
}

export function toast(props: Omit<ToasterToast, 'id'>) {
  const id = nanoid();

  const update = (props: ToasterToast) => {
    dispatch({
      type: 'UPDATE_TOAST',
      toast: { ...props, id },
    });
  };

  const dismiss = () => {
    dispatch({ type: 'DISMISS_TOAST', toastId: id });
  };

  dispatch({
    type: 'ADD_TOAST',
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss();
      },
    },
  });

  return {
    id,
    dismiss,
    update,
  };
}

export function useToast() {
  const [state, setState] = React.useState<State>(memoryState);

  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) listeners.splice(index, 1);
    };
  }, [state]);

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: 'DISMISS_TOAST', toastId }),
  };
}

type ToasterProps = React.ComponentProps<typeof ToastProvider>;

export function Toaster({ ...props }: ToasterProps) {
  const { toasts } = useToast();

  return (
    <ToastProvider swipeDirection="right" {...props}>
      {toasts.map(({ id, title, description, action, ...toastProps }) => (
        <Toast key={id} {...toastProps}>
          <div className="grid gap-1">
            {title && <ToastTitle>{title}</ToastTitle>}
            {description && <ToastDescription>{description}</ToastDescription>}
          </div>
          {action}
          <ToastClose />
        </Toast>
      ))}
      <ToastViewport />
    </ToastProvider>
  );
}
