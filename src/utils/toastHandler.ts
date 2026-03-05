let toastFunction: ((title: string, message: string, type?: any, duration?: number) => void) | null = null;

export const setToastHandler = (toastRef: typeof toastFunction) => {
  toastFunction = toastRef;
};

export const getToastHandler = () => toastFunction;