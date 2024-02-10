import styles from "./entry-instruction-list.module.scss";
import RecipeEntry from "@/types/recipe-entry";
import parse from 'html-react-parser';

export default function EntryInstructionList(data: RecipeEntry) {
    const blockList = () => {
        let blocks: React.ReactNode[] = [];

        data.recipeInstructions.map( (block) => {
            if( block.type == 'heading' ) {
                blocks.push(<h6 key={block.id}>{block.text}</h6>);
            }
            if( block.type == 'instructionList' ) {
                blocks.push(
                    <ol key={block.id}>
                        {block.list.map( (item) => {
                            return <li key={item.id}>{parse(item.description)}</li>
                        } )}
                    </ol>)
            }
        });

        return blocks;
    }
    

    return (
        <div className={styles['entry-instruction-list']}>
            <h5>Instructions</h5>

            { blockList() }
        </div>
    )
}