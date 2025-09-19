import type RecipeCategory from "@/types/recipe-category";
import type RecipeCategoryCheckbox from "@/types/recipe-category-checkbox";
import type RecipeCategoryGroup from "@/types/recipe-category-group";

// This function builds two lists from the category data:
// 1. A flat list of all categories with a "checked" property for the checkboxes
// 2. A list of unique category groups for rendering the filter sections
export default function buildCatFilterGroups(
    data: { cats: RecipeCategory[] } | undefined
) {
    if(!data) return;

    let categoryList: RecipeCategoryCheckbox[] = [];
    let groupList: RecipeCategoryGroup[] = [];

    // Craft 4.0 GraphQL doesn't have a subfield for group names
    // so we're listing them manually
    const groupNames: Record<string, string> = {
        diet: 'Dietary Restrictions',
        holiday: 'Holiday',
        meal: 'Meal Type',
        protein: 'Protein Type',
        season: 'Season'
    };

    // organize categories into groups
    // and create a list of groups
    data.cats.map( (cat) => {
        // make a list of fields
        categoryList.push({
            "id": cat.id,
            "groupId": cat.groupId,
            "title": cat.title,
            "checked": false
        });

        // make a list of groups
        let groupExists = false;

        for(let i = 0; i < groupList.length; i++) {
            if(groupList[i].id == cat.groupId) {
                groupExists = true;
                break;
            }
        }

        if(!groupExists) {
            groupList.push({
                "id": cat.groupId,
                "name": groupNames[cat.groupHandle]
            })
        }
    });

    return { categoryList, groupList };
}