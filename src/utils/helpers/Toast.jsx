import { toast } from 'react-hot-toast';

const Toast = (
  message,
  type = 'success',
  displayIcon = false,
  options = {
    duration: 3000,
    position: 'top-right',
    showProgressBar: true,
    customCloseButton: null,
    customIcon: null,
    theme: 'light'
  }
) => {
  const defaultOptions = {
    duration: options.duration || 5000,
    position: options.position || 'top-right',
    style: {},
    icon: options.customIcon,
    ariaProps: {
      role: 'status',
      'aria-live': 'polite'
    },
    onClose: options.onClose || (() => {}),
    theme: options.theme || 'light'
  };
  const baseToastOptions = {
    ...defaultOptions,
    style: {
      ...defaultOptions.style,
      ...options.style
    },
    icon: options.customIcon,
    duration: options.duration,
    position: options.position,
    closeButton: options.customCloseButton || true,
    className: options.className || '',
    ariaProps: defaultOptions.ariaProps
  };
  switch (type) {
    case 'success':
      toast.success(message, {
        ...baseToastOptions,
        style: {
          ...baseToastOptions.style,
          backgroundColor: '#fff'
        },
        icon: options.customIcon || (displayIcon && '✔️')
      });
      break;
    case 'error':
      toast.error(message, {
        ...baseToastOptions,
        style: {
          ...baseToastOptions.style,
          backgroundColor: '#fff',
          color: '#dc3545'
        },
        icon: options.customIcon || (displayIcon && '❌')
      });
      break;
    case 'info':
      toast(message, {
        ...baseToastOptions,
        style: {
          ...baseToastOptions.style,
          backgroundColor: '#fff'
        },
        icon: options.customIcon || (displayIcon && 'ℹ️')
      });
      break;
    case 'warning':
      toast(message, {
        ...baseToastOptions,
        style: {
          ...baseToastOptions.style,
          backgroundColor: '#fff'
        },
        icon: options.customIcon || (displayIcon && '⚠️')
      });
      break;
    case 'custom':
      toast(message, {
        ...baseToastOptions,
        style: {
          ...baseToastOptions.style,
          backgroundColor: '#fff'
        },
        icon: options.customIcon || (displayIcon && '🔔')
      });
      break;
    default:
      toast(message, baseToastOptions);
      break;
  }
};

export default Toast;
