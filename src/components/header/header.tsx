import Link from 'next/link';
import { globalConfig } from '@/global-config';
import styles from './header.module.scss';

export default function Header() {
    return (
        <header className={styles['global-header']}>
            <div className={styles['gutter']}>
                <div className={styles['container']}>
                    <div className={styles['content']}>
                        <Link href="/" className={styles['logo']}>{ globalConfig.siteName }</Link>
                    </div>
                </div>
            </div>
        </header>
    )
}