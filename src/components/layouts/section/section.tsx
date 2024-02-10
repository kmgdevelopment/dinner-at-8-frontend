import style from './section.module.scss'

interface Section {
    children: React.ReactNode;
    contentWrap?: boolean;
}

export default function Section({ children, contentWrap = true }: Section) {
    return (
        <div className={style['section']}>
            <WrapSection contentWrap={contentWrap}>
                {children}
            </WrapSection>
        </div>
    )
}

const WrapSection = ({children, contentWrap}: Section) => {
    if(contentWrap) {
        return (
            <div className={style['gutter']}>
                <div className={style['container']}>
                    <div className={style['content']}>
                        {children}
                    </div>
                </div>
            </div>
        )
    }

    return children;
}