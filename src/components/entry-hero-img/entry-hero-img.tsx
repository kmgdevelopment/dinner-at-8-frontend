import styles from './entry-hero-img.module.scss';
import type RecipeEntry from '@/types/recipe-entry';
import Image from "next/image"

export default function EntryHeroImg(data: RecipeEntry) {
    return (
        <div className={ styles['entry-hero-img'] }>
            <Image 
                width={600}
                height={200}
                alt={ data.title }
                src={ data.recipeImg }
                sizes="(min-width: 1061px) 1000px, 94vw"
                priority={true}
            />
        </div>
    )
}
