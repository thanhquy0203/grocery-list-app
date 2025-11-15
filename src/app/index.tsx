import { View, Text, FlatList, TouchableOpacity, Alert } from "react-native";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSQLiteContext } from "expo-sqlite";
import { createItem, deleteItem, getItems, toggleBought } from "@/db/db";
import { GroceryItem } from "@/types/grocery";
import { router, useFocusEffect } from "expo-router";
import { Button, FAB, TextInput } from "react-native-paper";
import { useGroceryItems } from "@/hooks/useGroceryItems";

export default function GroceryListPage() {
  const {
    filteredItems,
    loading,
    refreshing,
    importLoading,
    importError,
    search,
    setSearch,
    loadData,
    onRefresh,
    toggleItem,
    removeItem,
    importFromApi,
  } = useGroceryItems();

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

   const handleDelete = (id: number) => {
    Alert.alert("Xác nhận", "Bạn có chắc chắn muốn xóa món này không?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: () => removeItem(id),
      },
    ]);
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
      <TextInput
        placeholder="Tìm món..."
        value={search}
        onChangeText={setSearch}
        style={{
          backgroundColor: "#fff",
          padding: 10,
          borderRadius: 8,
          marginBottom: 16,
          borderWidth: 1,
          borderColor: "#ccc",
        }}
      />
      <Button
        mode="contained"
        loading={importLoading}
        disabled={importLoading}
        onPress={importFromApi}
        style={{ marginBottom: 12 }}
      >
        Import từ API
      </Button>

      {importError !== "" && (
        <Text style={{ color: "red", marginBottom: 10 }}>
          Lỗi: {importError}
        </Text>
      )}

      {loading && <Text>Đang tải dữ liệu...</Text>}

      {!loading && filteredItems.length === 0 && (

        <Text style={{ color: "gray", fontStyle: "italic" }}>
          Danh sách trống, thêm món cần mua nhé!
        </Text>
      )}

      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 16 }}>
            <TouchableOpacity
              onPress={() => toggleItem(item)}
              activeOpacity={0.8}
              style={{
                padding: 12,
                backgroundColor: item.bought ? "#d4ffd4" : "#fff",
                borderRadius: 8,
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  textDecorationLine: item.bought ? "line-through" : "none",
                }}
              >
                {item.name} {item.bought ? "✓" : ""}
              </Text>

              <Text>Số lượng: {item.quantity}</Text>
              <Text>Loại: {item.category || "Không có"}</Text>
              <Text>Trạng thái: {item.bought ? "Đã mua ✓" : "Chưa mua"}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ position: "absolute", right: 12, top: 12 }}
              onPress={() => router.push(`/add-edit-modal?id=${item.id}`)}
            >
              <Text style={{ color: "blue", fontWeight: "bold" }}>Sửa</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ position: "absolute", right: 12, top: 40 }}
              onPress={() => handleDelete(item.id)}
            >
              <Text style={{ color: "red", fontWeight: "bold" }}>Xóa</Text>
            </TouchableOpacity>
          </View>
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
