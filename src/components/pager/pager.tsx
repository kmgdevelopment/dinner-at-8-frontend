import styles from './pager.module.scss';
import classNames from 'classnames/bind';
interface Pager {
    entryCount: number,
    limit: number,
    offset: number,
    loading: boolean,
    viewRef: () => void
}

const cx = classNames.bind(styles);

export default function Pager(data: Pager) {
    const totalPages = Math.ceil( data.entryCount / data.limit );
    const currentPage = (data.offset / data.limit) + 1;

    // hide if the next page is currently being fetched
    // or if we've reached the last page
    const pagerClasses = cx({
        "pager": true,
        "invisible": data.loading || currentPage == totalPages
    });
    
    return (
        <>
            {totalPages > 1 && (
                <nav 
                    className={ pagerClasses }
                    ref={ data.viewRef }
                >   
                    <div className={ styles['pages'] }>
                        <p>Page {currentPage} of {totalPages}</p>
                    </div>
                    
                </nav>
            )}
        </>
    )
}