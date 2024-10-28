
    INSERT INTO BOOK (isbn, title, description, year_released, number_of_pages, publisher, cover_img_path) 
    VALUES (NULL, 'El general en su laberinto', 'El general en su laberinto es una novela histórica del escritor colombiano y premiado Nobel de Literatura Gabriel García Márquez. Recrea los últimos días de Simón Bolívar, uno de los principales líderes de los procesos de independencia política desarrollados en América del Sur en el primer cuarto del siglo XIX.', 
    '1988', '157', 
    'Sudamericana',
    'https://res.cloudinary.com/dlja4vnrd/image/upload/v1730155525/bookCoverPics/dphn1j4dqdguilabxpfp.jpg');
INSERT INTO BOOK_FILES (id_book, original_name, file_path) VALUES (CURRVAL('BOOK_id_seq'), 'book.pdf', 'https://res.cloudinary.com/dlja4vnrd/image/upload/v1730140399/Documento_sin_t%C3%ADtulo_mf50ar.pdf');
INSERT INTO BOOK_FILES (id_book, original_name, file_path) VALUES (CURRVAL('BOOK_id_seq'), 'book.epub', 'https://res.cloudinary.com/dlja4vnrd/raw/upload/v1730140399/Documento_sin_t%C3%ADtulo_awm8cq.epub');
INSERT INTO BOOK_AUTHORS (id_book, author) VALUES (CURRVAL('BOOK_id_seq'), 'Gabriel Garcia Marquez');
INSERT INTO BOOK_LANG (id_book, language) VALUES (CURRVAL('BOOK_id_seq'), 'spanish');
INSERT INTO BOOK_IN_SUBCATEGORY (id_book, id_subcategory) 
      SELECT CURRVAL('BOOK_id_seq'), id FROM SUBCATEGORY WHERE name = 'Historical';

    INSERT INTO BOOK (isbn, title, description, year_released, number_of_pages, publisher, cover_img_path) 
    VALUES ('8483835126', 'La insoportable levedad del ser', 'Esta es una extraordinaria historia de amor, o sea de celos, de sexo, de traiciones, de muerte y también de las debilidades y paradojas de la vida cotidiana de dos parejas cuyos destinos se entrelazan irremediablemente. Guiado por la asombrosa capacidad de Milan Kundera de contar con cristalina claridad, el lector penetra fascinado en la trama compleja de actos y pensamientos que el autor va tejiendo con diabólica sabiduría en torno a sus personajes. Y el lector no puede sino terminar siendo el mismo personaje, cuando no todos a la vez. Y es que esta novela va dirigida al corazón, pero también a la cabeza del lector. En efecto, los celos de Teresa por Tomás, el terco amor de éste por ella opuesto a su irreflenable deseo de otras mujeres, el idealismo lírico y cursi de Franz, amante de Sabina, y la necesidad de ésta, amante también de Tomás, de perseguir incansable, una libertad que tan sólo la conduce a la insoportable levedad del ser, se convierten de simple anécdota en reflexión sobre problemas filosóficos que, afectan a cada uno directamente, cada día.', 
    '2008', '137', 
    'Tusquets',
    'https://res.cloudinary.com/dlja4vnrd/image/upload/v1730155529/bookCoverPics/gwnymjoqlclrulrnhxow.jpg');
INSERT INTO BOOK_FILES (id_book, original_name, file_path) VALUES (CURRVAL('BOOK_id_seq'), 'book.pdf', 'https://res.cloudinary.com/dlja4vnrd/image/upload/v1730140399/Documento_sin_t%C3%ADtulo_mf50ar.pdf');
INSERT INTO BOOK_FILES (id_book, original_name, file_path) VALUES (CURRVAL('BOOK_id_seq'), 'book.epub', 'https://res.cloudinary.com/dlja4vnrd/raw/upload/v1730140399/Documento_sin_t%C3%ADtulo_awm8cq.epub');
INSERT INTO BOOK_AUTHORS (id_book, author) VALUES (CURRVAL('BOOK_id_seq'), 'Milan  Kundera');
INSERT INTO BOOK_LANG (id_book, language) VALUES (CURRVAL('BOOK_id_seq'), 'spanish');
INSERT INTO BOOK_IN_SUBCATEGORY (id_book, id_subcategory) 
      SELECT CURRVAL('BOOK_id_seq'), id FROM SUBCATEGORY WHERE name = 'Contemporary Fiction';

    INSERT INTO BOOK (isbn, title, description, year_released, number_of_pages, publisher, cover_img_path) 
    VALUES ('8437611687', 'El laberinto de la soledad (Letras Hispanicas)', 'Resultado de la penetrante e inquisitiva mirada de un poeta y su imaginaci?n creadora, El laberinto de la soledad seduce al lector para conducirlo por una construcci?n en la que convergen la intuici?n filos?fica, la indagaci?n psicol?gica y los trazos descriptivos de la antropolog?a y la sociolog?a. Este libro mantiene su capacidad de provocar nuevas lecturas y de convocar al pensamiento en torno a la situaci?n del hombre en el mundo, y es por ello infaltable en la colecci?n Conmemorativa del FCE, que lo edit? por vez primera en 1959, y, a partir de 1981, lo public? con Postdata -que complementa y actualiza el an?lisis de la realidad pol?tica y social de M?xico- y con Vuelta a "El laberinto de la soledad" -entrevista con el historiador franc?s Claude Fell.', 
    '2006', '93', 
    'Catedra',
    'https://res.cloudinary.com/dlja4vnrd/image/upload/v1730155533/bookCoverPics/wee7hrs7lyo77z6hfalf.jpg');
INSERT INTO BOOK_FILES (id_book, original_name, file_path) VALUES (CURRVAL('BOOK_id_seq'), 'book.pdf', 'https://res.cloudinary.com/dlja4vnrd/image/upload/v1730140399/Documento_sin_t%C3%ADtulo_mf50ar.pdf');
INSERT INTO BOOK_FILES (id_book, original_name, file_path) VALUES (CURRVAL('BOOK_id_seq'), 'book.epub', 'https://res.cloudinary.com/dlja4vnrd/raw/upload/v1730140399/Documento_sin_t%C3%ADtulo_awm8cq.epub');
INSERT INTO BOOK_AUTHORS (id_book, author) VALUES (CURRVAL('BOOK_id_seq'), 'Paz');
INSERT INTO BOOK_LANG (id_book, language) VALUES (CURRVAL('BOOK_id_seq'), 'spanish');

    INSERT INTO BOOK (isbn, title, description, year_released, number_of_pages, publisher, cover_img_path) 
    VALUES (NULL, 'Exupery-El Principito Otra edicion', 'No description', 
    NULL, '64', 
    NULL,
    'https://res.cloudinary.com/dlja4vnrd/image/upload/v1723489266/bookCoverPics/di2bbfam1c7ncljxnfw8.jpg');
