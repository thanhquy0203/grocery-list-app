import { View, Text, Alert } from "react-native";
import { Stack, useRouter } from "expo-router";
import { TextInput, Button } from "react-native-paper";
import { useState } from "react";
import { useSQLiteContext } from "expo-sqlite";
import { createItem } from "@/db/db";

export default function AddEditModal() {
  const router = useRouter();
  const db = useSQLiteContext();

  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [category, setCategory] = useState("");

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert("Lỗi", "Tên món không được để trống!");
      return;
    }

    await createItem(db, {
      name,
      quantity: Number(quantity),
      category,
      bought: 0,
    });

    router.back();
  };

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: "white" }}>
      <Stack.Screen options={{ title: "Thêm món Grocery" }} />

      <Text style={{ fontSize: 20, marginBottom: 10, fontWeight: "bold" }}>
        Thêm món cần mua
      </Text>

      <TextInput
        label="Tên món *"
        value={name}
        onChangeText={setName}
        mode="outlined"
        style={{ marginBottom: 12 }}
      />

      <TextInput
        label="Số lượng"
        value={quantity}
        keyboardType="number-pad"
        onChangeText={setQuantity}
        mode="outlined"
        style={{ marginBottom: 12 }}
      />

      <TextInput
        label="Loại (tùy chọn)"
        value={category}
        onChangeText={setCategory}
        mode="outlined"
        style={{ marginBottom: 20 }}
      />

      <Button mode="contained" onPress={handleSave}>
        Lưu
      </Button>
    </View>
  );
}
