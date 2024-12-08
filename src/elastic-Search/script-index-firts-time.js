import { client } from "../config/elastic-search.js";
import SearchFiltersRepository from "../repositories/searchFilters.repository.js";
import { indexBookScript } from "../repositories/elasticSearch.repository.js";

/**
 * @fileoverview Script to index all books in ElasticSearch for the first time.
 */

const urlToTestNube2 = "../../../test/data/testNube2.pdf";

const searchFiltersRepository = new SearchFiltersRepository();

async function fetchAndStoreBookTitles() {
  try {
    const bookTitles = await searchFiltersRepository.fetchBookTitles();
    const titlesArray = bookTitles.map(book => ({
      id: book.id,
      title: book.title,
    }));
    console.log("Book Titles:", titlesArray);
    return titlesArray;
  } catch (error) {
    console.error("Error fetching book titles:", error);
  }
}

//Used to create an index, maping and indexBooks in ElasticSearch for testing purposes
export async function createIndex(indexName) {
  await client.indices.create({ index: indexName });
  console.log(`Index ${indexName} created successfully`);
}

export async function mapIndex(indexName, mapping) {
  await client.indices.putMapping({
    index: indexName,
    body: mapping,
  });
  console.log(`Mapping for index ${indexName} created successfully`);
}

async function indexAllBooks() {
  try {
    const books = await fetchAndStoreBookTitles();
    console.log("books", books);
    for (const book of books) {
      await indexBookScript(book, urlToTestNube2);
    }
    console.log("Todos los libros han sido indexados");
  } catch (error) {
    console.error("Error:", error);
  }
}

indexAllBooks();