INSERT INTO BOOK_FILES (id_book, original_name, file_path) VALUES (CURRVAL('BOOK_id_seq'), 'book.pdf', 'https://res.cloudinary.com/dlja4vnrd/image/upload/v1730140399/Documento_sin_t%C3%ADtulo_mf50ar.pdf');
INSERT INTO BOOK_FILES (id_book, original_name, file_path) VALUES (CURRVAL('BOOK_id_seq'), 'book.epub', 'https://res.cloudinary.com/dlja4vnrd/raw/upload/v1730140399/Documento_sin_t%C3%ADtulo_awm8cq.epub');
INSERT INTO BOOK_AUTHORS (id_book, author) VALUES (CURRVAL('BOOK_id_seq'), 'Saint');
INSERT INTO BOOK_LANG (id_book, language) VALUES (CURRVAL('BOOK_id_seq'), 'spanish');

    INSERT INTO BOOK (isbn, title, description, year_released, number_of_pages, publisher, cover_img_path) 
    VALUES (NULL, 'Don Quijote de la Mancha', 'A la pregunta de cuál es el libro más importante escrito en su lengua, cualquier hablante de español responderá sin duda que Don Quijote de la Mancha, de Miguel de Cervantes. Aunque, si la pregunta es si se ha leído entero, entonces no todo el mundo dirá que sí. A continuación, te presentamos un resumen de este magnífico libro para que te animes a leerlo.Alonso Quijano es un hidalgo -es decir, un noble sin bienes y de escala social baja-, de unos cincuenta años, que vive en algún lugar de La Mancha a comienzos del siglo XVII. Su afición es leer libros de caballería donde se narran aventuras fantásticas de caballeros, princesas, magos y castillos encantados. Se entrega a estos libros con tanta pasión que acaba perdiendo el contacto con la realidad y creyendo que él también puede emular a sus héroes de ficción.Con este fin, recupera una armadura de sus antepasados y saca del establo a su viejo y desgarbado caballo, al que da el nombre de Rocinante. Como todo caballero, también necesita una dama, por lo que transforma el recuerdo de una campesina de la que estuvo enamorado y le da el nombre de Dulcinea del Toboso. Por último, se cambia el nombre por el de Don Quijote, que rima con el del famoso caballero Lanzarote (Lancelot).Don quijote sale en busca de aventura. Tiene un aspecto ridículo, pero está decidido a llevar a cabo hazañas heroicas. Sin embargo, aquí comienzan a surgir las primeras diferencias con la realidad: ve una posada y cree que es un castillo; exige al dueño que lo arme caballero en una escena cómica; intenta rescatar a un joven pastor que está siendo azotado por su amo; y ataca también a unos mercaderes que se burlan de él, pero es derribado y herido.', 
    '2008', '1050', 
    NULL,
    'https://res.cloudinary.com/dlja4vnrd/image/upload/v1723489266/bookCoverPics/di2bbfam1c7ncljxnfw8.jpg');
INSERT INTO BOOK_FILES (id_book, original_name, file_path) VALUES (CURRVAL('BOOK_id_seq'), 'book.pdf', 'https://res.cloudinary.com/dlja4vnrd/image/upload/v1730140399/Documento_sin_t%C3%ADtulo_mf50ar.pdf');
INSERT INTO BOOK_FILES (id_book, original_name, file_path) VALUES (CURRVAL('BOOK_id_seq'), 'book.epub', 'https://res.cloudinary.com/dlja4vnrd/raw/upload/v1730140399/Documento_sin_t%C3%ADtulo_awm8cq.epub');
INSERT INTO BOOK_AUTHORS (id_book, author) VALUES (CURRVAL('BOOK_id_seq'), 'Cervantes Saavedra');
INSERT INTO BOOK_LANG (id_book, language) VALUES (CURRVAL('BOOK_id_seq'), 'spanish');
INSERT INTO BOOK_IN_SUBCATEGORY (id_book, id_subcategory) 
      SELECT CURRVAL('BOOK_id_seq'), id FROM SUBCATEGORY WHERE name = 'Classics';

    INSERT INTO BOOK (isbn, title, description, year_released, number_of_pages, publisher, cover_img_path) 
    VALUES (NULL, 'El Alquimista', 'No description', 
    NULL, '105', 
    NULL,
    'https://res.cloudinary.com/dlja4vnrd/image/upload/v1723489266/bookCoverPics/di2bbfam1c7ncljxnfw8.jpg');
INSERT INTO BOOK_FILES (id_book, original_name, file_path) VALUES (CURRVAL('BOOK_id_seq'), 'book.pdf', 'https://res.cloudinary.com/dlja4vnrd/image/upload/v1730140399/Documento_sin_t%C3%ADtulo_mf50ar.pdf');
INSERT INTO BOOK_FILES (id_book, original_name, file_path) VALUES (CURRVAL('BOOK_id_seq'), 'book.epub', 'https://res.cloudinary.com/dlja4vnrd/raw/upload/v1730140399/Documento_sin_t%C3%ADtulo_awm8cq.epub');
INSERT INTO BOOK_AUTHORS (id_book, author) VALUES (CURRVAL('BOOK_id_seq'), 'Paulo Coelho');
INSERT INTO BOOK_LANG (id_book, language) VALUES (CURRVAL('BOOK_id_seq'), 'spanish');
INSERT INTO BOOK_IN_SUBCATEGORY (id_book, id_subcategory) 
      SELECT CURRVAL('BOOK_id_seq'), id FROM SUBCATEGORY WHERE name = 'Classics';

    INSERT INTO BOOK (isbn, title, description, year_released, number_of_pages, publisher, cover_img_path) 
    VALUES ('8423349640', 'Don Quijote de la Mancha', 'Puesto en castellano actual íntegra y fielmente por Andrés Trapiello', 
    '2015', '672', 
    'Ediciones Destino',
    'https://res.cloudinary.com/dlja4vnrd/image/upload/v1723489266/bookCoverPics/di2bbfam1c7ncljxnfw8.jpg');
INSERT INTO BOOK_FILES (id_book, original_name, file_path) VALUES (CURRVAL('BOOK_id_seq'), 'book.pdf', 'https://res.cloudinary.com/dlja4vnrd/image/upload/v1730140399/Documento_sin_t%C3%ADtulo_mf50ar.pdf');
INSERT INTO BOOK_FILES (id_book, original_name, file_path) VALUES (CURRVAL('BOOK_id_seq'), 'book.epub', 'https://res.cloudinary.com/dlja4vnrd/raw/upload/v1730140399/Documento_sin_t%C3%ADtulo_awm8cq.epub');
INSERT INTO BOOK_AUTHORS (id_book, author) VALUES (CURRVAL('BOOK_id_seq'), 'Miguel de Cervantes Saavedra');
INSERT INTO BOOK_LANG (id_book, language) VALUES (CURRVAL('BOOK_id_seq'), 'spanish');
INSERT INTO BOOK_IN_SUBCATEGORY (id_book, id_subcategory) 
      SELECT CURRVAL('BOOK_id_seq'), id FROM SUBCATEGORY WHERE name = 'Classics';

    INSERT INTO BOOK (isbn, title, description, year_released, number_of_pages, publisher, cover_img_path) 
    VALUES (NULL, 'Cien años de soledad', 'No description', 
    '2009', NULL, 
    'Indépendant',
    'https://res.cloudinary.com/dlja4vnrd/image/upload/v1730155548/bookCoverPics/io13mcoz0rpzvpmzfsyf.jpg');
