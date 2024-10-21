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

/**
 * Return groupped subcategories by category
 * @param {*} req
 * @param {*} res
 */
export const getCategoriesAndSubCategoriesGroupped = async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT sc.id AS sub_category_id, sc.subcategoryname AS subcategory_name, sc.idcategoryfather AS catId, c.categoryname AS cat_name
      FROM SUBCATEGORY sc
      INNER JOIN CATEGORY c ON sc.idcategoryfather = c.id
      WHERE EXISTS (
        SELECT 1
        FROM BOOK_IN_SUBCATEGORY bis
        WHERE bis.idSubcategory = sc.id
      )
      `
    );

    const groupedData = groupSubcategoriesByCategory(result.rows);

    res.status(200).send({ groupedData });
  } catch (error) {
    console.error("Error retrieving grouped subcategories:", error);
    res.status(500).send({ error: "Failed to retrieve grouped subcategories" });
  }
};

/**
 * Get a list of subcategories of a category given
 * @param {*} req
 * @param {*} res
 */
export const getSubCategoriesOfCategory = async (req, res) => {
  try {
    const idCat = req.params.idCat;
    const query = await pool.query(
      `select id, subcategoryname 
      from subcategory 
      where idCategoryFather = $1`,
      [idCat]
    );
    if (query.rows.length === 0) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.status(200).send({
      subcategories: query.rows,
    });
  } catch (error) {
    console.error("Error retrieving subcategories of a category:", error);
    res
      .status(500)
      .json({ error: "Error retrieving subcategories of a category" });
  }
};

/**
 * Get a list of all categories
 * @param {*} req
 * @param {*} res
 */
export const getCategories = async (req, res) => {
  try {
    const query = await pool.query("select * from category");
    res.status(200).send({ categories: query.rows });
  } catch (error) {
    console.error("Error retrieving Categories:", error);
    res.status(500).json({ error: "Error retrieving Categories" });
  }
};
