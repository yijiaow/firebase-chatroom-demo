import ReactDOM from 'react-dom';
import { useState, useEffect, useRef } from 'react';

interface PortalProps {
  children: React.ReactNode;
  toggleModal?: () => void;
}

const Portal: React.FC<PortalProps> = ({ children, toggleModal }) => {
  const containerEl = useRef<HTMLDivElement | undefined>();

  useEffect(() => {
    const root: HTMLElement | null = document.getElementById('modal-root');
    const el: HTMLDivElement = document.createElement('div');

    containerEl.current = el;
    root?.appendChild(el);

    return () => {
      root && el && root.removeChild(el);
    };
  }, []);

  return (
    (containerEl.current &&
      ReactDOM.createPortal(children, containerEl.current)) ||
    null
  );
};

const Modal: React.FC<any> = ({ children, activator }) => {
  const [open, setOpen] = useState<boolean>(false);

  const openModal = () => setOpen(true);

  const closeModal = () => setOpen(false);

  return (
    <>
      {activator({ openModal })}
      <Portal>
        {open && (
          <div
            id="modal-overlay"
            onClick={(e) => {
              if (e.target.id === 'modal-overlay') {
                setOpen(false);
              }
            }}
            role="button"
            aria-label="Overlay"
            className="fixed inset-0 flex justify-center items-center bg-gray-400 dark:bg-coolDark-800 dark:text-white"
          >
            <div className="absolute inset-1/2 bg-gray-200 dark:bg-coolDark-600">
              {children({ closeModal })}
            </div>
          </div>
        )}
      </Portal>
    </>
  );
};

export default Modal;