INSERT INTO BOOK_FILES (id_book, original_name, file_path) VALUES (CURRVAL('BOOK_id_seq'), 'book.pdf', 'https://res.cloudinary.com/dlja4vnrd/image/upload/v1730140399/Documento_sin_t%C3%ADtulo_mf50ar.pdf');
INSERT INTO BOOK_FILES (id_book, original_name, file_path) VALUES (CURRVAL('BOOK_id_seq'), 'book.epub', 'https://res.cloudinary.com/dlja4vnrd/raw/upload/v1730140399/Documento_sin_t%C3%ADtulo_awm8cq.epub');
INSERT INTO BOOK_AUTHORS (id_book, author) VALUES (CURRVAL('BOOK_id_seq'), 'Gabriel');
INSERT INTO BOOK_LANG (id_book, language) VALUES (CURRVAL('BOOK_id_seq'), 'spanish');
INSERT INTO BOOK_IN_SUBCATEGORY (id_book, id_subcategory) 
      SELECT CURRVAL('BOOK_id_seq'), id FROM SUBCATEGORY WHERE name = 'Others';

    INSERT INTO BOOK (isbn, title, description, year_released, number_of_pages, publisher, cover_img_path) 
    VALUES (NULL, 'El gran Gatsby', 'No description', 
    '1924', NULL, 
    NULL,
    'https://res.cloudinary.com/dlja4vnrd/image/upload/v1730155551/bookCoverPics/rwkun4nziimuc1kraggp.jpg');
INSERT INTO BOOK_FILES (id_book, original_name, file_path) VALUES (CURRVAL('BOOK_id_seq'), 'book.pdf', 'https://res.cloudinary.com/dlja4vnrd/image/upload/v1730140399/Documento_sin_t%C3%ADtulo_mf50ar.pdf');
INSERT INTO BOOK_FILES (id_book, original_name, file_path) VALUES (CURRVAL('BOOK_id_seq'), 'book.epub', 'https://res.cloudinary.com/dlja4vnrd/raw/upload/v1730140399/Documento_sin_t%C3%ADtulo_awm8cq.epub');
INSERT INTO BOOK_AUTHORS (id_book, author) VALUES (CURRVAL('BOOK_id_seq'), 'Fitzgerald');
INSERT INTO BOOK_LANG (id_book, language) VALUES (CURRVAL('BOOK_id_seq'), 'spanish');
INSERT INTO BOOK_IN_SUBCATEGORY (id_book, id_subcategory) 
      SELECT CURRVAL('BOOK_id_seq'), id FROM SUBCATEGORY WHERE name = 'Thrillers';

    INSERT INTO BOOK (isbn, title, description, year_released, number_of_pages, publisher, cover_img_path) 
    VALUES (NULL, 'Memoria de mis putas tristes', 'No description', 
    '2003', NULL, 
    'Mondarori',
    'https://res.cloudinary.com/dlja4vnrd/image/upload/v1730155555/bookCoverPics/s2ywtxmtlzbg76ozm2fp.jpg');
INSERT INTO BOOK_FILES (id_book, original_name, file_path) VALUES (CURRVAL('BOOK_id_seq'), 'book.pdf', 'https://res.cloudinary.com/dlja4vnrd/image/upload/v1730140399/Documento_sin_t%C3%ADtulo_mf50ar.pdf');
INSERT INTO BOOK_FILES (id_book, original_name, file_path) VALUES (CURRVAL('BOOK_id_seq'), 'book.epub', 'https://res.cloudinary.com/dlja4vnrd/raw/upload/v1730140399/Documento_sin_t%C3%ADtulo_awm8cq.epub');
INSERT INTO BOOK_AUTHORS (id_book, author) VALUES (CURRVAL('BOOK_id_seq'), 'Márquez');
INSERT INTO BOOK_LANG (id_book, language) VALUES (CURRVAL('BOOK_id_seq'), 'spanish');
INSERT INTO BOOK_IN_SUBCATEGORY (id_book, id_subcategory) 
      SELECT CURRVAL('BOOK_id_seq'), id FROM SUBCATEGORY WHERE name = 'Contemporary Fiction';

    INSERT INTO BOOK (isbn, title, description, year_released, number_of_pages, publisher, cover_img_path) 
    VALUES (NULL, 'El Principito', 'No description', 
    '1943', NULL, 
    'Salamandra',
    'https://res.cloudinary.com/dlja4vnrd/image/upload/v1730155560/bookCoverPics/rmlkgntsjpy5t2hpimyy.jpg');
INSERT INTO BOOK_FILES (id_book, original_name, file_path) VALUES (CURRVAL('BOOK_id_seq'), 'book.pdf', 'https://res.cloudinary.com/dlja4vnrd/image/upload/v1730140399/Documento_sin_t%C3%ADtulo_mf50ar.pdf');
INSERT INTO BOOK_FILES (id_book, original_name, file_path) VALUES (CURRVAL('BOOK_id_seq'), 'book.epub', 'https://res.cloudinary.com/dlja4vnrd/raw/upload/v1730140399/Documento_sin_t%C3%ADtulo_awm8cq.epub');
INSERT INTO BOOK_AUTHORS (id_book, author) VALUES (CURRVAL('BOOK_id_seq'), 'de Saint-Exupéry');
INSERT INTO BOOK_LANG (id_book, language) VALUES (CURRVAL('BOOK_id_seq'), 'spanish');
INSERT INTO BOOK_IN_SUBCATEGORY (id_book, id_subcategory) 
      SELECT CURRVAL('BOOK_id_seq'), id FROM SUBCATEGORY WHERE name = 'Literature & Fiction';

    INSERT INTO BOOK (isbn, title, description, year_released, number_of_pages, publisher, cover_img_path) 
    VALUES (NULL, 'Hamlet', 'No description', 
    '2010', NULL, 
    NULL,
    'https://res.cloudinary.com/dlja4vnrd/image/upload/v1730155563/bookCoverPics/f4klgjtwkwfxasgmessd.jpg');
