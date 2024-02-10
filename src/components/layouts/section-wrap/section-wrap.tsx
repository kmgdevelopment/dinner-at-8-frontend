import styles from './section-wrap.module.scss';

export default function SectionWrap({ children }: { children: React.ReactNode }) {
    return (
        <div className={styles['section-wrap']}>
            { children }
        </div>
    )
}