# 1. Tabla Entidad libro

```
BOOK( id (pk), isbn, title, description, year, vol, nPages, publisher, pathBookCover )
```

## 1.1 Tabla Atributos multivalorados de la entidad libro

```
BOOK_FILES( (idBook, path) (pk) )
	idBook -> BOOK.id

BOOK_AUTHORS( (idBook, author) (pk))
	idBook -> BOOK.id

BOOK_LANG( (idBook, language) (pk) )
idBook -> BOOK.id
```

# 2. Tabla Entidad usuario

```
USERS( id (pk) , name, nickname, email, country, registerDate, password, pathProfilePic, status, isAdmin )
```

# 3. Tabla Relaciones (n,m) Entre USERS y BOOK

```
BOOK_COMMENT( idComent (pk), idUser, idBook, date, text)
	idUser -> USERS.id
	idBook -> BOOK.id

BOOK_RATE( (idUser, idBook) (pk), rateValue )
	idUser -> USERS.id
	idBook -> BOOK.id

BOOK_UPLOAD( (idUser, idBook)(pk), date)
	idUser -> USERS.id
	idBook -> BOOK.id

BOOK_DOWNLOAD( (idUser, idBook)(pk), date)
	idUser -> USERS.id
	idBook -> BOOK.id
```

# 4. Tabla Entidades Para Registrar Reportes, Eliminación y Baneo de Contenidos

```
// Tabla de reporte de contenido inadecuado
BOOK_REPORT( id (pk), idUser, idBook, date, motivation, status)
	idUser -> USERS.id
	idBook -> BOOK.id

// Tabla para regisrar la eliminación de un libro
BOOK_DELETE( id (pk), idAdmin, idBook, date, motivation)
	idUser -> USERS.id
	idBook -> BOOK.id

// Tabla para registrar el baneo de usuarios
USER_BAN( id (pk), idUserBanned, idAdmin, motivation, date)
	idAdmin -> USERS.id
	idUserBanned-> USERS.id
```

# 5. Tablas Para Registrar el Manejo de Listas

```
BOOK_LIST ( id (pk), title, description, date, ispublic?, idUserCreator)
	idUserCreator -> USERS.id

BOOK_IN_LIST( (idBook, idList) (pk) )
	idBook -> BOOK.id
	idList -> LIST.id
```

# 6. Tablas Para Registrar el Manejo de Categorias y Subcategorias de los Libros

```
CATEGORY (id (pk), categoryName)
SUBCATEGORY ( id, subCategoryName, idCategoryFather)
	idCategoryFather -> CATEGORY.id

BOOK_IN_SUBCATEGORY ( ( IdBook, idSubcategory) (pk) )
	idBook -> BOOK
	idSubcategory -> SUBCATEGORY.id
```
