export const stepVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
};

export const buttonVariants = {
  hover: {
    scale: 1.03,
    boxShadow: "0 0 15px rgba(251, 191, 36, 0.4)",
    transition: { duration: 0.2 }
  },
  tap: { scale: 0.97 }
};

export const backButtonVariants = {
    hover: { scale: 1.1, color: "#fef3c7" }, // amber-100
    tap: { scale: 0.9 }
};
