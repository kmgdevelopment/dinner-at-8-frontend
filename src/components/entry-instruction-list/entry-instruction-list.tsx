import styles from "./entry-instruction-list.module.scss";
import RecipeEntry from "@/types/recipe-entry";
import parse from 'html-react-parser';

export default function EntryInstructionList(data: RecipeEntry) {    
    return (
        <div className={styles['entry-instruction-list']}>
            <h5>Instructions</h5>

            { parse(data.recipeInstructions_new.rawHtml) }
        </div>
    )
}