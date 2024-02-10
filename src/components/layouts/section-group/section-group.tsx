import { PropsWithChildren } from "react";
import style from './section-group.module.scss';

export default function SectionGroup({ children }: { children: React.ReactNode }) {
    return (
        <div className={style['section-group']}>
            { children }
        </div>
    )
}