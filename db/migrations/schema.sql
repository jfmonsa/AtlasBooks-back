

-- Creación de tablas
CREATE TABLE BOOK (
    id SERIAL,
    isbn VARCHAR(50),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    year_released INTEGER,
    volume INTEGER,
    number_of_pages INTEGER,
    publisher VARCHAR(50),
    cover_img_path VARCHAR(255) NOT NULL,

    PRIMARY KEY(id)
) ;

CREATE TABLE BOOK_FILES (
    id SERIAL,
    id_book INTEGER,
    file_path VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,

    PRIMARY KEY(id),
    CONSTRAINT fk_id_book_book_files FOREIGN KEY (id_book) REFERENCES BOOK(id) ON DELETE CASCADE ON UPDATE CASCADE
) ;


CREATE TABLE BOOK_AUTHORS (
    id SERIAL,
    id_book INTEGER,
    author VARCHAR(255) NOT NULL,

    PRIMARY KEY(id),
    CONSTRAINT fk_id_book_book_authors FOREIGN KEY (id_book) REFERENCES BOOK(id) ON DELETE CASCADE ON UPDATE CASCADE
) ;


CREATE TABLE BOOK_LANG (
    id SERIAL,
    id_book INTEGER,
    language VARCHAR(50) NOT NULL,

    PRIMARY KEY(id),
    CONSTRAINT fk_id_book_book_lang FOREIGN KEY (id_book) REFERENCES BOOK(id) ON DELETE CASCADE ON UPDATE CASCADE
) ;


CREATE TYPE user_role AS ENUM ('ADMIN', 'USER_BASIC', 'USER_PREMIUM');

CREATE TABLE USERS (
    id SERIAL,
    full_name VARCHAR(255) NOT NULL,
    nickname VARCHAR(50) UNIQUE,
    email VARCHAR(255) UNIQUE,
    country VARCHAR(100),
    register_date DATE NOT NULL,
    password VARCHAR(255) NOT NULL,
    profile_img_path VARCHAR(255),
    is_active BOOLEAN NOT NULL, -- is not banned?
    role user_role NOT NULL,

    PRIMARY KEY(id)
) ;

