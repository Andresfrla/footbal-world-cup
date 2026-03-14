import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Pressable, Modal } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  FadeIn,
  FadeOut,
  SlideInDown,
} from 'react-native-reanimated';
import { Container } from '../../components/Container';
import { Colors, Spacing, FontSizes } from '../../constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { teams as worldCupTeams, initialAlbum } from '../../src/data';
import { useAlbumStore } from '../../store/albumStore';
import { Toast, ToastHandle } from '../../components/Toast';
import * as Haptics from 'expo-haptics';
import * as Clipboard from 'expo-clipboard';

const { width, height } = Dimensions.get('window');

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

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
  PLAYOFF_A: '🔄',
  PLAYOFF_B: '🔄',
  PLAYOFF_D: '🔄',
  PLAYOFF_F: '🔄',
  PLAYOFF_I: '🔄',
  PLAYOFF_K: '🔄',
};

interface TeamSticker {
  number: number;
  id: number;
  status: 'owned' | 'missing' | 'repeated';
  count?: number;
  isBadge?: boolean;
  badgeType?: 'shield' | 'team';
  teamCode?: string;
  teamName?: string;
}

interface TeamData {
  id: string;
  code: string;
  name: string;
  shortName: string;
  color: string;
  owned: number;
  total: number;
  startNumber: number;
  endNumber: number;
  stickers: TeamSticker[];
}

const teamColors: Record<string, string> = {
  MEX: '#10b981', USA: '#1e3a8a', BRA: '#f1c40f', ARG: '#6b8fd4',
  GER: '#e74c3c', FRA: '#2c3e50', ENG: '#ecf0f1', ESP: '#c0392b',
  POR: '#c0392b', NED: '#f39c12', BEL: '#e74c3c', ITA: '#3498db',
  COL: '#f1c40f', CHI: '#e74c3c', URU: '#3498db', JPN: '#e74c3c',
  CAN: '#e74c3c', MAR: '#c0392b', SEN: '#2ecc71', RSA: '#27ae60',
  KOR: '#e74c3c', SUI: '#e74c3c', AUS: '#f1c40f', QAT: '#8e44ad',
  ECU: '#f1c40f', CRO: '#e74c3c', GHA: '#e74c3c', CMR: '#e74c3c',
};

function buildTeamData(stickers: any[]): TeamData[] {
  const allStickers = stickers.length > 0 ? stickers : initialAlbum.stickers;

  const sortedTeams = [...worldCupTeams].sort((a, b) => {
    if (a.code === 'SPECIAL') return -1;
    if (b.code === 'SPECIAL') return 1;
    return 0;
  });

  return sortedTeams.map((team, index) => {
    const teamStickers = allStickers.filter(s => s.team === team.code);
    const owned = teamStickers.filter(s => s.status === 'owned').length;

    // Usar los stickers reales, marcando los primeros dos como especiales
    const teamStickerList: TeamSticker[] = teamStickers.map((s, idx) => {
      let status: 'owned' | 'missing' | 'repeated' = s.status === 'owned' ? 'owned' : 'missing';
      if (s.duplicates > 0) {
        status = 'repeated';
      }

      return {
        id: s.id,
        number: s.number,
        status,
        count: s.duplicates,
        isBadge: idx < 2,
        badgeType: idx === 0 ? 'shield' : 'team',
        teamCode: team.code,
        teamName: team.name,
      };
    });

    const startNumber = teamStickerList.length > 0 ? teamStickerList[0].number : 0;
    const endNumber = teamStickerList.length > 0 ? teamStickerList[teamStickerList.length - 1].number : 0;

    return {
      id: String(index + 1),
      code: team.code,
      name: `${team.name} (${team.code})`,
      shortName: team.name,
      color: teamColors[team.code] || '#6b7280',
      owned,
      total: team.totalStickers,
      startNumber,
      endNumber,
      stickers: teamStickerList,
    };
  });
}

