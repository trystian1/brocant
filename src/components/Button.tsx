type ButtonProps = {
    label: string;
  } & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = ({ label, ...props } : ButtonProps ) => {
    return  <button className="buy-button mt-4 mr-4" {...props}>
      {label}
  </button>
}