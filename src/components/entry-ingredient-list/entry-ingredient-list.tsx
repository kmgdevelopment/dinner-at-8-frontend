import RecipeIngredient from "@/types/recipe-ingredient";
import styles from "./entry-ingredient-list.module.scss";
import type RecipeEntry from "@/types/recipe-entry";

export default function EntryIngredientList(data: RecipeEntry) {
    // convert a fraction string to a floating-point integer
    const convertFraction = (number: string) => {
        // split the number by spaces and forward slashes
        const numArray = number.split(/ |\//);
        
        let integer = 0;
        let divisor = 0;
        let dividend = 0;

        // integer only (i.e. 1)
        if(numArray.length == 1) {
            integer = Number(numArray[0]);
            divisor = 0;
            dividend = 0;
        }
        // fraction only (i.e. 1/2)
        if(numArray.length == 2) {
            integer = 0;
            divisor = Number(numArray[0]);
            dividend = Number(numArray[1]);

        }        
        // integer and fraction (i.e. 1 1/2)
        if( numArray.length == 3 ) {
            integer = Number(numArray[0]);
            divisor = Number(numArray[1]);
            dividend = Number(numArray[2]);
        }

        let pointNum = integer;

        // don't divide by zero! doom!!
        if(numArray.length > 1) {
            pointNum += (divisor / dividend);
        }

        return pointNum;
    }

    const ingredientList = (list: RecipeIngredient[]) => {
        let ingredients: React.ReactNode[] = [];

        list.map( (item) => {
            let unit = '';
            if( item.unit ) {
                unit = item.unit;
                // add an 's' to unit names with a quantity greater than 1
                if( (item.unit != 'tbsp' && item.unit != 'tsp') 
                    && item.quantity 
                    && convertFraction(item.quantity) > 1 
                ) {
                    unit += 's';
                }
                unit += ' ';
            }
            
            ingredients.push(
                <li key={item.id}>
                    {item.quantity && item.quantity + ' '}
                    {unit}
                    {item.ingredient}
                    {item.preparation && ', ' + item.preparation}
                </li>
            )				
        });

        return ingredients;
    }

    const blockList = () => {
        let blocks: React.ReactNode[] = [];

        data.recipeIngredients.map( (block) => {
            if( block.type == 'heading' ) {
                blocks.push(<h6 key={block.id}>{block.text}</h6>);
            }
            if( block.type == 'ingredientList' ) {
                blocks.push(<ul key={block.id}>{ingredientList(block.list)}</ul>)
            }
        });

        return blocks;
    }
    

    return (
        <div className={styles['entry-ingredient-list']}>
            <h5>Ingredients</h5>

            { blockList() }
        </div>
    )
}