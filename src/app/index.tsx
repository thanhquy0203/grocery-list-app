import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { useCallback, useEffect, useState } from "react";
import { useSQLiteContext } from "expo-sqlite";
import { getItems, toggleBought } from "@/db/db";
import { GroceryItem } from "@/types/grocery";
import { router, useFocusEffect } from "expo-router";
import { FAB } from "react-native-paper";

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

 useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );
  const handleToggleBought = async (item: GroceryItem) => {
    await toggleBought(db, item.id, item.bought);
    loadData(); 
  };
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
          <TouchableOpacity onPress={() => handleToggleBought(item)}>
            <View
              style={{
                padding: 12,
                backgroundColor: item.bought ? "#d4ffd4" : "#fff", // nền xanh nhạt nếu đã mua
                marginBottom: 12,
                borderRadius: 8,
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  textDecorationLine: item.bought ? "line-through" : "none", // 👉 Q5: gạch ngang nếu bought=1
                }}
              >
                {item.name} {item.bought ? "✓" : ""}
              </Text>

              <Text>Số lượng: {item.quantity}</Text>
              <Text>Loại: {item.category || "Không có"}</Text>
              <Text>
                Trạng thái: {item.bought ? "Đã mua ✓" : "Chưa mua"}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
       <FAB
        icon="plus"
        style={{
          position: "absolute",
          right: 20,
          bottom: 20,
        }}
        onPress={() => router.push("/add-edit-modal")}
      />
    </View>
  );
}
