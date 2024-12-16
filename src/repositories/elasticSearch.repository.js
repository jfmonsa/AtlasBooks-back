import { processPDF } from "../elastic-Search/extracPDF.js";
import { client } from "../config/elastic-search.js";

/**
 * Searches for books in the ElasticSearch index.
 * Excludes the fields "title" and "body" from the results.
 * Limits the number of results to 1000.
 * Searches in the body of the book.
 */
export async function searchBooksInElastic(body) {
  try {
    const result = await client.search({
      index: "books",
      _source: {
        excludes: ["title", "body"],
      },
      size: 1000,
      body: {
        query: {
          match: {
            body: body, // Search in the body of the book
          },
        },
      },
    });
    if (result) {
      let ids = []; // Initialize the array of IDs

      result.hits.hits.forEach(hit => {
        ids.push(hit._source.id); // Add each ID to the array
      });

      return ids; // Return the IDs
    } else {
      console.log("No results found");
      return [];
    }
  } catch (error) {
    console.error("Search error:", error);
    return [];
  }
}

/**
 * Indexes a book in the specified ElasticSearch index.
 */
async function indexBook(indexName, bookData) {
  await client.index({
    index: indexName,
    body: bookData,
  });
  console.log(`Book indexed successfully in index ${indexName}`);
}

/**
 * Processes and indexes a book in the ElasticSearch index.
 * Extracts text content from the book's PDF.
 */
export async function indexBookScript(book, secureUrl = null) {
  const bookId = book.id || book;
  const title = book.title || arguments[1];
  const url = secureUrl || arguments[2];

  const body = {
    id: bookId,
    title: title,
    body: await processPDF(url),
  };

  indexBook("books", body);
}
