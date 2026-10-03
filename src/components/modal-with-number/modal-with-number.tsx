import { Modal } from '@components';
import { useParams } from 'react-router-dom';

import type { TModalWithNumberProps } from './type';

export const ModalWithNumber = ({
  onClose,
  children,
}: TModalWithNumberProps): React.JSX.Element => {
  const { number } = useParams();

  return (
    <Modal title={`#${number ?? ''}`} onClose={onClose}>
      {children}
    </Modal>
  );
};
