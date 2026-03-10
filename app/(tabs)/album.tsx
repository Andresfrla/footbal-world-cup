import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Container } from '../../components/Container';
import { Colors, Spacing, FontSizes } from '../../constants/theme';
import { MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface Team {
  id: string;
  code: string;
  name: string;
  shortName: string;
  color: string;
  owned: number;
  total: number;
  stickers: StickerStatus[];
}

interface StickerStatus {
  number: number;
  status: 'owned' | 'missing' | 'repeated';
  count?: number;
}

const teams: Team[] = [
  { 
    id: '1', 
    code: 'MEX', 
    name: 'Mexico (MEX)', 
    shortName: 'Mexico',
    color: '#10b981', 
    owned: 18, 
    total: 20,
    stickers: [
      { number: 1, status: 'owned' },
      { number: 2, status: 'missing' },
      { number: 3, status: 'repeated', count: 1 },
      { number: 4, status: 'repeated', count: 3 },
      { number: 5, status: 'owned' },
      { number: 6, status: 'owned' },
      { number: 7, status: 'missing' },
      { number: 8, status: 'owned' },
      { number: 9, status: 'owned' },
      { number: 10, status: 'owned' },
      { number: 11, status: 'owned' },
      { number: 12, status: 'owned' },
    ]
  },
  { 
    id: '2', 
    code: 'USA', 
    name: 'United States (USA)',
    shortName: 'USA',
    color: '#1e3a8a', 
    owned: 5, 
    total: 20,
    stickers: [
      { number: 1, status: 'owned' },
      { number: 2, status: 'owned' },
      { number: 3, status: 'missing' },
      { number: 4, status: 'missing' },
      { number: 5, status: 'missing' },
      { number: 6, status: 'missing' },
      { number: 7, status: 'missing' },
      { number: 8, status: 'repeated', count: 2 },
      { number: 9, status: 'missing' },
      { number: 10, status: 'missing' },
      { number: 11, status: 'missing' },
      { number: 12, status: 'missing' },
    ]
  },
];

const totalOwned = 452;
const totalStickers = 670;
const progressPercent = Math.round((totalOwned / totalStickers) * 100);

export default function AlbumScreen() {
  return (
    <Container>
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[1]}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>World Cup 2026</Text>
          <Text style={styles.headerSubtitle}>Sticker Album Tracker</Text>
        </View>

        {/* Progress Card */}
        <View style={styles.progressCard}>
          <View style={styles.progressGradient}>
            <View style={styles.progressContent}>
              <View>
                <Text style={styles.progressLabel}>Total Progress</Text>
                <Text style={styles.progressNumbers}>{totalOwned} / {totalStickers}</Text>
              </View>
              <View style={styles.progressPercent}>
                <Text style={styles.progressPercentText}>{progressPercent}%</Text>
              </View>
            </View>
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBar, { width: `${progressPercent}%` }]} />
            </View>
          </View>
        </View>

        {/* Team Sections */}
        {teams.map((team) => (
          <View key={team.id} style={styles.teamSection}>
            <View style={styles.teamHeader}>
              <View style={styles.teamTitleRow}>
                <View style={[styles.teamFlag, { backgroundColor: team.color }]}>
                  <Text style={styles.teamFlagText}>{team.code}</Text>
                </View>
                <Text style={styles.teamName}>{team.shortName}</Text>
              </View>
              <Text style={styles.teamCount}>{team.owned}/{team.total}</Text>
            </View>
            
            <View style={styles.stickersGrid}>
              {team.stickers.map((sticker) => (
                <StickerItem key={sticker.number} sticker={sticker} />
              ))}
            </View>
          </View>
        ))}

        {/* Loading placeholder */}
        <View style={styles.loadingContainer}>
          <View style={styles.spinner} />
          <Text style={styles.loadingText}>Loading Groups D - L</Text>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* FABs */}
      <View style={styles.fabContainer}>
        <TouchableOpacity style={styles.fabSecondary}>
          <MaterialIcons name="content-copy" size={18} color="white" />
          <Text style={styles.fabText}>Faltantes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.fabPrimary}>
          <MaterialIcons name="difference" size={18} color="white" />
          <Text style={styles.fabText}>Repetidas</Text>
        </TouchableOpacity>
      </View>
    </Container>
  );
}

function StickerItem({ sticker }: { sticker: StickerStatus }) {
  const getStyles = () => {
    switch (sticker.status) {
      case 'owned':
        return {
          bgColor: 'rgba(16, 185, 129, 0.1)',
          borderColor: '#10b981',
          textColor: '#10b981',
          shadowColor: 'rgba(16, 185, 129, 0.1)',
        };
      case 'repeated':
        return {
          bgColor: 'rgba(37, 71, 244, 0.1)',
          borderColor: Colors.primary,
          textColor: Colors.primary,
          shadowColor: 'rgba(37, 71, 244, 0.2)',
        };
      default:
        return {
          bgColor: Colors.border,
          borderColor: Colors.border,
          textColor: '#6b7280',
          shadowColor: 'transparent',
        };
    }
  };

  const stickerStyles = getStyles();

  return (
    <TouchableOpacity 
      style={[
        styles.stickerItem,
        { 
          backgroundColor: stickerStyles.bgColor,
          borderColor: stickerStyles.borderColor,
          shadowColor: stickerStyles.shadowColor,
        }
      ]}
      activeOpacity={0.7}
    >
      <Text style={[styles.stickerNumber, { color: stickerStyles.textColor }]}>
        {sticker.number}
      </Text>
      {sticker.status === 'repeated' && sticker.count && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>+{sticker.count}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const stickerSize = (width - Spacing.md * 2 - Spacing.md * 3) / 4;

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    color: Colors.text,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: FontSizes.xs,
    color: Colors.primary,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginTop: 2,
  },
  progressCard: {
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.lg,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  progressGradient: {
    backgroundColor: Colors.primary,
    padding: Spacing.xl,
  },
  progressContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: Spacing.lg,
  },
  progressLabel: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: FontSizes.sm,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  progressNumbers: {
    color: 'white',
    fontSize: FontSizes.xxl,
    fontWeight: 'bold',
  },
  progressPercent: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: 8,
  },
  progressPercentText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: FontSizes.sm,
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
    marginBottom: Spacing.lg,
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
  teamFlag: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  teamFlagText: {
    fontSize: 10,
    fontWeight: '800',
    color: 'white',
  },
  teamName: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    color: Colors.text,
  },
  teamCount: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    fontWeight: 'bold',
  },
  stickersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: Spacing.md,
    gap: Spacing.md,
  },
  stickerItem: {
    width: stickerSize,
    height: stickerSize,
    borderRadius: 100,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  stickerNumber: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
  },
  badge: {
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
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '800',
  },
  loadingContainer: {
    alignItems: 'center',
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
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  fabContainer: {
    position: 'absolute',
    bottom: 90,
    left: Spacing.md,
    right: Spacing.md,
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  fabSecondary: {
    flex: 1,
    backgroundColor: 'rgba(30, 41, 59, 0.9)',
    borderWidth: 1,
    borderColor: '#334155',
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabPrimary: {
    flex: 1,
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.sm,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  fabText: {
    color: 'white',
    fontSize: FontSizes.sm,
    fontWeight: 'bold',
  },
});
