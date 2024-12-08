import { Client } from "@elastic/elasticsearch";
//Para indexar libros en ElasticSearch
import SearchFiltersRepository from "../repositories/searchFilters.repository.js";
import { processPDF } from "../elastic-Search/extracPDF.js";

const client = new Client({
  cloud: {
    id: process.env.ElASTICSEARCH_CLOUD_ID,
  },
  auth: {
    username: process.env.ELASTICSEARCH_USERNAME,
    password: process.env.ELASTICSEARCH_PASSWORD,
  },
});

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
      console.log("Total de resultados:", ids.length); // Muestra el total de resultados
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

export async function indexBook(indexName, bookData) {
  await client.index({
    index: indexName,
    body: bookData,
  });
  console.log(`Book indexed successfully in index ${indexName}`);
}

async function indexBookScript(book) {
  const body = {
    id: book.id,
    title: book.title,
    body: await processPDF(
      "/Users/sebas/OneDrive/Desktop/Universidad/SEMESTRES/SEMESTRE_6/Proyecto AtlasBooks/AtlasBooks-back/src/elastic-Search/testNube2.pdf"
    ),
  };

  indexBook("books", body);
}
async function indexAllBooks() {
  try {
    const books = await fetchAndStoreBookTitles();
    for (const book of books) {
      await indexBookScript(book);
    }
    console.log("Todos los libros han sido indexados");
  } catch (error) {
    console.error("Error:", error);
  }
}

//indexAllBooks();
