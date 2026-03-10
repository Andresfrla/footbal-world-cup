import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Container } from '../../components/Container';
import { Colors, Spacing, FontSizes } from '../../constants/theme';
import { MaterialIcons } from '@expo/vector-icons';

interface Match {
  id: string;
  date: string;
  dayName: string;
  time: string;
  stadium: string;
  group: string;
  homeTeam: {
    name: string;
    flag: string;
    isTBD?: boolean;
  };
  awayTeam: {
    name: string;
    flag: string;
    isTBD?: boolean;
  };
  isCompleted: boolean;
}

const matches: { title: string; matches: Match[] }[] = [
  {
    title: 'Jueves, 11 de junio',
    matches: [
      {
        id: '1',
        date: '2026-06-11',
        dayName: 'Jueves, 11 de junio',
        time: '15:00',
        stadium: 'Estadio Azteca',
        group: 'Grupo A',
        homeTeam: { 
          name: 'México', 
          flag: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCdBP5vRy6WOa9E4UUllqzC7wFJ4Y_oJymmCORaBPstEtdH3FiA17jvrelgHuKYNjyBaxgmBPul4Dbn8yil74Xw9oR3c4py3Vjv5Ga4vb4R0fV6zVB-ciVmkdEztYteo7kso9P5o5AzkQFlWqEoVj46Klw-bwGWkjnc_nMDAB9EIq9NqhXWfw4gD--P6VpdbeeNVswKvFHPGahuR2eWEnvzorx92Cb7-3i1hJkEj2CVMTJ3udabtnF9p7MSo-2zWwgM177-4hHBFAc' 
        },
        awayTeam: { name: 'TBD', flag: '', isTBD: true },
        isCompleted: false,
      },
      {
        id: '2',
        date: '2026-06-11',
        dayName: 'Jueves, 11 de junio',
        time: '18:00',
        stadium: 'SoFi Stadium',
        group: 'Grupo B',
        homeTeam: { 
          name: 'Estados Unidos', 
          flag: 'https://lh3.googleusercontent.com/aida-public/AB6AXuASalnUd4ki4Lr3szffEz9gjF2KD5Z2BtQTAn_sS3w6hWyeP45ZaeYUPN98os2edjVdpgn6q00Tvz7sFxaji-4QjeOyO17RESF6XlFt9silkSD63I4a28rrrMFGEShFCEsYKBF2wpveK-4OIVZhClQa3Z1JmlsXJ4L9KzJkSEIfCr1jJFp-qGAF2inuP11EgoEx-6Fv19j06UGz1xVkOozykJ14J0jQsCBy__LS6riL6Xo3KluIet-_jVAKFEEI48_JkWVpCRnWPqg' 
        },
        awayTeam: { name: 'TBD', flag: '', isTBD: true },
        isCompleted: false,
      },
    ],
  },
  {
    title: 'Viernes, 12 de junio',
    matches: [
      {
        id: '3',
        date: '2026-06-12',
        dayName: 'Viernes, 12 de junio',
        time: '12:00',
        stadium: 'BMO Field',
        group: 'Grupo C',
        homeTeam: { 
          name: 'Canadá', 
          flag: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB-V1V3zzFCPn4cZCO1_OnvTj5CPQJa7in403LjNhSVqj2ux6xFiG_2Nz4HskdVPiuba-SL7OfPxGFrC_2N4MM15b1ZptBmvIJIyNt6Pn1nkYj85MifOaFOACOO2WWgSIMvjpC24_YIFzZYQzs1NRA-rA4xqV8f08WKlRuYYgCK1KR-B3vFTdeWzwNSLFxoEdmkCYKtnES1tWHEXxQcJt5BYInIiaYd0Y_S-ZQz1FLGlrZeffBwooqXKMytPJGP7ZEtEVnysOqAMmw' 
        },
        awayTeam: { name: 'TBD', flag: '', isTBD: true },
        isCompleted: false,
      },
    ],
  },
];

