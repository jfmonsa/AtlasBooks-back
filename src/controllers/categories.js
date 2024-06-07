import { pool } from "../db.js";

//Aux functions
const groupSubcategoriesByCategory = (subcategories) => {
  return subcategories.reduce((acc, row) => {
    const { catid, cat_name, sub_category_id, subcategory_name } = row;

    // Buscar la categoría en el acumulador
    let category = acc.find((cat) => cat.cat_id === catid);

    // Si no existe, crear una nueva categoría
    if (!category) {
      category = {
        cat_id: catid,
        cat_name: cat_name,
        subcategories: [],
      };
      acc.push(category);
    }

    // Agregar la subcategoría a la categoría correspondiente
    category.subcategories.push({
      subcat_id: sub_category_id,
      subcat_name: subcategory_name,
    });

    return acc;
  }, []);
};

const getAllSubcategoriesAndCategories = async () => {
  try {
    const result = await pool.query(
      `
      SELECT sc.id AS sub_category_id, sc.subcategoryname AS subcategory_name, sc.idcategoryfather AS catId, c.categoryname AS cat_name
      FROM SUBCATEGORY sc
      INNER JOIN CATEGORY c ON sc.idcategoryfather = c.id
      `
    );

    return result.rows;
  } catch (error) {
    console.error("Error retrieving subcategories:", error);
  }
};
/**
 * Return groupped subcategories by category
 * @param {*} req
 * @param {*} res
 */
export const getCategoriesAndSubCategoriesGroupped = async (req, res) => {
  try {
    const result = await getAllSubcategoriesAndCategories();

    const groupedData = groupSubcategoriesByCategory(result);

    res.status(200).send({ groupedData });
  } catch (error) {
    console.error("Error retrieving grouped subcategories:", error);
    res.status(500).send({ error: "Failed to retrieve grouped subcategories" });
  }
};

/**
 * Get a list of ungroupped categories and subcategories
 * @param {*} req
 * @param {*} res
 */
export const getCategoriesAndSubCategoriesUngroupped = async (req, res) => {
  try {
    const result = await getAllSubcategoriesAndCategories();

    res.status(200).json(result);
  } catch (error) {
    console.error("Error retrieving subcategories:", error);
    res.status(500).json({ error: "Failed to retrieve subcategories" });
  }
};
