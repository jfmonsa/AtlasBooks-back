//Para indexar libros en ElasticSearch
import { processPDF } from "../elastic-Search/extracPDF.js";
import { client } from "../config/elastic-search.js";

export async function elasticSearchBooks(body) {
  try {
    const result = await client.search({
      index: "books", // Especifica el índice
      _source: {
        excludes: ["title", "body"], // Excluir los campos title y body
      },
      size: 1000, // Limitar el número de resultados a 10000
      body: {
        query: {
          match: {
            body: body, // La búsqueda en el body del libro
          },
        },
      },
    });
    if (result) {
      let ids = []; // Inicializa el arreglo de IDs

      result.hits.hits.forEach(hit => {
        ids.push(hit._source.id); // Agrega cada ID al arreglo
      });

      return ids; // Devuelve las IDs
    } else {
      console.log("No se encontraron resultados");
      return [];
    }
  } catch (error) {
    console.error("Error en la búsqueda:", error);
    return [];
  }
}

async function indexBook(indexName, bookData) {
  await client.index({
    index: indexName,
    body: bookData,
  });
  console.log(`Book indexed successfully in index ${indexName}`);
}

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
