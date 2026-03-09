import RecipeIngredient from "@/types/recipe-ingredient";
import styles from "./entry-ingredient-list.module.scss";
import type RecipeEntry from "@/types/recipe-entry";
import convertFraction from "@/utils/convert-fraction";

export default function EntryIngredientList(data: RecipeEntry) {
    // add an 's' to unit names with a quantity greater than 1
    const pluralizeUnit = (unit: string|null, quantity: string|null) => {
        if (!unit) return null;

        if( (unit != 'tbsp' && unit != 'tsp') 
            && quantity 
            && convertFraction(quantity) > 1 
        ) {
            unit += 's';
        }
        return unit;
    }

    const renderIngredientList = (listData: RecipeIngredient[]) => {
        let blockList: React.ReactNode[] = [];
        let ingredientList: React.ReactNode[] | null = null;
        // generate keys for each new block node 
        let blockIndex = 0;

        // add the <ul> to the block list and then clear it out
        const applyListBlock = () => {
            if(ingredientList) {
                blockList.push(<ul key={blockIndex}>{ingredientList}</ul>);
                blockIndex++;
                ingredientList = null;
            }
        }

        // loop through the ingredient list
        listData.forEach( (item, index) => {
            // if this item is NOT a heading
            if(!item.heading) {
                // if there is no currently active 
                // ingredient list, create one
                if(!ingredientList) {
                    ingredientList = [];
                }

                // add this item to the ingredientList
                // note: index shouldn't be used for the item key,
                // will need to fix if the data becomes mutable
                let unit = pluralizeUnit(item.unit, item.quantity);
                ingredientList.push(
                    <li key={index}>
                        {item.quantity && `${item.quantity} `}
                        {unit && `${unit} `}
                        {item.ingredient}
                        {item.preparation && `, ${item.preparation}`}
                    </li>
                );

                // if this is the last item in the array,
                // close out the list and add it to the blockList
                if(index + 1 === listData.length && ingredientList) {
                    applyListBlock();
                }
            }

            // if this item is a heading
            else {
                // if there is an active ingredient list,
                // add it to the block list then nullify it
                if(ingredientList) {
                    applyListBlock();
                }

                // add the heading node to the block list
                blockList.push(<h6 key={blockIndex}>{item.ingredient}</h6>)
                blockIndex++;
            }				
        });

        return blockList;
    }    

    return (
        <div className={styles['entry-ingredient-list']}>
            <h5>Ingredients</h5>

            { renderIngredientList(data.recipeIngredients_new) }
        </div>
    )
}