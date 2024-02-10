import styles from './entry-banner.module.scss';
import type RecipeEntry from '@/types/recipe-entry';
import { SectionGroup, SectionWrap, Section, LayoutGrid, Col } from '@/components/layouts/layout-components';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

export default function EntryBanner(data: RecipeEntry) {
    const bannerClasses = cx(['entry-banner', 'section-group']);

    return (
        <header className={ bannerClasses }>
            <SectionWrap>
                <Section>
                    <h1>{ data.title }</h1>
                    <small className={ styles['amount'] }>
                        { data.recipeServes && (
                            `Serves: ${ data.recipeServes }`
                        ) }
                        { data.recipeMakes?.quantity && (
                            `Makes: ${ data.recipeMakes.quantity } ${ data.recipeMakes.unit }`
                        ) }
                    </small>
                </Section>
            </SectionWrap>
        </header>
    )
}