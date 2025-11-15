import { SQLiteProvider } from "expo-sqlite";
import "../global.css";
import { Slot, Stack } from "expo-router";
import { initDb } from "@/db/db";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function Layout() {
  return (
    <SQLiteProvider databaseName="grocery.db" onInit={(db) => initDb(db)}>
       <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1 }}>
          <Stack screenOptions={{ headerShown: false }} />
        </SafeAreaView>
      </SafeAreaProvider>
    </SQLiteProvider>
  );
}
