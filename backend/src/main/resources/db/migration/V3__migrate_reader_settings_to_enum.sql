-- Migrate background_color values to uppercase ENUM format
UPDATE Reader_Setting SET background_color = 'WHITE'       WHERE background_color IN ('Trắng', 'White', 'white');
UPDATE Reader_Setting SET background_color = 'CREAM'       WHERE background_color IN ('Kem', 'Cream', 'cream');
UPDATE Reader_Setting SET background_color = 'LIGHT_BLUE'  WHERE background_color IN ('Xanh nhạt', 'LightBlue', 'light_blue', 'Light_Blue');
UPDATE Reader_Setting SET background_color = 'LIGHT_YELLOW'WHERE background_color IN ('Vàng nhạt', 'LightYellow', 'light_yellow', 'Light_Yellow');
UPDATE Reader_Setting SET background_color = 'LIGHT_GRAY'  WHERE background_color IN ('Xám nhạt', 'LightGray', 'light_gray', 'Light_Gray');
UPDATE Reader_Setting SET background_color = 'DARK'        WHERE background_color IN ('Tối', 'Dark', 'dark');
UPDATE Reader_Setting SET background_color = 'BLACK'       WHERE background_color IN ('Đen', 'Black', 'black');

-- Migrate font_family values to uppercase ENUM format
UPDATE Reader_Setting SET font_family = 'DEFAULT'         WHERE font_family IN ('inherit', 'Mặc định', 'Default', 'default');
UPDATE Reader_Setting SET font_family = 'SERIF'           WHERE font_family IN ('Georgia, serif', 'Serif', 'serif');
UPDATE Reader_Setting SET font_family = 'SANS_SERIF'      WHERE font_family IN ('Arial, sans-serif', 'Sans-serif', 'sans-serif', 'Sans_Serif');
UPDATE Reader_Setting SET font_family = 'MONO'            WHERE font_family IN ('''Courier New'', monospace', 'Mono', 'mono');
UPDATE Reader_Setting SET font_family = 'TIMES_NEW_ROMAN' WHERE font_family IN ('''Times New Roman'', serif', 'Times New Roman', 'Times_New_Roman');
