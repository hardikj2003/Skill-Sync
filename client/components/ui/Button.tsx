// In client/components/ui/Button.tsx

import React from 'react';

type ButtonProps = React.ComponentProps<'button'>;

const Button = ({ children, ...props }: ButtonProps) => {
  return (
    <button
      {...props}
      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300"
    >
      {children}
    </button>
  );
};

export default Button;