INSERT INTO BOOK_FILES (id_book, original_name, file_path) VALUES (CURRVAL('BOOK_id_seq'), 'book.pdf', 'https://res.cloudinary.com/dlja4vnrd/image/upload/v1730140399/Documento_sin_t%C3%ADtulo_mf50ar.pdf');
INSERT INTO BOOK_FILES (id_book, original_name, file_path) VALUES (CURRVAL('BOOK_id_seq'), 'book.epub', 'https://res.cloudinary.com/dlja4vnrd/raw/upload/v1730140399/Documento_sin_t%C3%ADtulo_awm8cq.epub');
INSERT INTO BOOK_AUTHORS (id_book, author) VALUES (CURRVAL('BOOK_id_seq'), 'Shakespeare William');
INSERT INTO BOOK_LANG (id_book, language) VALUES (CURRVAL('BOOK_id_seq'), 'spanish');
INSERT INTO BOOK_IN_SUBCATEGORY (id_book, id_subcategory) 
      SELECT CURRVAL('BOOK_id_seq'), id FROM SUBCATEGORY WHERE name = 'Drama';

    INSERT INTO BOOK (isbn, title, description, year_released, number_of_pages, publisher, cover_img_path) 
    VALUES (NULL, 'Cronica de una muerte anunciada', 'No description', 
    '2009', NULL, 
    NULL,
    'https://res.cloudinary.com/dlja4vnrd/image/upload/v1730155567/bookCoverPics/jxdlxausjadargei0b4h.png');
INSERT INTO BOOK_FILES (id_book, original_name, file_path) VALUES (CURRVAL('BOOK_id_seq'), 'book.pdf', 'https://res.cloudinary.com/dlja4vnrd/image/upload/v1730140399/Documento_sin_t%C3%ADtulo_mf50ar.pdf');
INSERT INTO BOOK_FILES (id_book, original_name, file_path) VALUES (CURRVAL('BOOK_id_seq'), 'book.epub', 'https://res.cloudinary.com/dlja4vnrd/raw/upload/v1730140399/Documento_sin_t%C3%ADtulo_awm8cq.epub');
INSERT INTO BOOK_AUTHORS (id_book, author) VALUES (CURRVAL('BOOK_id_seq'), 'Márquez');
INSERT INTO BOOK_LANG (id_book, language) VALUES (CURRVAL('BOOK_id_seq'), 'spanish');
INSERT INTO BOOK_IN_SUBCATEGORY (id_book, id_subcategory) 
      SELECT CURRVAL('BOOK_id_seq'), id FROM SUBCATEGORY WHERE name = 'Contemporary Fiction';

    INSERT INTO BOOK (isbn, title, description, year_released, number_of_pages, publisher, cover_img_path) 
    VALUES (NULL, 'El otoño del Patriarca', 'No description', 
    '2009', NULL, 
    'Sudamericana',
    'https://res.cloudinary.com/dlja4vnrd/image/upload/v1730155571/bookCoverPics/y1duhabiqki6wshbvrow.png');
INSERT INTO BOOK_FILES (id_book, original_name, file_path) VALUES (CURRVAL('BOOK_id_seq'), 'book.pdf', 'https://res.cloudinary.com/dlja4vnrd/image/upload/v1730140399/Documento_sin_t%C3%ADtulo_mf50ar.pdf');
INSERT INTO BOOK_FILES (id_book, original_name, file_path) VALUES (CURRVAL('BOOK_id_seq'), 'book.epub', 'https://res.cloudinary.com/dlja4vnrd/raw/upload/v1730140399/Documento_sin_t%C3%ADtulo_awm8cq.epub');
INSERT INTO BOOK_AUTHORS (id_book, author) VALUES (CURRVAL('BOOK_id_seq'), 'Márquez');
INSERT INTO BOOK_LANG (id_book, language) VALUES (CURRVAL('BOOK_id_seq'), 'spanish');
INSERT INTO BOOK_IN_SUBCATEGORY (id_book, id_subcategory) 
      SELECT CURRVAL('BOOK_id_seq'), id FROM SUBCATEGORY WHERE name = 'Peoples & Cultures';

    INSERT INTO BOOK (isbn, title, description, year_released, number_of_pages, publisher, cover_img_path) 
    VALUES (NULL, 'Romeo y Julieta', 'No description', 
    '2011', NULL, 
    NULL,
    'https://res.cloudinary.com/dlja4vnrd/image/upload/v1730155574/bookCoverPics/hezwrkktszlp6cwpvdrj.jpg');
INSERT INTO BOOK_FILES (id_book, original_name, file_path) VALUES (CURRVAL('BOOK_id_seq'), 'book.pdf', 'https://res.cloudinary.com/dlja4vnrd/image/upload/v1730140399/Documento_sin_t%C3%ADtulo_mf50ar.pdf');
INSERT INTO BOOK_FILES (id_book, original_name, file_path) VALUES (CURRVAL('BOOK_id_seq'), 'book.epub', 'https://res.cloudinary.com/dlja4vnrd/raw/upload/v1730140399/Documento_sin_t%C3%ADtulo_awm8cq.epub');
INSERT INTO BOOK_AUTHORS (id_book, author) VALUES (CURRVAL('BOOK_id_seq'), 'Shakespeare William');
INSERT INTO BOOK_LANG (id_book, language) VALUES (CURRVAL('BOOK_id_seq'), 'spanish');
INSERT INTO BOOK_IN_SUBCATEGORY (id_book, id_subcategory) 
      SELECT CURRVAL('BOOK_id_seq'), id FROM SUBCATEGORY WHERE name = 'Literary Fiction';

    INSERT INTO BOOK (isbn, title, description, year_released, number_of_pages, publisher, cover_img_path) 
    VALUES (NULL, 'Cien años de soledad', 'No description', 
    '1967', NULL, 
    'Le Libros',
    'https://res.cloudinary.com/dlja4vnrd/image/upload/v1730155577/bookCoverPics/txw3zdpamxerffsdsrvr.jpg');
INSERT INTO BOOK_FILES (id_book, original_name, file_path) VALUES (CURRVAL('BOOK_id_seq'), 'book.pdf', 'https://res.cloudinary.com/dlja4vnrd/image/upload/v1730140399/Documento_sin_t%C3%ADtulo_mf50ar.pdf');
INSERT INTO BOOK_FILES (id_book, original_name, file_path) VALUES (CURRVAL('BOOK_id_seq'), 'book.epub', 'https://res.cloudinary.com/dlja4vnrd/raw/upload/v1730140399/Documento_sin_t%C3%ADtulo_awm8cq.epub');
INSERT INTO BOOK_AUTHORS (id_book, author) VALUES (CURRVAL('BOOK_id_seq'), 'Márquez');
INSERT INTO BOOK_LANG (id_book, language) VALUES (CURRVAL('BOOK_id_seq'), 'spanish');
INSERT INTO BOOK_IN_SUBCATEGORY (id_book, id_subcategory) 
      SELECT CURRVAL('BOOK_id_seq'), id FROM SUBCATEGORY WHERE name = 'Literary Fiction';

    INSERT INTO BOOK (isbn, title, description, year_released, number_of_pages, publisher, cover_img_path) 
    VALUES (NULL, 'El Conde de Montecristo', 'El conde de Montecristo (Le comte de Montecristo) es una novela de aventuras clásica de Alexandre Dumas (padre) y Auguste Maquet. Éste último no figuró en los títulos de la obra ya que Alexandre Dumas pagó una elevada suma de dinero para que así fuera. Maquet era un colaborador muy activo en las novelas de Dumas, llegando a escribir obras enteras, reescribiéndolas Dumas después. Se suele considerar como el mejor trabajo de Dumas, y a menudo se incluye en las listas de las mejores novelas de todos los tiempos. Edmond Dantés ha pasado veinte años encarcelado en el castillo de If. Allí conoce al padre Faria que le desvela la existencia de un tesoro oculto en la isla de Montecristo. Dantés huye de la prisión y encuentra el tesoro. A partir de ahora su objetivo es vengarse de las personas que lo encarcelaron. Tras un año en Oriente, regresa a Francia con una nueva identidad: el Conde de Montecristo.', 
    '1844', NULL, 
    NULL,
    'https://res.cloudinary.com/dlja4vnrd/image/upload/v1730155581/bookCoverPics/gtkmg7iliriwe2w83wod.jpg');
