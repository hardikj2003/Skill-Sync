import React from "react";

const variants = {
  solid:
    "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500",
  outline:
    "border border-indigo-600 text-indigo-600 hover:bg-indigo-100 focus:ring-indigo-500",
  ghost: "text-slate-800 hover:bg-slate-100 focus:ring-indigo-500",
};

type ButtonProps = React.ComponentProps<"button"> & {
  variant?: keyof typeof variants;
};

const Button = ({
  children,
  variant = "solid",
  className,
  ...props
}: ButtonProps) => {
  const variantClasses = variants[variant];
  return (
    <button
      {...props}
      className={`w-full flex justify-center py-2 px-4 rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${variantClasses} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;