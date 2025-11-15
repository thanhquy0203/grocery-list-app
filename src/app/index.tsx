import { View, Text, FlatList } from "react-native";
import { useEffect, useState } from "react";
import { useSQLiteContext } from "expo-sqlite";
import { getItems } from "@/db/db";
import { GroceryItem } from "@/types/grocery";

export default function GroceryListPage() {
  const db = useSQLiteContext();

  const [items, setItems] = useState<GroceryItem[]>([]);
  const [loading, setLoading] = useState(true);

  
  const loadData = async () => {
    setLoading(true);
    const data = await getItems(db);
    setItems(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text
        style={{
          fontSize: 24,
          fontWeight: "bold",
          marginBottom: 16,
        }}
      >
        Danh sách Grocery
      </Text>

      
      {loading && <Text>Đang tải dữ liệu...</Text>}

      
      {!loading && items.length === 0 && (
        <Text style={{ color: "gray", fontStyle: "italic" }}>
          Danh sách trống, thêm món cần mua nhé!
        </Text>
      )}

    
      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View
            style={{
              padding: 12,
              backgroundColor: "#fff",
              marginBottom: 12,
              borderRadius: 8,
              shadowColor: "#000",
              shadowOpacity: 0.1,
              shadowRadius: 4,
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>
              {item.name}
            </Text>
            <Text>Số lượng: {item.quantity}</Text>
            <Text>Loại: {item.category || "Không có"}</Text>
            <Text>
              Trạng thái: {item.bought ? "Đã mua ✓" : "Chưa mua"}
            </Text>
          </View>
        )}
      />
    </View>
  );
}