INSERT INTO BOOK_FILES (id_book, original_name, file_path) VALUES (CURRVAL('BOOK_id_seq'), 'book.pdf', 'https://res.cloudinary.com/dlja4vnrd/image/upload/v1730140399/Documento_sin_t%C3%ADtulo_mf50ar.pdf');
INSERT INTO BOOK_FILES (id_book, original_name, file_path) VALUES (CURRVAL('BOOK_id_seq'), 'book.epub', 'https://res.cloudinary.com/dlja4vnrd/raw/upload/v1730140399/Documento_sin_t%C3%ADtulo_awm8cq.epub');
INSERT INTO BOOK_AUTHORS (id_book, author) VALUES (CURRVAL('BOOK_id_seq'), 'Alexandre Dumas');
INSERT INTO BOOK_LANG (id_book, language) VALUES (CURRVAL('BOOK_id_seq'), 'spanish');
INSERT INTO BOOK_IN_SUBCATEGORY (id_book, id_subcategory) 
      SELECT CURRVAL('BOOK_id_seq'), id FROM SUBCATEGORY WHERE name = 'Classics';

    INSERT INTO BOOK (isbn, title, description, year_released, number_of_pages, publisher, cover_img_path) 
    VALUES (NULL, 'Orgullo y prejuicio', '«Es una verdad universalmente aceptada que todo soltero en posesión de una gran fortuna necesita una esposa»: este comienzo —junto con el de Anna Karénina, quizá uno de los más famosos de la historia de la literatura— nos introduce sabiamente en el mundo de Jane Austen y de su novela más emblemática. Orgullo y prejuicio, publicada en 1813 tras el éxito de Juicio y sentimiento, reúne de forma ejemplar sus temas recurrentes y su visión inimitable en la historia de las cinco hijas de la señora Bennett, que no tiene otro objetivo en su vida que conseguir una buena boda para todas ellas. Dos ricos jóvenes, el señor Bingley y el señor Darcy, aparecen en su punto de mira e inmediatamente se ven señalados como posibles «presas». El opresivo ambiente de la familia, la presión del matrimonio y del escándalo, la diferencia de clases, el fantasma de la pobreza y la actitud de una heroína más rica y compleja en sentimientos que cualquier heroína de cualquier novela anterior, se conjugan en esta obra maestra leída y celebrada a lo largo de más de dos siglos.', 
    '1812', NULL, 
    'Alba Editorial',
    'https://res.cloudinary.com/dlja4vnrd/image/upload/v1730155584/bookCoverPics/ocywzqiawwkgtgpgql7l.jpg');
INSERT INTO BOOK_FILES (id_book, original_name, file_path) VALUES (CURRVAL('BOOK_id_seq'), 'book.pdf', 'https://res.cloudinary.com/dlja4vnrd/image/upload/v1730140399/Documento_sin_t%C3%ADtulo_mf50ar.pdf');
INSERT INTO BOOK_FILES (id_book, original_name, file_path) VALUES (CURRVAL('BOOK_id_seq'), 'book.epub', 'https://res.cloudinary.com/dlja4vnrd/raw/upload/v1730140399/Documento_sin_t%C3%ADtulo_awm8cq.epub');
INSERT INTO BOOK_AUTHORS (id_book, author) VALUES (CURRVAL('BOOK_id_seq'), 'Jane Austen');
INSERT INTO BOOK_LANG (id_book, language) VALUES (CURRVAL('BOOK_id_seq'), 'spanish');
INSERT INTO BOOK_IN_SUBCATEGORY (id_book, id_subcategory) 
      SELECT CURRVAL('BOOK_id_seq'), id FROM SUBCATEGORY WHERE name = 'Historical Romance';

    INSERT INTO BOOK (isbn, title, description, year_released, number_of_pages, publisher, cover_img_path) 
    VALUES ('8491990585', 'Breves respuestas a las grandes preguntas', 'No description', 
    '2018', NULL, 
    'Crítica',
    'https://res.cloudinary.com/dlja4vnrd/image/upload/v1723489266/bookCoverPics/di2bbfam1c7ncljxnfw8.jpg');
INSERT INTO BOOK_FILES (id_book, original_name, file_path) VALUES (CURRVAL('BOOK_id_seq'), 'book.pdf', 'https://res.cloudinary.com/dlja4vnrd/image/upload/v1730140399/Documento_sin_t%C3%ADtulo_mf50ar.pdf');
INSERT INTO BOOK_FILES (id_book, original_name, file_path) VALUES (CURRVAL('BOOK_id_seq'), 'book.epub', 'https://res.cloudinary.com/dlja4vnrd/raw/upload/v1730140399/Documento_sin_t%C3%ADtulo_awm8cq.epub');
INSERT INTO BOOK_AUTHORS (id_book, author) VALUES (CURRVAL('BOOK_id_seq'), 'Stephen Hawking [Hawking');
INSERT INTO BOOK_LANG (id_book, language) VALUES (CURRVAL('BOOK_id_seq'), 'spanish');

    INSERT INTO BOOK (isbn, title, description, year_released, number_of_pages, publisher, cover_img_path) 
    VALUES ('9681312473', 'Crónica de una muerte anunciada', 'Crónica de una muerte anunciada, novela corta publicada en 1981, es una de Las obras más conocidas y apreciadas de García Márquez. Relata en forma de reconstrucción casi periodística el asesinato de Santiago Nasar a manos de los gemelos Vicario. Desde el comienzo de la narración se anuncia que Santiago Nasar va a morir: es el joven hijo de un árabe emigrado y parece ser el causante de la deshonra de Ángela, hermana de los gemelos, que ha contraído matrimonio el día anterior y ha sido rechazada por su marido. «Nunca hubo una muerte tan anunciada», declara quien rememora los hechos veintisiete años después: los vengadores, en efecto, no se cansan de proclamar sus propósitos por todo el pueblo, como si quisieran evitar el mandato del destino, pero un cúmulo de casualidades hace que quienes pueden evitar el crimen no logren intervenir o se decidan demasiado tarde. El propio Santiago Nasar se levanta esa mañana despreocupado, ajeno por completo a la muerte que le aguarda.', 
    '1988', NULL, 
    'Editorial Diana S.A. De C.V.',
    'https://res.cloudinary.com/dlja4vnrd/image/upload/v1723489266/bookCoverPics/di2bbfam1c7ncljxnfw8.jpg');
