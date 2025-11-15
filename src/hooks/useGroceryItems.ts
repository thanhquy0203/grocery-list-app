import { useState, useCallback, useMemo } from "react";
import { useSQLiteContext } from "expo-sqlite";
import { GroceryItem } from "@/types/grocery";
import {
  getItems,
  createItem,
  updateItem,
  deleteItem,
  toggleBought,
} from "@/db/db";

export function useGroceryItems() {
  const db = useSQLiteContext();

  const [items, setItems] = useState<GroceryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [importLoading, setImportLoading] = useState(false);
  const [importError, setImportError] = useState("");

  // Load list
  const loadData = useCallback(async () => {
    setLoading(true);
    const data = await getItems(db);
    setItems(data);
    setLoading(false);
  }, [db]);

  // Pull to refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, [loadData]);

  // Insert
  const addItem = useCallback(
    async (data: any) => {
      await createItem(db, data);
      await loadData();
    },
    [db, loadData]
  );

  // Edit
  const editItem = useCallback(
    async (item: GroceryItem) => {
      await updateItem(db, item);
      await loadData();
    },
    [db, loadData]
  );

  // Delete
  const removeItem = useCallback(
    async (id: number) => {
      await deleteItem(db, id);
      await loadData();
    },
    [db, loadData]
  );

  // Toggle bought
  const toggleItem = useCallback(
    async (item: GroceryItem) => {
      await toggleBought(db, item.id, item.bought);
      await loadData();
    },
    [db, loadData]
  );

  // Import API
  const importFromApi = useCallback(
    async () => {
      setImportLoading(true);
      setImportError("");

      try {
        const response = await fetch(
          "https://68e8a3ccf2707e6128cb89f7.mockapi.io/huynhthanhquy_22638141_final"
        );

        if (!response.ok) throw new Error("Fetch API thất bại");

        const apiItems = await response.json();

        for (const api of apiItems) {
          const existed = items.find(
            x => x.name.toLowerCase() === api.name.toLowerCase()
          );
          if (existed) continue;

          await createItem(db, {
            name: api.name,
            quantity: api.quantity ?? 1,
            category: api.category ?? "",
            bought: api.completed ? 1 : 0,
          });
        }

        await loadData();
      } catch (err: any) {
        setImportError(err.message);
      }

      setImportLoading(false);
    },
    [items, db, loadData]
  );

  // Filter
  const filteredItems = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return items;

    return items.filter(item =>
      item.name.toLowerCase().includes(keyword)
    );
  }, [items, search]);

  return { items, filteredItems, loading, refreshing, importLoading, importError, search, setSearch, loadData, onRefresh, addItem, editItem, removeItem, toggleItem, importFromApi, };
}
