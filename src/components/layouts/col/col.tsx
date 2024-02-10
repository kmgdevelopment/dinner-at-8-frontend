import style from './col.module.scss'

export default function Col({ children }: { children: React.ReactNode }) {
    return (
        <div className={style['col']}>
            { children }
        </div>
    )
}