INSERT INTO BOOK_FILES (id_book, original_name, file_path) VALUES (CURRVAL('BOOK_id_seq'), 'book.pdf', 'https://res.cloudinary.com/dlja4vnrd/image/upload/v1730140399/Documento_sin_t%C3%ADtulo_mf50ar.pdf');
INSERT INTO BOOK_FILES (id_book, original_name, file_path) VALUES (CURRVAL('BOOK_id_seq'), 'book.epub', 'https://res.cloudinary.com/dlja4vnrd/raw/upload/v1730140399/Documento_sin_t%C3%ADtulo_awm8cq.epub');
INSERT INTO BOOK_AUTHORS (id_book, author) VALUES (CURRVAL('BOOK_id_seq'), 'Gabriel García Márquez [Márquez');
INSERT INTO BOOK_LANG (id_book, language) VALUES (CURRVAL('BOOK_id_seq'), 'spanish');
INSERT INTO BOOK_IN_SUBCATEGORY (id_book, id_subcategory) 
      SELECT CURRVAL('BOOK_id_seq'), id FROM SUBCATEGORY WHERE name = 'American Poetry';

    INSERT INTO BOOK (isbn, title, description, year_released, number_of_pages, publisher, cover_img_path) 
    VALUES ('8439733836', 'Cien años de soledad (Edición ilustrada)', 'No description', 
    '2017', NULL, 
    'Literatura Random House',
    'https://res.cloudinary.com/dlja4vnrd/image/upload/v1723489266/bookCoverPics/di2bbfam1c7ncljxnfw8.jpg');
INSERT INTO BOOK_FILES (id_book, original_name, file_path) VALUES (CURRVAL('BOOK_id_seq'), 'book.pdf', 'https://res.cloudinary.com/dlja4vnrd/image/upload/v1730140399/Documento_sin_t%C3%ADtulo_mf50ar.pdf');
INSERT INTO BOOK_FILES (id_book, original_name, file_path) VALUES (CURRVAL('BOOK_id_seq'), 'book.epub', 'https://res.cloudinary.com/dlja4vnrd/raw/upload/v1730140399/Documento_sin_t%C3%ADtulo_awm8cq.epub');
INSERT INTO BOOK_AUTHORS (id_book, author) VALUES (CURRVAL('BOOK_id_seq'), 'Gabriel García Márquez');
INSERT INTO BOOK_LANG (id_book, language) VALUES (CURRVAL('BOOK_id_seq'), 'spanish');
INSERT INTO BOOK_IN_SUBCATEGORY (id_book, id_subcategory) 
      SELECT CURRVAL('BOOK_id_seq'), id FROM SUBCATEGORY WHERE name = 'Others';

    INSERT INTO BOOK (isbn, title, description, year_released, number_of_pages, publisher, cover_img_path) 
    VALUES (NULL, 'Bajo la misma estrella', 'No description', 
    NULL, NULL, 
    NULL,
    'https://res.cloudinary.com/dlja4vnrd/image/upload/v1723489266/bookCoverPics/di2bbfam1c7ncljxnfw8.jpg');
INSERT INTO BOOK_FILES (id_book, original_name, file_path) VALUES (CURRVAL('BOOK_id_seq'), 'book.pdf', 'https://res.cloudinary.com/dlja4vnrd/image/upload/v1730140399/Documento_sin_t%C3%ADtulo_mf50ar.pdf');
INSERT INTO BOOK_FILES (id_book, original_name, file_path) VALUES (CURRVAL('BOOK_id_seq'), 'book.epub', 'https://res.cloudinary.com/dlja4vnrd/raw/upload/v1730140399/Documento_sin_t%C3%ADtulo_awm8cq.epub');
INSERT INTO BOOK_AUTHORS (id_book, author) VALUES (CURRVAL('BOOK_id_seq'), 'John Green');
INSERT INTO BOOK_LANG (id_book, language) VALUES (CURRVAL('BOOK_id_seq'), 'spanish');
INSERT INTO BOOK_IN_SUBCATEGORY (id_book, id_subcategory) 
      SELECT CURRVAL('BOOK_id_seq'), id FROM SUBCATEGORY WHERE name = 'Love & Romance';

    INSERT INTO BOOK (isbn, title, description, year_released, number_of_pages, publisher, cover_img_path) 
    VALUES ('8499987931', 'Almendra', 'Almendra es una historia sobre crecer, descubrirse a uno mismo y aceptar que la ayuda no siempre viene por donde la esperamos.Yunjae tiene dieciséis años, está en la edad de las emociones desbordadas, el amor y la rabia. Pero las amígdalas de su cerebro son pequeñas, más pequeñas que una almendra y, como consecuencia, Yunjae es incapaz de sentir nada.Educado por su madre y su abuela, aprende a identificar las emociones de los demás y a fingir estados de ánimo para no destacar en un mundo que pronto lo tachará de extraño. «Si tu interlocutor llora, tú entrecierra los ojos, baja la cabeza y dale una suave palmada en la espalda», le dice su madre. Así construye una aparente normalidad que se hace trizas el día en que un psicópata ataca a ambas mujeres en la calle. Desde entonces, Yunjae debe aprender a vivir solo, sin deseo de derramar una lágrima, sin tristeza ni miedo ni felicidad.A Yunjae le tienden la mano personas improbables: un antiguo amigo de su madre, una chica capaz de romper certezas e incluso un abusón con más afinidad de la esperada. Los tres quebrarán la soledad del protagonista de Almendra.Una novela breve y lacerante en la que solo la empatía puede llevar a la esperanza.', 
    '2020', '256', 
    'Grupo Planeta 2020',
    'https://res.cloudinary.com/dlja4vnrd/image/upload/v1723489266/bookCoverPics/di2bbfam1c7ncljxnfw8.jpg');
INSERT INTO BOOK_FILES (id_book, original_name, file_path) VALUES (CURRVAL('BOOK_id_seq'), 'book.pdf', 'https://res.cloudinary.com/dlja4vnrd/image/upload/v1730140399/Documento_sin_t%C3%ADtulo_mf50ar.pdf');
INSERT INTO BOOK_FILES (id_book, original_name, file_path) VALUES (CURRVAL('BOOK_id_seq'), 'book.epub', 'https://res.cloudinary.com/dlja4vnrd/raw/upload/v1730140399/Documento_sin_t%C3%ADtulo_awm8cq.epub');
INSERT INTO BOOK_AUTHORS (id_book, author) VALUES (CURRVAL('BOOK_id_seq'), 'Won-Pyung Sohn');
INSERT INTO BOOK_LANG (id_book, language) VALUES (CURRVAL('BOOK_id_seq'), 'spanish');
INSERT INTO BOOK_IN_SUBCATEGORY (id_book, id_subcategory) 
      SELECT CURRVAL('BOOK_id_seq'), id FROM SUBCATEGORY WHERE name = 'Drama';

    INSERT INTO BOOK (isbn, title, description, year_released, number_of_pages, publisher, cover_img_path) 
    VALUES (NULL, 'Tan poca vida', 'Para descubrir...Qué dicen y qué callan los hombres.De dónde viene y dónde va la culpa.Cuánto importa el sexo.A quien podemos llamar amigo.Y finalmente...Qué precio tiene la vida y cuándo deja de tener valor.Para descubrir eso y más, aquí está Tan poca vida, una historia que recorre más de tres décadas de amistad en la vida de cuatro hombres que crecen juntos en Manhattan. Cuatro hombres que tienen que sobrevivir al fracaso y al éxito y que, a lo largo de los años, aprenden a sobreponerse a las crisis económicas, sociales y emocionales. Cuatro hombres que comparten una idea muy peculiar de la intimidad, una manera de estar juntos hecha de pocas palabras y muchos gestos. Cuatro hombres cuya relación la autora utiliza para realizar una minuciosa indagación de los límites de la naturaleza humana.', 
    '2015', NULL, 
    NULL,
    'https://res.cloudinary.com/dlja4vnrd/image/upload/v1723489266/bookCoverPics/di2bbfam1c7ncljxnfw8.jpg');
