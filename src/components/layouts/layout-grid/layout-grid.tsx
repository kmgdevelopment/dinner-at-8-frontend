import { PropsWithChildren } from "react";
import style from './layout-grid.module.scss'

interface LayoutProps {
    colCount?: number,
    stretch?: boolean
}

export default function LayoutGrid(props: PropsWithChildren<LayoutProps>) {
    // base CSS class by default
    let classes = [style['layout-grid']];

    // add column numbers if present
    if(props.colCount) {
        classes.push(style['cols-' + props.colCount]);
    }

    // add stretch class if present
    if(props.stretch) {
        classes.push(style['stretch']);
    }

    const classList = classes.join(' ');

    return (
        <div className={classList}>
            { props.children }
        </div>
    )
}