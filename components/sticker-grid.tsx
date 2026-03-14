import { FlatList, useWindowDimensions } from "react-native";
import { Sticker } from "../src/types";
import { StickerComponent } from "./sticker";

interface StickerGridProps {
  stickers: Sticker[];
}

export function StickerGrid({ stickers }: StickerGridProps) {
  const { width } = useWindowDimensions();

  const NUM_COLUMNS = 3;
  const gapBetweenItems = 12; // espacio entre stickers (horizontal y vertical)
  const sidePadding = 16; // margen izquierdo y derecho del grid

  const totalHorizontalPadding =
    sidePadding * 2 + gapBetweenItems * (NUM_COLUMNS - 1);
  const availableWidth = width - totalHorizontalPadding;
  const stickerSize = availableWidth / NUM_COLUMNS;

  return (
    <FlatList
      data={stickers}
      keyExtractor={(item) => item.id.toString()}
      numColumns={NUM_COLUMNS}
      renderItem={({ item }) => (
        <StickerComponent sticker={item} stickerSize={stickerSize} />
      )}
      // ── Esto es clave para que se vea bien distribuido ──
      columnWrapperStyle={{
        gap: gapBetweenItems, // espacio horizontal entre columnas
        paddingHorizontal: sidePadding, // márgenes laterales
        justifyContent: "space-between", // distribuye bien si sobra 1-2px
      }}
      contentContainerStyle={{
        paddingVertical: 16,
        paddingBottom: 30, // un poco más de espacio abajo si quieres
      }}
      showsVerticalScrollIndicator={false}
    />
  );
}