INSERT INTO BOOK_FILES (id_book, original_name, file_path) VALUES (CURRVAL('BOOK_id_seq'), 'book.pdf', 'https://res.cloudinary.com/dlja4vnrd/image/upload/v1730140399/Documento_sin_t%C3%ADtulo_mf50ar.pdf');
INSERT INTO BOOK_FILES (id_book, original_name, file_path) VALUES (CURRVAL('BOOK_id_seq'), 'book.epub', 'https://res.cloudinary.com/dlja4vnrd/raw/upload/v1730140399/Documento_sin_t%C3%ADtulo_awm8cq.epub');
INSERT INTO BOOK_AUTHORS (id_book, author) VALUES (CURRVAL('BOOK_id_seq'), 'Hanya Yanagihara');
INSERT INTO BOOK_LANG (id_book, language) VALUES (CURRVAL('BOOK_id_seq'), 'spanish');
INSERT INTO BOOK_IN_SUBCATEGORY (id_book, id_subcategory) 
      SELECT CURRVAL('BOOK_id_seq'), id FROM SUBCATEGORY WHERE name = 'Emotional Healing';

    INSERT INTO BOOK (isbn, title, description, year_released, number_of_pages, publisher, cover_img_path) 
    VALUES ('B084X8WM2J', 'Los siete maridos de Evelyn Hugo', 'No description', 
    NULL, NULL, 
    NULL,
    'https://res.cloudinary.com/dlja4vnrd/image/upload/v1723489266/bookCoverPics/di2bbfam1c7ncljxnfw8.jpg');
INSERT INTO BOOK_FILES (id_book, original_name, file_path) VALUES (CURRVAL('BOOK_id_seq'), 'book.pdf', 'https://res.cloudinary.com/dlja4vnrd/image/upload/v1730140399/Documento_sin_t%C3%ADtulo_mf50ar.pdf');
INSERT INTO BOOK_FILES (id_book, original_name, file_path) VALUES (CURRVAL('BOOK_id_seq'), 'book.epub', 'https://res.cloudinary.com/dlja4vnrd/raw/upload/v1730140399/Documento_sin_t%C3%ADtulo_awm8cq.epub');
INSERT INTO BOOK_AUTHORS (id_book, author) VALUES (CURRVAL('BOOK_id_seq'), 'Taylor Jenkins Reid');
INSERT INTO BOOK_LANG (id_book, language) VALUES (CURRVAL('BOOK_id_seq'), 'spanish');
INSERT INTO BOOK_IN_SUBCATEGORY (id_book, id_subcategory) 
      SELECT CURRVAL('BOOK_id_seq'), id FROM SUBCATEGORY WHERE name = 'Romantic Comedy';

    INSERT INTO BOOK (isbn, title, description, year_released, number_of_pages, publisher, cover_img_path) 
    VALUES ('B009XIIS22', 'Este libro le hara mas inteligente - Nuevos conceptos cientificos para mejorar su pensamiento', 'Downloaded from z-lib.org', 
    '2012', NULL, 
    'Grupo Planeta',
    'https://res.cloudinary.com/dlja4vnrd/image/upload/v1723489266/bookCoverPics/di2bbfam1c7ncljxnfw8.jpg');
INSERT INTO BOOK_FILES (id_book, original_name, file_path) VALUES (CURRVAL('BOOK_id_seq'), 'book.pdf', 'https://res.cloudinary.com/dlja4vnrd/image/upload/v1730140399/Documento_sin_t%C3%ADtulo_mf50ar.pdf');
INSERT INTO BOOK_FILES (id_book, original_name, file_path) VALUES (CURRVAL('BOOK_id_seq'), 'book.epub', 'https://res.cloudinary.com/dlja4vnrd/raw/upload/v1730140399/Documento_sin_t%C3%ADtulo_awm8cq.epub');
INSERT INTO BOOK_AUTHORS (id_book, author) VALUES (CURRVAL('BOOK_id_seq'), 'Brockman');
INSERT INTO BOOK_LANG (id_book, language) VALUES (CURRVAL('BOOK_id_seq'), 'spanish');
INSERT INTO BOOK_IN_SUBCATEGORY (id_book, id_subcategory) 
      SELECT CURRVAL('BOOK_id_seq'), id FROM SUBCATEGORY WHERE name = 'Others';

    INSERT INTO BOOK (isbn, title, description, year_released, number_of_pages, publisher, cover_img_path) 
    VALUES (NULL, 'La canción de Aquiles', 'Downloaded from z-lib.org', 
    '2012', NULL, 
    NULL,
    'https://res.cloudinary.com/dlja4vnrd/image/upload/v1723489266/bookCoverPics/di2bbfam1c7ncljxnfw8.jpg');
INSERT INTO BOOK_FILES (id_book, original_name, file_path) VALUES (CURRVAL('BOOK_id_seq'), 'book.pdf', 'https://res.cloudinary.com/dlja4vnrd/image/upload/v1730140399/Documento_sin_t%C3%ADtulo_mf50ar.pdf');
INSERT INTO BOOK_FILES (id_book, original_name, file_path) VALUES (CURRVAL('BOOK_id_seq'), 'book.epub', 'https://res.cloudinary.com/dlja4vnrd/raw/upload/v1730140399/Documento_sin_t%C3%ADtulo_awm8cq.epub');
INSERT INTO BOOK_AUTHORS (id_book, author) VALUES (CURRVAL('BOOK_id_seq'), 'Madeline Miller');
INSERT INTO BOOK_LANG (id_book, language) VALUES (CURRVAL('BOOK_id_seq'), 'spanish');
INSERT INTO BOOK_IN_SUBCATEGORY (id_book, id_subcategory) 
      SELECT CURRVAL('BOOK_id_seq'), id FROM SUBCATEGORY WHERE name = 'Contemporary Fiction';

    INSERT INTO BOOK (isbn, title, description, year_released, number_of_pages, publisher, cover_img_path) 
    VALUES ('842043311X', 'Llámame por tu nombre', 'Downloaded from z-lib.org', 
    '2018', NULL, 
    'ALFAGUARA',
    'https://res.cloudinary.com/dlja4vnrd/image/upload/v1723489266/bookCoverPics/di2bbfam1c7ncljxnfw8.jpg');