CREATE TABLE BOOK_COMMENT (
    id SERIAL,
    id_user INTEGER,
    id_book INTEGER,
    date_commented TIMESTAMP NOT NULL,
    text_commented TEXT NOT NULL,

    PRIMARY KEY(id),
    CONSTRAINT fk_id_book_book_comment FOREIGN KEY (id_book) REFERENCES BOOK(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_id_user_book_comment FOREIGN KEY (id_user) REFERENCES USERS(id) ON DELETE CASCADE ON UPDATE CASCADE
) ;


CREATE TABLE BOOK_RATE (
    id_user INTEGER,
    id_book INTEGER,
    rate_value INTEGER NOT NULL,

    PRIMARY KEY (id_user, id_book),
    CONSTRAINT fk_id_user_book_rate FOREIGN KEY (id_user) REFERENCES USERS(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_id_book_book_rate FOREIGN KEY (id_book) REFERENCES BOOK(id) ON DELETE CASCADE ON UPDATE CASCADE
) ;


CREATE TABLE BOOK_UPLOAD (
    id_user INTEGER,
    id_book INTEGER,
    date_uploaded TIMESTAMP NOT NULL,

    PRIMARY KEY (id_user, id_book),
    CONSTRAINT fk_id_user_book_upload FOREIGN KEY (id_user) REFERENCES USERS(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_id_book_book_upload FOREIGN KEY (id_book) REFERENCES BOOK(id) ON DELETE CASCADE ON UPDATE CASCADE
) ;


CREATE TABLE BOOK_DOWNLOAD (
    id_user INTEGER,
    id_book INTEGER,
    date_downloaded TIMESTAMP NOT NULL,

    PRIMARY KEY (id_user, id_book),
    CONSTRAINT fk_id_user_book_download FOREIGN KEY (id_user) REFERENCES USERS(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_id_book_book_download FOREIGN KEY (id_book) REFERENCES BOOK(id) ON DELETE CASCADE ON UPDATE CASCADE
) ;


CREATE TABLE BOOK_REPORT (
    id SERIAL,
    id_user INTEGER,
    id_book INTEGER,
    date_reported TIMESTAMP NOT NULL,
    motivation TEXT NOT NULL,
    is_report_solved BOOLEAN NOT NULL, -- is the report solved by staff?
    PRIMARY KEY (id),
    CONSTRAINT fk_id_user_book_report FOREIGN KEY (id_user) REFERENCES USERS(id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_id_book_book_report FOREIGN KEY (id_book) REFERENCES BOOK(id) ON DELETE CASCADE ON UPDATE CASCADE
) ;


CREATE TABLE BOOK_DELETE (
    id SERIAL,
    id_admin INTEGER,
    id_book INTEGER,
    date_delete_at TIMESTAMP NOT NULL,
    motivation TEXT NOT NULL,

    PRIMARY KEY(id),
    CONSTRAINT fk_id_user_book_delete FOREIGN KEY (id_admin) REFERENCES USERS(id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_id_book_book_delete FOREIGN KEY (id_book) REFERENCES BOOK(id) ON DELETE SET NULL ON UPDATE CASCADE
) ;


CREATE TABLE USER_BAN (
    id SERIAL,
    id_user_banned INTEGER,
    id_admin_who_banned INTEGER,
    motivation TEXT NOT NULL,
    date_banned_at TIMESTAMP NOT NULL,

    PRIMARY KEY(id),
    CONSTRAINT fk_id_user_banned_user_ban FOREIGN KEY (id_user_banned) REFERENCES USERS(id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_id_admin_who_banned_user_ban FOREIGN KEY (id_admin_who_banned) REFERENCES USERS(id) ON DELETE SET NULL ON UPDATE CASCADE
) ;


CREATE TABLE BOOK_LIST (
    id SERIAL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    date_created_at DATE NOT NULL,
    id_user INTEGER,
    is_public BOOLEAN NOT NULL,

    PRIMARY KEY(id),
    CONSTRAINT fk_id_user_book_list FOREIGN KEY (id_user) REFERENCES USERS(id) ON DELETE CASCADE ON UPDATE CASCADE
) ;


CREATE TABLE BOOK_IN_LIST (
    id_book INTEGER,
    id_list INTEGER,

    PRIMARY KEY (id_book, id_list),
    CONSTRAINT fk_id_book_book_in_list FOREIGN KEY (id_book) REFERENCES BOOK(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_id_list_book_in_list FOREIGN KEY (id_list) REFERENCES BOOK_LIST(id) ON DELETE CASCADE ON UPDATE CASCADE
) ;


CREATE TABLE CATEGORY (
    id SERIAL,
    name VARCHAR(255) NOT NULL,

    PRIMARY KEY(id)
) ;


CREATE TABLE SUBCATEGORY (
    id SERIAL,
    name VARCHAR(255) NOT NULL,
    id_category_father INTEGER,

    PRIMARY KEY(id),
    CONSTRAINT fk_id_category_father_subcategory FOREIGN KEY (id_category_father) REFERENCES CATEGORY(id) ON DELETE CASCADE ON UPDATE CASCADE
) ;


CREATE TABLE BOOK_IN_SUBCATEGORY (
    id_book INTEGER,
    id_subcategory INTEGER,
        
    PRIMARY KEY (id_book, id_subcategory),
    CONSTRAINT fk_id_book_book_in_subcategory FOREIGN KEY (id_book) REFERENCES BOOK(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_id_subcategory_book_in_subcategory FOREIGN KEY (id_subcategory) REFERENCES SUBCATEGORY(id) ON DELETE CASCADE ON UPDATE CASCADE

) ;