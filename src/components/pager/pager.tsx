import styles from './pager.module.scss';
import PagerMeta from '@/types/pager-meta';
import classNames from 'classnames/bind';
import Link from 'next/link';

const cx = classNames.bind(styles);

interface Pager {
    pagerData: PagerMeta,
    hasNextPage: boolean,
    isFetchingNextPage: boolean,
    fetchNextPage: () => void,
    viewRef: () => void
}

export default function Pager(data: Pager) {
    const pagerData = data.pagerData;
    const prevPage = pagerData.links?.previous ? pagerData.current_page - 1 : null;
    const nextPage = pagerData.links?.next ? pagerData.current_page + 1 : null;

    // hide if the next page is currently being fetched
    // or if we've reached the last page
    const pagerClasses = cx({
        "pager": true,
        "invisible": data.isFetchingNextPage || !data.hasNextPage
    });
    
    return (
        <>
            {pagerData.total_pages > 1 && (
                <nav 
                    className={ pagerClasses }
                    ref={ data.viewRef }
                >
                    <div className={ styles['prev'] }>
                        { pagerData.links?.previous && (
                            <Link
                                href={`/?page=${prevPage}`}
                            >
                                &lt; Prev
                            </Link>
                        )}
                    </div>
                    
                    <div className={ styles['pages'] }>
                        <p>Page {pagerData.current_page} of {pagerData.total_pages}</p>
                    </div>
                    
                    <div className={ styles['next'] }>
                        { pagerData.links?.next && (
                            <Link 
                                href={`/?page=${nextPage}`}
                                onClick={ () => data.fetchNextPage() }
                            >
                                Next &gt;
                            </Link>
                        )}
                    </div>
                </nav>
            )}
        </>
    )
}