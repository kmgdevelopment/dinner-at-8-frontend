import styles from './entry-footer.module.scss';
import type RecipeEntry from "@/types/recipe-entry";
import { SectionWrap, Section } from '@/components/layouts/layout-components';
import Link from 'next/link';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

export default function EntryFooter(data: RecipeEntry) {

    const footerClasses = cx(['entry-footer', 'section-group']);

    return (
        <footer className={ footerClasses }>
            <SectionWrap>
                <Section>
                    { data.recipeSourceName && (
                        <p>
                            Source:&nbsp;
                            { data.recipeSourceUrl && data.recipeSourceName 
                                ? <Link href={data.recipeSourceUrl}>{ data.recipeSourceName }</Link>
                                : data.recipeSourceName
                            }
                        </p>
                    )}
                </Section>
            </SectionWrap>
        </footer>
    )
}