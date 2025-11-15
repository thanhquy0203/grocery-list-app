import { GroceryItem } from "@/types/grocery";
import { SQLiteDatabase } from "expo-sqlite";


export const initDb = async (db: SQLiteDatabase) => {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS grocery_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      quantity INTEGER DEFAULT 1,
      category TEXT,
      bought INTEGER DEFAULT 0,
      created_at INTEGER
    );
   `);

  
 type CountRow = { count: number };

const rows = await db.getAllAsync<CountRow>(
  `SELECT COUNT(*) as count FROM grocery_items`
);

const isEmpty = rows[0]?.count === 0;

  
  if (isEmpty) {
    await db.runAsync(
      `INSERT INTO grocery_items (name, quantity, category, bought, created_at)
       VALUES (?, ?, ?, ?, ?)`,
      ["Sữa", 1, "Đồ uống", 0, Date.now()]
    );

    await db.runAsync(
      `INSERT INTO grocery_items (name, quantity, category, bought, created_at)
       VALUES (?, ?, ?, ?, ?)`,
      ["Trứng", 12, "Thực phẩm", 0, Date.now()]
    );

    await db.runAsync(
      `INSERT INTO grocery_items (name, quantity, category, bought, created_at)
       VALUES (?, ?, ?, ?, ?)`,
      ["Bánh mì", 2, "Đồ ăn sáng", 0, Date.now()]
    );
  }

  
};

export const getItems = async (db: SQLiteDatabase): Promise<GroceryItem[]> => {
  return await db.getAllAsync<GroceryItem>(
    `SELECT * FROM grocery_items ORDER BY created_at DESC`
  );
};

export const createItem = async (db: SQLiteDatabase, data: any) => {
  await db.runAsync(
    `INSERT INTO grocery_items (name, quantity, category, bought, created_at)
     VALUES (?, ?, ?, ?, ?)`,
    [
      data.name,
      data.quantity ?? 1,
      data.category ?? "",
      data.bought ?? 0,
      Date.now(),
    ]
  );
};


export const toggleBought = async (db: SQLiteDatabase, id: number, current: number) => {
  const newValue = current === 1 ? 0 : 1;

  await db.runAsync(
    `UPDATE grocery_items SET bought = ? WHERE id = ?`,
    [newValue, id]
  );
};

// lấy 1 item theo ID
export const getItemById = async ( db: SQLiteDatabase,  id: number): 
Promise<GroceryItem | undefined> => {
  const rows = await db.getAllAsync<GroceryItem>(
    `SELECT * FROM grocery_items WHERE id = ?`, [id] );
  return rows[0];
};

// cập nhật item
export const updateItem = async (
  db: SQLiteDatabase,
  item: { id: number; name: string; quantity: number; category: string }
) => {
  await db.runAsync(
    `UPDATE grocery_items SET name=?, quantity=?, category=? WHERE id=?`,
    [item.name, item.quantity, item.category, item.id]
  );
};


// xóa item
export const deleteItem = async (db: SQLiteDatabase, id: number) => {
  await db.runAsync(
    `DELETE FROM grocery_items WHERE id = ?`,
    [id]
  );
};


