import { Backdrop } from '@mui/material';
import Image from 'next/image';

import styles from './styles.module.css';
/**
 *
 * @param param boolean used to show loader
 * @returns blurry screen to indicate ongoing request
 */
export default function Loader({ loading }: { loading: boolean }) {
  return (
    <Backdrop sx={{ zIndex: 100000 }} open={loading}>
      <Image
        src='/TBO.svg'
        alt='loading...'
        width='300'
        height='300'
        className={styles.colorChange}
      />
    </Backdrop>
  );
}
