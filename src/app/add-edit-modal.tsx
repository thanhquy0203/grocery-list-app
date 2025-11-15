import { View, Text, Alert } from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { TextInput, Button } from "react-native-paper";
import { useEffect, useState } from "react";
import { useSQLiteContext } from "expo-sqlite";
import { createItem, getItemById, updateItem } from "@/db/db";

export default function AddEditModal() {
  const router = useRouter();
  const db = useSQLiteContext();

  const { id } = useLocalSearchParams();
  const isEdit = !!id;

  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [category, setCategory] = useState("");

  useEffect(() => {
    const loadItem = async () => {
      if (isEdit) {
        const item = await getItemById(db, Number(id));
        if (item) {
          setName(item.name);
          setQuantity(String(item.quantity));
          setCategory(item.category || "");
        }
      }
    };

    loadItem();
  }, [id]);
  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert("Lỗi", "Tên món không được để trống!");
      return;
    }

       if (isEdit) {
      await updateItem(db, {
        id: Number(id),
        name,
        quantity: Number(quantity),
        category,
      });
    } else {
      await createItem(db, {
        name,
        quantity: Number(quantity),
        category,
        bought: 0,
      });
    }

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
