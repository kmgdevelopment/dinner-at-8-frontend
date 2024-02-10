import styles from './recipe-card.module.scss'
import Link from "next/link"
import Image from "next/image"
import RecipeListing from "@/types/recipe-listing"

export default function RecipeCard({ entryData }: { entryData: RecipeListing }) {
    return (
        <div className={ styles['recipe-card'] }>
            <Link href={ `/${entryData.uri}` }>
                <div className={ styles['media'] }>
                    <Image 
                        width={313}
                        height={200}
                        alt={ entryData.title }
                        src={ entryData.recipeImg ? entryData.recipeImg : '/assets/img/recipe-default.jpg' }
                    />
                </div>
                <div className={ styles['text'] }>
                    <h6 className={ styles['h'] }>{ entryData.title }</h6>
                </div>
            </Link>
        </div>
    )
}