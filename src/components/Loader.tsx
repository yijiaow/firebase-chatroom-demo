type LoaderVariant = 'primary' | 'secondary' | 'white';

type LoaderSize = 'sm' | 'default' | 'lg';

interface LoaderProps {
  variant: LoaderVariant;
  size: LoaderSize;
}

const Loader: React.FC<LoaderProps> = ({ variant, size }) => {
  const variantClass =
    variant === 'white' ? 'border-t-white' : `border-t-${variant}-500`;
  const sizeClass =
    (size === 'sm' && 'w-6 h-6 border-2') ||
    (size === 'default' && 'w-8 h-8 border-4') ||
    (size === 'lg' && 'w-12 h-12 border-4');

  return (
    <div
      className={`rounded-full border-gray-500 border-opacity-25 animate-spin ${variantClass} ${sizeClass}`}
    />
  );
};

export default Loader;
