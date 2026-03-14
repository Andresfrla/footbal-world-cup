import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Team } from '../src/types';
import { Sticker } from '../src/types';
import { StickerGrid } from './sticker-grid';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';
import { IconSymbol } from './ui/icon-symbol';
import { Colors } from '../constants/theme';
import { useColorScheme } from '../hooks/use-color-scheme';
import { useState } from 'react';

interface TeamSectionProps {
  team: Team;
  stickers: Sticker[];
}

export function TeamSection({ team, stickers }: TeamSectionProps) {
  const [isOpen, setIsOpen] = useState(true);
  const theme = useColorScheme() ?? 'light';

  const ownedCount = stickers.filter((s) => s.status === 'owned').length;

  return (
    <ThemedView style={styles.container}>
      <TouchableOpacity
        style={styles.header}
        onPress={() => setIsOpen((value) => !value)}
        activeOpacity={0.8}
      >
        <View style={styles.headerLeft}>
          <IconSymbol
            name="chevron.right"
            size={18}
            weight="medium"
            color={theme === 'light' ? Colors.light.icon : Colors.dark.icon}
            style={{ transform: [{ rotate: isOpen ? '90deg' : '0deg' }] }}
          />
          <ThemedText type="defaultSemiBold">{team.name}</ThemedText>
        </View>
        <ThemedText type="default">
          {ownedCount} / {team.totalStickers}
        </ThemedText>
      </TouchableOpacity>
      {isOpen && (
        <StickerGrid stickers={stickers} />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 6,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
});