export default function MatchesScreen() {
  const [activeTab, setActiveTab] = React.useState<'date' | 'group'>('date');

  return (
    <Container>
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[2]}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Calendario de Partidos</Text>
        </View>

        {/* Filter Tabs */}
        <View style={styles.tabsContainer}>
          <View style={styles.tabs}>
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'date' && styles.tabActive]}
              onPress={() => setActiveTab('date')}
            >
              <Text style={[styles.tabText, activeTab === 'date' && styles.tabTextActive]}>
                Por Fecha
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'group' && styles.tabActive]}
              onPress={() => setActiveTab('group')}
            >
              <Text style={[styles.tabText, activeTab === 'group' && styles.tabTextActive]}>
                Por Grupo
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Match Sections */}
        {matches.map((section, index) => (
          <View key={index} style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="calendar-today" size={20} color={Colors.primary} />
              <Text style={styles.sectionTitle}>{section.title}</Text>
            </View>

            <View style={styles.matchesList}>
              {section.matches.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </View>
          </View>
        ))}

        {/* Stadium Promotion */}
        <View style={styles.promotionCard}>
          <View style={styles.promotionContent}>
            <Text style={styles.promotionLabel}>Sedes del Mundial</Text>
            <Text style={styles.promotionTitle}>Explora los estadios de 2026</Text>
            <TouchableOpacity style={styles.promotionButton}>
              <Text style={styles.promotionButtonText}>Ver Mapa</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </Container>
  );
}

function MatchCard({ match }: { match: Match }) {
  return (
    <View style={styles.matchCard}>
      <View style={styles.matchHeader}>
        <View style={styles.groupBadge}>
          <Text style={styles.groupBadgeText}>{match.group}</Text>
        </View>
        <Text style={styles.matchInfo}>{match.time} • {match.stadium}</Text>
      </View>

      <View style={styles.teamsContainer}>
        <View style={styles.team}>
          <View style={styles.teamFlag}>
            {match.homeTeam.isTBD ? (
              <MaterialIcons name="help-outline" size={20} color={Colors.textSecondary} />
            ) : (
              <Image 
                source={{ uri: match.homeTeam.flag }} 
                style={styles.flagImage}
                resizeMode="cover"
              />
            )}
          </View>
          <Text style={styles.teamName}>{match.homeTeam.name}</Text>
        </View>

        <View style={styles.vsContainer}>
          <Text style={styles.vsText}>VS</Text>
        </View>

        <View style={styles.team}>
          <View style={styles.teamFlag}>
            {match.awayTeam.isTBD ? (
              <MaterialIcons name="help-outline" size={20} color={Colors.textSecondary} />
            ) : (
              <Image 
                source={{ uri: match.awayTeam.flag }} 
                style={styles.flagImage}
                resizeMode="cover"
              />
            )}
          </View>
          <Text style={[styles.teamName, match.awayTeam.isTBD && styles.teamNameTBD]}>
            {match.awayTeam.name}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  headerTitle: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    color: Colors.text,
    textAlign: 'center',
  },
  tabsContainer: {
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: Colors.primary,
  },
  tabText: {
    fontSize: FontSizes.sm,
    fontWeight: 'bold',
    color: Colors.textSecondary,
  },
  tabTextActive: {
    color: Colors.primary,
  },
  section: {
    marginTop: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    color: Colors.text,
  },
  matchesList: {
    paddingHorizontal: Spacing.md,
    gap: Spacing.md,
  },
  matchCard: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    borderRadius: 12,
    padding: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  matchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  groupBadge: {
    backgroundColor: 'rgba(37, 71, 244, 0.1)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: 6,
  },
  groupBadgeText: {
    color: Colors.primary,
    fontSize: FontSizes.xs,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  matchInfo: {
    color: Colors.textSecondary,
    fontSize: FontSizes.xs,
    fontWeight: '500',
  },
  teamsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  team: {
    flex: 1,
    alignItems: 'center',
    gap: Spacing.sm,
  },
  teamFlag: {
    width: 64,
    height: 40,
    borderRadius: 8,
    backgroundColor: Colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  flagImage: {
    width: '100%',
    height: '100%',
  },
  teamFlagText: {
    fontSize: 20,
  },
  teamName: {
    fontSize: FontSizes.sm,
    fontWeight: 'bold',
    color: Colors.text,
    textAlign: 'center',
  },
  teamNameTBD: {
    color: Colors.textSecondary,
  },
  vsContainer: {
    paddingHorizontal: Spacing.md,
  },
  vsText: {
    fontSize: FontSizes.xl,
    fontWeight: '800',
    color: '#cbd5e1',
  },
  promotionCard: {
    margin: Spacing.md,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: Colors.primary,
  },
  promotionContent: {
    padding: Spacing.lg,
    justifyContent: 'flex-end',
  },
  promotionLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: FontSizes.xs,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 4,
  },
  promotionTitle: {
    color: 'white',
    fontSize: FontSizes.xl,
    fontWeight: 'bold',
    marginBottom: Spacing.md,
  },
  promotionButton: {
    backgroundColor: 'white',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  promotionButtonText: {
    color: Colors.primary,
    fontSize: FontSizes.sm,
    fontWeight: 'bold',
  },
});
