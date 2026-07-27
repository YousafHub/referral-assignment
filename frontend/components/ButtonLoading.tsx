import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { FaSpinner } from 'react-icons/fa';
import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonLoadingProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  type?: 'button' | 'submit' | 'reset';
  text: string | ReactNode;
  loading: boolean;
  className?: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  onClick?: () => void;
  loadingText?: string;
  children?: ReactNode;
}

const ButtonLoading = ({
  type = 'submit',
  text,
  loading,
  className,
  onClick,
  variant = 'default',
  size = 'default',
  loadingText,
  children,
  ...props
}: ButtonLoadingProps) => {
  return (
    <Button
      type={type}
      disabled={loading}
      onClick={onClick}
      variant={variant}
      size={size}
      className={cn('gap-2', className)}
      {...props}
    >
      {loading && <FaSpinner className="animate-spin h-4 w-4" />}
      {loading && loadingText ? loadingText : text}
      {children}
    </Button>
  );
};

export default ButtonLoading;