export default function AlbumScreen() {
  const stickers = useAlbumStore(state => state.stickers);
  const toggleSticker = useAlbumStore(state => state.toggleSticker);
  const addDuplicate = useAlbumStore(state => state.addDuplicate);
  const setMissing = useAlbumStore(state => state.setMissing);
  
  const [modalVisible, setModalVisible] = React.useState(false);
  const [selectedSticker, setSelectedSticker] = React.useState<TeamSticker | null>(null);
  const [summaryVisible, setSummaryVisible] = React.useState(false);
  const [summaryType, setSummaryType] = React.useState<'missing' | 'repeated'>('missing');
  const toastRef = React.useRef<ToastHandle>(null);

  const teamData = buildTeamData(stickers);

  const handleOpenSummary = (type: 'missing' | 'repeated') => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSummaryType(type);
    setSummaryVisible(true);
    
    // Generar string para copiar
    const listString = generateStickerString(type);
    if (listString) {
      Clipboard.setStringAsync(listString);
      toastRef.current?.show(
        `¡Lista de ${type === 'missing' ? 'faltantes' : 'repetidas'} copiada al portapapeles!`, 
        'success'
      );
    } else {
      toastRef.current?.show(
        `Mostrando lista de ${type === 'missing' ? 'faltantes' : 'repetidas'}`, 
        'info'
      );
    }
  };

  const generateStickerString = (type: 'missing' | 'repeated') => {
    let result = `🏆 *World Cup 2026 - Mi Lista de ${type === 'missing' ? 'Faltantes' : 'Repetidas'}* 🏆\n\n`;
    let hasData = false;

    teamData.forEach(team => {
      const filtered = team.stickers.filter(s => 
        type === 'missing' ? s.status === 'missing' : s.status === 'repeated'
      );

      if (filtered.length > 0) {
        hasData = true;
        result += `📍 *${team.name}*:\n`;
        result += filtered.map(s => {
          let text = `${s.number}`;
          if (type === 'repeated' && s.count && s.count > 0) {
            text += ` (x${s.count + 1})`;
          }
          return text;
        }).join(', ') + '\n\n';
      }
    });

    return hasData ? result : null;
  };

  const handleCopyToClipboard = () => {
    const listString = generateStickerString(summaryType);
    if (listString) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Clipboard.setStringAsync(listString);
      toastRef.current?.show('¡Copiado al portapapeles!', 'success');
    }
  };

  const handleStickerPress = (sticker: TeamSticker) => {
    if (sticker.status === 'missing') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      toggleSticker(sticker.id);
      toastRef.current?.show(`¡Sticker #${sticker.number} obtenido!`, 'success');
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setSelectedSticker(sticker);
      setModalVisible(true);
    }
  };

  const handleAddDuplicate = () => {
    if (selectedSticker) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      addDuplicate(selectedSticker.id);
      setModalVisible(false);
      toastRef.current?.show(
        `Sticker #${selectedSticker.number} marcado como repetido`, 
        'success'
      );
    }
  };

  const handleSetMissing = () => {
    if (selectedSticker) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setMissing(selectedSticker.id);
      setModalVisible(false);
      toastRef.current?.show(
        `Sticker #${selectedSticker.number} marcado como faltante`, 
        'info'
      );
    }
  };
  
  const totalOwned = stickers.filter(s => s.status === 'owned').length || teamData.reduce((acc, t) => acc + t.owned, 0);
  const totalStickers = worldCupTeams.reduce((acc, t) => acc + t.totalStickers, 0);
  const progressPercent = totalStickers > 0 ? Math.round((totalOwned / totalStickers) * 100) : 0;

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
        {teamData.map((team) => (
          <View key={team.id} style={styles.teamSection}>
            <View style={styles.teamHeader}>
              <View style={styles.teamTitleRow}>
                <Text style={styles.teamFlagText}>{teamFlags[team.code] || '🏳️'}</Text>
                <Text style={styles.teamName}>{team.shortName}</Text>
              </View>
              <View style={styles.teamMeta}>
                <Text style={styles.teamRange}>Nº {team.startNumber} - {team.endNumber}</Text>
                <Text style={styles.teamCount}>{team.owned} obtenidos</Text>
              </View>
            </View>
            
            <View style={styles.stickersGrid}>
              {team.stickers.map((sticker) => (
                <StickerItem
                  key={`${team.code}-${sticker.number}`}
                  sticker={sticker}
                  onPress={() => handleStickerPress(sticker)}
                />
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
        <TouchableOpacity 
          style={styles.fabSecondary}
          onPress={() => handleOpenSummary('missing')}
        >
          <MaterialIcons name="list" size={20} color="white" />
          <Text style={styles.fabText}>Faltantes</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.fabPrimary}
          onPress={() => handleOpenSummary('repeated')}
        >
          <MaterialIcons name="content-copy" size={20} color="white" />
          <Text style={styles.fabText}>Repetidas</Text>
        </TouchableOpacity>
      </View>
      {/* Sticker Option Modal */}
      <Modal
        animationType="none"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable 
            style={styles.modalBackdrop} 
            onPress={() => setModalVisible(false)} 
          />
          <Animated.View 
            entering={SlideInDown.springify().damping(20).stiffness(200)}
            exiting={FadeOut.duration(200)}
            style={styles.modalContent}
          >
            <View style={styles.modalHeader}>
              <View style={styles.modalIndicator} />
            </View>
            
            <View style={styles.modalStickerInfo}>
              <View style={[
                styles.modalStickerCircle,
                { 
                  borderColor: selectedSticker?.status === 'repeated' ? Colors.primary : '#10b981',
                  backgroundColor: selectedSticker?.status === 'repeated' ? 'rgba(37, 71, 244, 0.1)' : 'rgba(16, 185, 129, 0.1)'
                }
              ]}>
                <Text style={[
                  styles.modalStickerNumber,
                  { color: selectedSticker?.status === 'repeated' ? Colors.primary : '#10b981' }
                ]}>
                  {selectedSticker?.number}
                </Text>
              </View>
              <Text style={styles.modalTitle}>Sticker #{selectedSticker?.number}</Text>
              <Text style={styles.modalSubtitle}>{selectedSticker?.teamName}</Text>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.repeatButton]}
                onPress={handleAddDuplicate}
              >
                <MaterialIcons name="content-copy" size={20} color="white" />
                <View>
                  <Text style={styles.modalButtonText}>Repetida</Text>
                  <Text style={styles.modalButtonSubtext}>Agregar duplicado</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.modalButton, styles.missingButton]}
                onPress={handleSetMissing}
              >
                <MaterialIcons name="delete-outline" size={20} color="#ef4444" />
                <View>
                  <Text style={[styles.modalButtonText, { color: '#ef4444' }]}>Faltante</Text>
                  <Text style={styles.modalButtonSubtext}>Quitar de mi colección</Text>
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>

      {/* Summary Modal (Missing/Repeated) */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={summaryVisible}
        onRequestClose={() => setSummaryVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable 
            style={styles.modalBackdrop} 
            onPress={() => setSummaryVisible(false)} 
          />
          <Animated.View 
            entering={SlideInDown.springify().damping(20).stiffness(200)}
            style={styles.summaryContent}
          >
            <View style={styles.modalHeader}>
              <View style={styles.modalIndicator} />
              <View style={styles.summaryTitleRow}>
                <Text style={styles.summaryTitle}>
                  {summaryType === 'missing' ? 'Stickers Faltantes' : 'Stickers Repetidos'}
                </Text>
                <TouchableOpacity onPress={handleCopyToClipboard} style={styles.copyIconBtn}>
                  <MaterialIcons name="content-paste" size={20} color={Colors.primary} />
                </TouchableOpacity>
              </View>
            </View>

            <ScrollView style={styles.summaryList} showsVerticalScrollIndicator={false}>
              {teamData.map(team => {
                const filteredStickers = team.stickers.filter(s => 
                  summaryType === 'missing' ? s.status === 'missing' : s.status === 'repeated'
                );

                if (filteredStickers.length === 0) return null;

                return (
                  <View key={team.code} style={styles.summaryTeamItem}>
                    <View style={styles.summaryTeamHeader}>
                      <View style={[styles.miniFlag, { backgroundColor: team.color }]} />
                      <Text style={styles.summaryTeamName}>{team.shortName}</Text>
                      <Text style={styles.summaryTeamCount}>({filteredStickers.length})</Text>
                    </View>
                    <View style={styles.summaryNumbersGrid}>
                      {filteredStickers.map(s => (
                        <View key={s.id} style={styles.summaryNumberBadge}>
                          <Text style={styles.summaryNumberText}>
                            {s.number}{summaryType === 'repeated' && s.count && s.count > 0 ? ` (x${s.count + 1})` : ''}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>
                );
              })}
              
              {/* Empty state */}
              {teamData.every(team => 
                team.stickers.filter(s => summaryType === 'missing' ? s.status === 'missing' : s.status === 'repeated').length === 0
              ) && (
                <View style={styles.emptySummary}>
                  <MaterialIcons 
                    name={summaryType === 'missing' ? "check-circle" : "sentiment-very-dissatisfied"} 
                    size={48} 
                    color={Colors.primary} 
                  />
                  <Text style={styles.emptySummaryText}>
                    {summaryType === 'missing' 
                      ? "¡Felicidades! Tienes todos los stickers." 
                      : "No tienes stickers repetidos todavía."}
                  </Text>
                </View>
              )}
              <View style={{ height: 40 }} />
            </ScrollView>

            <TouchableOpacity 
              style={styles.summaryCloseButton}
              onPress={() => setSummaryVisible(false)}
            >
              <Text style={styles.summaryCloseButtonText}>Cerrar Lista</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>

      <Toast ref={toastRef} />
    </Container>
  );
}

function StickerItem({ sticker, onPress }: { sticker: TeamSticker; onPress?: () => void }) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.9, { damping: 15, stiffness: 400 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

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

  // Get additional content for badge stickers
  const getBadgeContent = () => {
    if (!sticker.isBadge || !sticker.teamCode) return null;

    const teamColor = teamColors[sticker.teamCode] || '#6b7280';

    if (sticker.badgeType === 'shield') {
      return (
        <View style={[styles.badgeContent, { backgroundColor: teamColor }]}>
          <Text style={styles.badgeCodeText}>{sticker.teamCode}</Text>
        </View>
      );
    }

    if (sticker.badgeType === 'team') {
      return (
        <View style={[styles.badgeContent, { backgroundColor: teamColor }]}>
          <Text style={styles.badgeNameText} numberOfLines={2}>
            {sticker.teamName}
          </Text>
        </View>
      );
    }

    return null;
  };

  const badgeContent = getBadgeContent();

  return (
    <View style={styles.stickerContainer}>
      <AnimatedPressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          styles.stickerItem,
          {
            backgroundColor: stickerStyles.bgColor,
            borderColor: stickerStyles.borderColor,
            shadowColor: stickerStyles.shadowColor,
          },
          animatedStyle,
        ]}
      >
        <Text style={[styles.stickerNumber, { color: stickerStyles.textColor }]}>
          {sticker.number}
        </Text>
        {sticker.status === 'repeated' && sticker.count && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>+{sticker.count}</Text>
          </View>
        )}
      </AnimatedPressable>
      {badgeContent}
    </View>
  );
}

const COLUMNS = 5;
const GAP = 4;
const PADDING = 12;
// Calcular el tamaño del sticker basado en el ancho disponible
// width - (padding * 2) - (gaps entre columnas) = ancho para stickers
const getStickerSize = () => (width - PADDING * 2 - GAP * (COLUMNS - 1)) / COLUMNS;
const stickerSize = getStickerSize();

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
  teamFlagText: {
    fontSize: 28,
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
  teamMeta: {
    alignItems: 'flex-end',
  },
  teamRange: {
    fontSize: FontSizes.sm,
    color: Colors.primary,
    fontWeight: '800',
  },
  stickersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.md,
    gap: 6,
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
  stickerContainer: {
    width: stickerSize,
    height: stickerSize + 16,
    marginBottom: 8,
  },
  badgeContent: {
    position: 'absolute',
    bottom: 2,
    left: 0,
    right: 0,
    height: 12,
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeCodeText: {
    fontSize: 8,
    fontWeight: '800',
    color: 'white',
  },
  badgeNameText: {
    fontSize: 5,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    paddingHorizontal: 2,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: Colors.card,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: Spacing.xl,
    paddingBottom: 40,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalHeader: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  modalIndicator: {
    width: 40,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
  },
  modalStickerInfo: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  modalStickerCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  modalStickerNumber: {
    fontSize: FontSizes.xxl,
    fontWeight: 'bold',
  },
  modalTitle: {
    fontSize: FontSizes.xl,
    fontWeight: 'bold',
    color: 'white',
  },
  modalSubtitle: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  modalActions: {
    gap: Spacing.md,
  },
  modalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: 16,
    gap: Spacing.md,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  repeatButton: {
    backgroundColor: Colors.primary,
  },
  missingButton: {
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  modalButtonText: {
    color: 'white',
    fontSize: FontSizes.md,
    fontWeight: 'bold',
  },
  modalButtonSubtext: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 10,
  },
  closeButton: {
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  closeButtonText: {
    color: Colors.textSecondary,
    fontSize: FontSizes.sm,
    fontWeight: '600',
  },
  // Summary Styles
  summaryContent: {
    backgroundColor: Colors.card,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    height: height * 0.8,
    paddingHorizontal: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  summaryTitle: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    color: 'white',
  },
  summaryTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 4,
    marginTop: 8,
  },
  copyIconBtn: {
    padding: 8,
    backgroundColor: 'rgba(37, 71, 244, 0.1)',
    borderRadius: 8,
  },
  summaryList: {
    flex: 1,
    paddingHorizontal: Spacing.sm,
  },
  summaryTeamItem: {
    marginBottom: Spacing.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 16,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  summaryTeamHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  miniFlag: {
    width: 20,
    height: 12,
    borderRadius: 2,
  },
  summaryTeamName: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: FontSizes.md,
  },
  summaryTeamCount: {
    color: Colors.primary,
    fontSize: FontSizes.xs,
    fontWeight: 'bold',
  },
  summaryNumbersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  summaryNumberBadge: {
    backgroundColor: 'rgba(37, 71, 244, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(37, 71, 244, 0.2)',
  },
  summaryNumberText: {
    color: 'white',
    fontSize: FontSizes.xs,
    fontWeight: 'bold',
  },
  summaryCloseButton: {
    marginVertical: Spacing.xl,
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginHorizontal: Spacing.md,
  },
  summaryCloseButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: FontSizes.md,
  },
  emptySummary: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 16,
  },
  emptySummaryText: {
    color: Colors.textSecondary,
    fontSize: FontSizes.md,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});
