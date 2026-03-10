import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Container } from '../../components/Container';
import { Colors, Spacing, FontSizes } from '../../constants/theme';

const { width } = Dimensions.get('window');
const STICKER_SIZE = (width - 80) / 4;

interface StickerProps {
  number: number;
  status: 'owned' | 'missing' | 'repeated';
  repeatedCount?: number;
}

function Sticker({ number, status, repeatedCount }: StickerProps) {
  const getBackgroundColor = () => {
    switch (status) {
      case 'owned':
        return 'rgba(16, 185, 129, 0.1)';
      case 'repeated':
        return 'rgba(37, 71, 244, 0.1)';
      default:
        return Colors.border;
    }
  };

  const getBorderColor = () => {
    switch (status) {
      case 'owned':
        return Colors.accentGreen;
      case 'repeated':
        return Colors.primary;
      default:
        return Colors.border;
    }
  };

  const getTextColor = () => {
    switch (status) {
      case 'owned':
        return Colors.accentGreen;
      case 'repeated':
        return Colors.primary;
      default:
        return Colors.textSecondary;
    }
  };

  return (
    <View style={styles.stickerContainer}>
      <View 
        style={[
          styles.sticker, 
          { 
            backgroundColor: getBackgroundColor(),
            borderColor: getBorderColor(),
          }
        ]}
      >
        <Text style={[styles.stickerNumber, { color: getTextColor() }]}>
          {number}
        </Text>
      </View>
      {status === 'repeated' && repeatedCount && repeatedCount > 0 && (
        <View style={styles.repeatedBadge}>
          <Text style={styles.repeatedBadgeText}>+{repeatedCount}</Text>
        </View>
      )}
    </View>
  );
}

interface TeamSectionProps {
  flag: string;
  code: string;
  name: string;
  owned: number;
  total: number;
  stickers: StickerProps[];
}

function TeamSection({ flag, code, name, owned, total, stickers }: TeamSectionProps) {
  return (
    <View style={styles.teamSection}>
      <View style={styles.teamHeader}>
        <View style={styles.teamTitleRow}>
          <View style={styles.flagContainer}>
            <Text style={styles.flagText}>{flag}</Text>
          </View>
          <View>
            <Text style={styles.teamName}>{name}</Text>
            <Text style={styles.teamCode}>{code}</Text>
          </View>
        </View>
        <Text style={styles.teamProgress}>{owned}/{total}</Text>
      </View>
      <View style={styles.stickersGrid}>
        {stickers.map((sticker) => (
          <Sticker key={sticker.number} {...sticker} />
        ))}
      </View>
    </View>
  );
}

export default function DashboardScreen() {
  const owned = 452;
  const total = 670;
  const progress = Math.round((owned / total) * 100);

  const mexicoStickers: StickerProps[] = [
    { number: 1, status: 'owned' },
    { number: 2, status: 'missing' },
    { number: 3, status: 'repeated', repeatedCount: 1 },
    { number: 4, status: 'repeated', repeatedCount: 3 },
    { number: 5, status: 'owned' },
    { number: 6, status: 'owned' },
    { number: 7, status: 'missing' },
    { number: 8, status: 'owned' },
    { number: 9, status: 'owned' },
    { number: 10, status: 'owned' },
    { number: 11, status: 'owned' },
    { number: 12, status: 'owned' },
    { number: 13, status: 'owned' },
    { number: 14, status: 'owned' },
    { number: 15, status: 'owned' },
    { number: 16, status: 'owned' },
    { number: 17, status: 'owned' },
    { number: 18, status: 'owned' },
    { number: 19, status: 'owned' },
    { number: 20, status: 'owned' },
  ];

  const usaStickers: StickerProps[] = [
    { number: 1, status: 'owned' },
    { number: 2, status: 'owned' },
    { number: 3, status: 'missing' },
    { number: 4, status: 'missing' },
    { number: 5, status: 'missing' },
    { number: 6, status: 'missing' },
    { number: 7, status: 'missing' },
    { number: 8, status: 'repeated', repeatedCount: 2 },
    { number: 9, status: 'missing' },
    { number: 10, status: 'missing' },
    { number: 11, status: 'missing' },
    { number: 12, status: 'missing' },
    { number: 13, status: 'missing' },
    { number: 14, status: 'missing' },
    { number: 15, status: 'missing' },
    { number: 16, status: 'missing' },
  ];

  return (
    <Container>
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Progress Bar Card */}
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <View>
              <Text style={styles.progressLabel}>Total Progress</Text>
              <Text style={styles.progressValue}>{owned} / {total}</Text>
            </View>
            <View style={styles.progressBadge}>
              <Text style={styles.progressBadgeText}>{progress}%</Text>
            </View>
          </View>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: `${progress}%` }]} />
          </View>
        </View>

        {/* Mexico Section */}
        <TeamSection 
          flag="🇲🇽"
          code="MEX"
          name="Mexico"
          owned={18}
          total={20}
          stickers={mexicoStickers}
        />

        {/* USA Section */}
        <TeamSection 
          flag="🇺🇸"
          code="USA"
          name="United States"
          owned={3}
          total={16}
          stickers={usaStickers}
        />

        {/* Loading Placeholder */}
        <View style={styles.loadingContainer}>
          <View style={styles.spinner} />
          <Text style={styles.loadingText}>Loading Groups C - L</Text>
        </View>
      </ScrollView>
    </Container>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  progressCard: {
    backgroundColor: Colors.primary,
    marginHorizontal: Spacing.md,
    marginTop: Spacing.md,
    borderRadius: 16,
    padding: Spacing.lg,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: Spacing.md,
  },
  progressLabel: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: FontSizes.sm,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  progressValue: {
    color: 'white',
    fontSize: 28,
    fontWeight: '800',
  },
  progressBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 8,
  },
  progressBadgeText: {
    color: 'white',
    fontSize: FontSizes.sm,
    fontWeight: '700',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#84cc16',
    borderRadius: 4,
  },
  teamSection: {
    marginTop: Spacing.xl,
  },
  teamHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.border,
  },
  teamTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  flagContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flagText: {
    fontSize: 16,
  },
  teamName: {
    fontSize: FontSizes.md,
    fontWeight: '700',
    color: Colors.text,
  },
  teamCode: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  teamProgress: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    fontWeight: '700',
  },
  stickersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  stickerContainer: {
    position: 'relative',
  },
  sticker: {
    width: STICKER_SIZE,
    height: STICKER_SIZE,
    borderRadius: STICKER_SIZE / 2,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stickerNumber: {
    fontSize: 18,
    fontWeight: '700',
  },
  repeatedBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#2563eb',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.background,
  },
  repeatedBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '800',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xl,
    gap: Spacing.sm,
  },
  spinner: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.primary,
    borderTopColor: 'transparent',
  },
  loadingText: {
    color: Colors.textSecondary,
    fontSize: FontSizes.xs,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
});
