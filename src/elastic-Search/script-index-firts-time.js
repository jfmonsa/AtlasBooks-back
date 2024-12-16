import { client } from "../config/elastic-search.js";
import SearchFiltersRepository from "../repositories/searchFilters.repository.js";
import { indexBookScript } from "../repositories/elasticSearch.repository.js";

/**
 * @fileoverview Script to index all books in ElasticSearch for the first time.
 */

const urlToTestPdf = "";

// NOTE: we have to create a new instance of the repository to use the fetchBookTitles method
// because the repository was intended to be used in the context of the API using a DI container
const searchFiltersRepository = new SearchFiltersRepository();

/** Retrieves and transforms book titles.*/
async function retrieveBookTitles() {
  try {
    const bookTitles = await searchFiltersRepository.fetchBookTitles();
    const titlesArray = bookTitles.map(book => ({
      id: book.id,
      title: book.title,
    }));
    return titlesArray;
  } catch (error) {
    console.error("Error fetching book titles:", error);
  }
}

/** Creates an index in ElasticSearch. */
export async function createIndex(indexName) {
  await client.indices.create({ index: indexName });
  console.log(`Index ${indexName} created successfully`);
}

/** Maps an index in ElasticSearch. */
export async function mapIndex(indexName, mapping) {
  await client.indices.putMapping({
    index: indexName,
    body: mapping,
  });
  console.log(`Mapping for index ${indexName} created successfully`);
}

/** Indexes all books in ElasticSearch. */
export async function indexAllBooks() {
  console.log("Indexing all books in elastic search index...");
  try {
    const books = await retrieveBookTitles();
    for (const book of books) {
      await indexBookScript(book, urlToTestPdf);
    }
    console.log("All books have been indexed");
  } catch (error) {
    console.error("Error indexing all books:", error);
  }
}