INSERT INTO BOOK_FILES (id_book, original_name, file_path) VALUES (CURRVAL('BOOK_id_seq'), 'book.pdf', 'https://res.cloudinary.com/dlja4vnrd/image/upload/v1730140399/Documento_sin_t%C3%ADtulo_mf50ar.pdf');
INSERT INTO BOOK_FILES (id_book, original_name, file_path) VALUES (CURRVAL('BOOK_id_seq'), 'book.epub', 'https://res.cloudinary.com/dlja4vnrd/raw/upload/v1730140399/Documento_sin_t%C3%ADtulo_awm8cq.epub');
INSERT INTO BOOK_AUTHORS (id_book, author) VALUES (CURRVAL('BOOK_id_seq'), 'André Aciman');
INSERT INTO BOOK_LANG (id_book, language) VALUES (CURRVAL('BOOK_id_seq'), 'spanish');
INSERT INTO BOOK_IN_SUBCATEGORY (id_book, id_subcategory) 
      SELECT CURRVAL('BOOK_id_seq'), id FROM SUBCATEGORY WHERE name = 'Drama';

    INSERT INTO BOOK (isbn, title, description, year_released, number_of_pages, publisher, cover_img_path) 
    VALUES ('50001444', 'El libro que tu cerebro no quiere leer', 'Una propuesta original, útil y amena a medio camino entre guía de inspiración, divulgación científica y filosofía práctica. . Una obra que nos muestra que nuestra percepción de la realidad es limitada, explica el funcionamiento del cerebro y propone un camino para cambiar nuestra perspectiva y encontrar la felicidad. . El autor entrelaza anécdotas de su propia vida, experimentos científicos y referencias a personajes conocidos y a la cultura popular. ¿Podemos reeducar el cerebro para ser más felices y vivir con plenitud? La respuesta es un rotundo sí. Hoy, gracias a los avances en neurociencia, podemos entender mejor cómo funcionan la mente y el organismo, y utilizar ese conocimiento para mejorar nuestra realidad. Vivimos rodeados de una cantidad descomunal de información y solo una pequeña parte (alrededor de un 5%) alcanza nuestra consciencia. Cuando entendemos cómo el organismo genera los pensamientos y la realidad, podemos influir en el sistema para sustituir el miedo, las imágenes mentales más arraigadas y los mecanismos de respuesta automáticos por el pensamiento no lineal, la felicidad y la confianza en la vida, que siempre está ahí para proporcionarnos aquello que necesitamos. Desde una perspectiva tan didáctica como divertida, David del Rosario, investigador y divulgador científico, convierte la neurociencia en una herramienta de transformación, cien por cien aplicable en el día a día. Un viaje fascinante, del átomo a las estrellas, que revolucionará tu forma de vivir y de entender el mundo.', 
    '2019', NULL, 
    '13insurgentes',
    'https://res.cloudinary.com/dlja4vnrd/image/upload/v1723489266/bookCoverPics/di2bbfam1c7ncljxnfw8.jpg');
INSERT INTO BOOK_FILES (id_book, original_name, file_path) VALUES (CURRVAL('BOOK_id_seq'), 'book.pdf', 'https://res.cloudinary.com/dlja4vnrd/image/upload/v1730140399/Documento_sin_t%C3%ADtulo_mf50ar.pdf');
INSERT INTO BOOK_FILES (id_book, original_name, file_path) VALUES (CURRVAL('BOOK_id_seq'), 'book.epub', 'https://res.cloudinary.com/dlja4vnrd/raw/upload/v1730140399/Documento_sin_t%C3%ADtulo_awm8cq.epub');
INSERT INTO BOOK_AUTHORS (id_book, author) VALUES (CURRVAL('BOOK_id_seq'), 'David del Rosario');
INSERT INTO BOOK_LANG (id_book, language) VALUES (CURRVAL('BOOK_id_seq'), 'spanish');
INSERT INTO BOOK_IN_SUBCATEGORY (id_book, id_subcategory) 
      SELECT CURRVAL('BOOK_id_seq'), id FROM SUBCATEGORY WHERE name = 'Personal Growth & Inspiration';

    INSERT INTO BOOK (isbn, title, description, year_released, number_of_pages, publisher, cover_img_path) 
    VALUES (NULL, 'Cien años de soledad', '«Muchos años después, frente al pelotón de fusilamiento, el coronel Aureliano Buendía había de recordar aquella tarde remota en que su padre lo llevó a conocer el hielo». Macondo, en ese entonces, era una pequeña aldea a la que llegaban todos los años, por el mes de marzo, los gitanos dirigidos por Melquíades, llevando los últimos inventos de la ciencia. El patriarca y fundador de Macondo, José Arcadio Buendía, se obsesiona con los inventos de los gitanos al extremo de descuidar a su familia. Descubre que la tierra es redonda y planea un viaje para encontrar la tierra de los inventos, pero luego de un peligroso viaje, sólo llega al mar. Ante su decisión de abandonar Macondo, Úrsula, su mujer, lo detiene y le dice que se ocupe de sus hijos. José Arcadio se entretiene en darles leccciones poco verídicas a sus hijos, José Arcadio y Aureliano. Cuando vuelven los gitanos, José Arcadio se entera de la muerte de Melquíades. Además, junto con sus dos hijos, conoce el hielo, que el cree es el más grande invento de su tiempo.', 
    '1967', NULL, 
    'Le Libros',
    'https://res.cloudinary.com/dlja4vnrd/image/upload/v1723489266/bookCoverPics/di2bbfam1c7ncljxnfw8.jpg');
INSERT INTO BOOK_FILES (id_book, original_name, file_path) VALUES (CURRVAL('BOOK_id_seq'), 'book.pdf', 'https://res.cloudinary.com/dlja4vnrd/image/upload/v1730140399/Documento_sin_t%C3%ADtulo_mf50ar.pdf');
INSERT INTO BOOK_FILES (id_book, original_name, file_path) VALUES (CURRVAL('BOOK_id_seq'), 'book.epub', 'https://res.cloudinary.com/dlja4vnrd/raw/upload/v1730140399/Documento_sin_t%C3%ADtulo_awm8cq.epub');
INSERT INTO BOOK_AUTHORS (id_book, author) VALUES (CURRVAL('BOOK_id_seq'), 'Gabriel García Márquez');
INSERT INTO BOOK_LANG (id_book, language) VALUES (CURRVAL('BOOK_id_seq'), 'spanish');
INSERT INTO BOOK_IN_SUBCATEGORY (id_book, id_subcategory) 
      SELECT CURRVAL('BOOK_id_seq'), id FROM SUBCATEGORY WHERE name = 'Others';
