-- for BOOK table
CREATE INDEX idx_book_isbn ON BOOK(isbn);
CREATE INDEX idx_book_title ON BOOK(title);
CREATE INDEX idx_book_year_released ON BOOK(year_released);
CREATE INDEX idx_book_publisher ON BOOK(publisher);

-- for BOOK_FILES table
CREATE INDEX idx_book_files_id_book ON BOOK_FILES(id_book);

-- for BOOK_AUTHORS table
CREATE INDEX idx_book_authors_id_book ON BOOK_AUTHORS(id_book);
CREATE INDEX idx_book_authors_author ON BOOK_AUTHORS(author);

-- for BOOK_LANG table
CREATE INDEX idx_book_lang_id_book ON BOOK_LANG(id_book);
CREATE INDEX idx_book_lang_language ON BOOK_LANG(language);

-- for USERS table
CREATE INDEX idx_users_email ON USERS(email);
CREATE INDEX idx_users_nickname ON USERS(nickname);
CREATE INDEX idx_users_is_active ON USERS(is_active);

-- for book BOOK_COMMENT table
CREATE INDEX idx_book_comment_id_user ON BOOK_COMMENT(id_user);
CREATE INDEX idx_book_comment_id_book ON BOOK_COMMENT(id_book);
CREATE INDEX idx_book_comment_date_commented ON BOOK_COMMENT(date_commented);

-- for book BOOK_RATE table
CREATE INDEX idx_book_rate_id_user ON BOOK_RATE(id_user);
CREATE INDEX idx_book_rate_id_book ON BOOK_RATE(id_book);
CREATE INDEX idx_book_rate_rate_value ON BOOK_RATE(rate_value);

-- for BOOK_UPLOAD table
CREATE INDEX idx_book_upload_id_user ON BOOK_UPLOAD(id_user);
CREATE INDEX idx_book_upload_id_book ON BOOK_UPLOAD(id_book);
CREATE INDEX idx_book_upload_date_uploaded ON BOOK_UPLOAD(date_uploaded);

-- for BOOK_DOWNLOAD table
CREATE INDEX idx_book_download_id_user ON BOOK_DOWNLOAD(id_user);
CREATE INDEX idx_book_download_id_book ON BOOK_DOWNLOAD(id_book);
CREATE INDEX idx_book_download_date_downloaded ON BOOK_DOWNLOAD(date_downloaded);

-- for book BOOK_REPORT
CREATE INDEX idx_book_report_id_user ON BOOK_REPORT(id_user);
CREATE INDEX idx_book_report_id_book ON BOOK_REPORT(id_book);
CREATE INDEX idx_book_report_date_reported ON BOOK_REPORT(date_reported);
CREATE INDEX idx_book_report_is_report_solved ON BOOK_REPORT(is_report_solved);

-- for BOOK_DELETE table
CREATE INDEX idx_book_delete_id_admin ON BOOK_DELETE(id_admin);
CREATE INDEX idx_book_delete_id_book ON BOOK_DELETE(id_book);
CREATE INDEX idx_book_delete_date_delete_at ON BOOK_DELETE(date_delete_at);

-- for USER_BAN table
CREATE INDEX idx_user_ban_id_user_banned ON USER_BAN(id_user_banned);
CREATE INDEX idx_user_ban_id_admin_who_banned ON USER_BAN(id_admin_who_banned);
CREATE INDEX idx_user_ban_date_banned_at ON USER_BAN(date_banned_at);

-- for BOOK_LIST talbe
CREATE INDEX idx_book_list_id_user ON BOOK_LIST(id_user);
CREATE INDEX idx_book_list_is_public ON BOOK_LIST(is_public);

-- for BOOK_IN_LIST table
CREATE INDEX idx_book_in_list_id_book ON BOOK_IN_LIST(id_book);
CREATE INDEX idx_book_in_list_id_list ON BOOK_IN_LIST(id_list);

-- for CATEGORY table
CREATE INDEX idx_category_name ON CATEGORY(name);

-- for SUBCATEGORY table
CREATE INDEX idx_subcategory_id_category_father ON SUBCATEGORY(id_category_father);
CREATE INDEX idx_subcategory_name ON SUBCATEGORY(name);

-- for BOOK_IN_SUBCATEGORY table
CREATE INDEX idx_book_in_subcategory_id_book ON BOOK_IN_SUBCATEGORY(id_book);
CREATE INDEX idx_book_in_subcategory_id_subcategory ON BOOK_IN_SUBCATEGORY(id_subcategory);