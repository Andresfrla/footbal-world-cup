import React, { useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Svg, { Circle } from 'react-native-svg';
import Animated, { 
  useAnimatedProps, 
  useSharedValue, 
  withSpring, 
} from 'react-native-reanimated';
import { Colors, Spacing, FontSizes } from '../../constants/theme';
import { useAlbumStore } from '../../store/albumStore';
import { teams } from '../../src/data';

interface TeamProgressProps {
  flag: string;
  name: string;
  percentage: number;
  color: string;
  owned: number;
  total: number;
}

const teamFlags: Record<string, string> = {
  MEX: '🇲🇽',
  RSA: '🇿🇦',
  KOR: '🇰🇷',
  CAN: '🇨🇦',
  QAT: '🇶🇦',
  SUI: '🇨🇭',
  BRA: '🇧🇷',
  MAR: '🇲🇦',
  HAITI: '🇭🇹',
  SCO: '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
  USA: '🇺🇸',
  PAR: '🇵🇾',
  AUS: '🇦🇺',
  GER: '🇩🇪',
  CUW: '🇨🇼',
  CIV: '🇨🇮',
  ECU: '🇪🇨',
  NED: '🇳🇱',
  JPN: '🇯🇵',
  TUN: '🇹🇳',
  BEL: '🇧🇪',
  EGY: '🇪🇬',
  IRN: '🇮🇷',
  NZL: '🇳🇿',
  ESP: '🇪🇸',
  CPV: '🇨🇻',
  KSA: '🇸🇦',
  URU: '🇺🇾',
  FRA: '🇫🇷',
  SEN: '🇸🇳',
  NOR: '🇳🇴',
  ARG: '🇦🇷',
  ALG: '🇩🇿',
  AUT: '🇦🇹',
  JOR: '🇯🇴',
  POR: '🇵🇹',
  UZB: '🇺🇿',
  COL: '🇨🇴',
  ENG: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
  CRO: '🇭🇷',
  GHA: '🇬🇭',
  PAN: '🇵🇦',
  SPECIAL: '⭐',
  CZE: '🇨🇿',
  BIH: '🇧🇦',
  TUR: '🇹🇷',
  SWE: '🇸🇪',
  IRQ: '🇮🇶',
  COD: '🇨🇩',
  HAI: '🇭🇹',
};

function TeamProgressItem({ flag, name, percentage, color, owned, total }: TeamProgressProps) {
  return (
    <View style={styles.teamItem}>
      <View style={styles.teamFlag}>
        <Text style={styles.flagText}>{flag}</Text>
      </View>
      <View style={styles.teamInfo}>
        <View style={styles.teamNameRow}>
          <Text style={styles.teamName}>{name}</Text>
          <Text style={[styles.teamPercentage, { color }]}>{owned}/{total}</Text>
        </View>
        <View style={styles.progressBarBg}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${percentage}%`, backgroundColor: color }
            ]}
          />
        </View>
      </View>
    </View>
  );
}

export default function DashboardScreen() {
  const stickers = useAlbumStore((state) => state.stickers);
  const owned = useAlbumStore((state) => state.totalOwned());
  const missing = useAlbumStore((state) => state.totalMissing());
  const repeated = useAlbumStore((state) => state.totalDuplicates());
  const progress = useAlbumStore((state) => state.progressPercentage());
  const total = stickers.length;

  const animatedProgress = useSharedValue(0);

  useEffect(() => {
    animatedProgress.value = withSpring(progress, { damping: 20, stiffness: 100 });
  }, [progress]);

  const CIRCUMFERENCE = 2 * Math.PI * 80;
  
  const AnimatedCircle = Animated.createAnimatedComponent(Circle);

  const animatedProps = useAnimatedProps(() => {
    const strokeDashoffset = CIRCUMFERENCE - (animatedProgress.value / 100) * CIRCUMFERENCE;
    return {
      strokeDashoffset,
    };
  });

  // Calcular progreso por equipo
  const teamProgress = useMemo(() => {
    const teamStats: Record<string, { owned: number; total: number; name: string }> = {};

    teams.forEach((team) => {
      teamStats[team.code] = {
        owned: 0,
        total: team.totalStickers,
        name: team.name,
      };
    });

    stickers.forEach((sticker) => {
      if (sticker.status === 'owned' && teamStats[sticker.team]) {
        teamStats[sticker.team].owned += 1;
      }
    });

    return Object.entries(teamStats)
      .map(([code, stats]) => ({
        code,
        ...stats,
        percentage: Math.round((stats.owned / stats.total) * 100),
      }))
      .sort((a, b) => b.percentage - a.percentage);
  }, [stickers]);

  // Top 3 equipos con más progreso
  const topTeams: TeamProgressProps[] = teamProgress
    .slice(0, 3)
    .map((team) => ({
      flag: teamFlags[team.code] || '🏳️',
      name: team.name,
      percentage: team.percentage,
      color: team.percentage >= 80 ? Colors.emerald : Colors.primary,
      owned: team.owned,
      total: team.total,
    }));

  // Equipos que requieren atención (menos progreso)
  const attentionTeams: TeamProgressProps[] = [...teamProgress]
    .reverse()
    .filter((team) => team.percentage < 50)
    .slice(0, 5)
    .map((team) => ({
      flag: teamFlags[team.code] || '🏳️',
      name: team.name,
      percentage: team.percentage,
      color: team.percentage < 25 ? '#ef4444' : '#f59e0b',
      owned: team.owned,
      total: team.total,
    }));

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Progress Overview Section */}
        <View style={styles.progressSection}>
          <View style={styles.circularProgressContainer}>
            <Svg width="192" height="192" viewBox="0 0 192 192">
              <Circle
                cx="96"
                cy="96"
                r="80"
                stroke={Colors.border}
                strokeWidth="12"
                fill="transparent"
              />
              <AnimatedCircle
                cx="96"
                cy="96"
                r="80"
                stroke={progress === 100 ? Colors.emerald : Colors.primary}
                strokeWidth="12"
                fill="transparent"
                strokeDasharray={`${CIRCUMFERENCE} ${CIRCUMFERENCE}`}
                animatedProps={animatedProps}
                strokeLinecap="round"
                transform="rotate(-90 96 96)"
              />
            </Svg>
            <View style={styles.progressCenter}>
              <Text style={styles.progressValue}>{progress}%</Text>
              <Text style={styles.progressLabel}>Completado</Text>
            </View>
          </View>

          <View style={styles.glassCard}>
            <View style={styles.glassCardRow}>
              <Text style={styles.glassCardLabel}>Progreso Global</Text>
              <Text style={styles.glassCardValue}>{owned} / {total}</Text>
            </View>
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBarFillWide, { width: `${progress}%`, backgroundColor: progress === 100 ? Colors.emerald : Colors.primary }]} />
            </View>
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { backgroundColor: `${Colors.emerald}15`, borderColor: `${Colors.emerald}30` }]}>
            <View style={styles.statHeader}>
              <MaterialIcons name="check-circle" size={16} color={Colors.emerald} />
              <Text style={styles.statLabel}>Obtenidas</Text>
            </View>
            <Text style={styles.statValue}>{owned}</Text>
            <Text style={styles.statSubtext}>{progress}% del álbum</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: `${Colors.accentPurple}15`, borderColor: `${Colors.accentPurple}30` }]}>
            <View style={styles.statHeader}>
              <MaterialIcons name="pending" size={16} color={Colors.accentPurple} />
              <Text style={styles.statLabel}>Faltantes</Text>
            </View>
            <Text style={styles.statValue}>{missing}</Text>
            <Text style={styles.statSubtext}>para completar</Text>
          </View>

          <View style={[styles.statCard, styles.statCardWide, { backgroundColor: Colors.border, borderColor: Colors.border }]}>
            <View style={styles.statHeader}>
              <MaterialIcons name="content-copy" size={16} color="#f59e0b" />
              <Text style={styles.statLabel}>Repetidas</Text>
            </View>
            <View style={styles.statValueRow}>
              <Text style={styles.statValue}>{repeated}</Text>
              <Text style={styles.statSubtext}>para cambio</Text>
            </View>
          </View>
        </View>

        {/* Top Progress Teams */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Top Progreso Equipos</Text>
            <Text style={styles.sectionLink}>Ver todos</Text>
          </View>
          <View style={styles.teamsList}>
            {topTeams.map((team, index) => (
              <TeamProgressItem key={index} {...team} />
            ))}
          </View>
        </View>

        {/* Require Attention */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Equipos con Menor Progreso</Text>
          <View style={styles.teamsList}>
            {attentionTeams.length > 0 ? (
              attentionTeams.map((team, index) => (
                <TeamProgressItem key={index} {...team} />
              ))
            ) : (
              <Text style={styles.emptyText}>¡Felicidades! Ya tienes más del 50% de todos los equipos</Text>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  progressSection: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.md,
  },
  circularProgressContainer: {
    width: 192,
    height: 192,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  progressCenter: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  progressValue: {
    fontSize: 48,
    fontWeight: '800',
    color: Colors.text,
  },
  progressLabel: {
    fontSize: FontSizes.xs,
    fontWeight: '500',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  glassCard: {
    backgroundColor: Colors.glassBg,
    borderRadius: 16,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    width: '100%',
    maxWidth: 400,
  },
  glassCardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  glassCardLabel: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  glassCardValue: {
    fontSize: FontSizes.md,
    fontWeight: '700',
    color: Colors.primary,
  },
  progressBarContainer: {
    height: 10,
    backgroundColor: Colors.border,
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBarFillWide: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 5,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    borderRadius: 16,
    padding: Spacing.md,
    borderWidth: 1,
  },
  statCardWide: {
    minWidth: '100%',
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  statLabel: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  statValue: {
    fontSize: 36,
    fontWeight: '800',
    color: Colors.text,
  },
  statValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: Spacing.sm,
  },
  statSubtext: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  section: {
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSizes.xl,
    fontWeight: '800',
    color: Colors.text,
  },
  sectionLink: {
    fontSize: FontSizes.sm,
    fontWeight: '700',
    color: Colors.primary,
  },
  teamsList: {
    gap: Spacing.sm,
  },
  teamItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: Colors.glassBg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    gap: Spacing.md,
  },
  teamFlag: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flagText: {
    fontSize: 24,
  },
  teamInfo: {
    flex: 1,
  },
  teamNameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  teamName: {
    fontSize: FontSizes.md,
    fontWeight: '700',
    color: Colors.text,
  },
  teamPercentage: {
    fontSize: FontSizes.xs,
    fontWeight: '700',
  },
  progressBarBg: {
    height: 6,
    backgroundColor: Colors.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  emptyText: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    padding: Spacing.lg,
  },
});
