import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Container } from '../../components/Container';
import { Colors, Spacing, FontSizes } from '../../constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { MATCHES, groupNames } from '../../src/matches';

interface MatchDisplay {
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

const teamNames: Record<string, string> = {
  MEX: 'México', USA: 'Estados Unidos', CAN: 'Canadá', BRA: 'Brasil',
  ARG: 'Argentina', GER: 'Alemania', FRA: 'Francia', ENG: 'Inglaterra',
  ESP: 'España', NED: 'Países Bajos', ITA: 'Italia', POR: 'Portugal',
  BEL: 'Bélgica', COL: 'Colombia', URU: 'Uruguay', JPN: 'Japón',
  KOR: 'Corea del Sur', AUS: 'Australia', SUI: 'Suiza', MAR: 'Marruecos',
  SEN: 'Senegal', ECU: 'Ecuador', CRO: 'Croacia', TBD: 'Por definir',
};

const teamFlags: Record<string, string> = {
  MEX: 'https://flagcdn.com/w80/mx.png',
  USA: 'https://flagcdn.com/w80/us.png',
  CAN: 'https://flagcdn.com/w80/ca.png',
  BRA: 'https://flagcdn.com/w80/br.png',
  ARG: 'https://flagcdn.com/w80/ar.png',
  GER: 'https://flagcdn.com/w80/de.png',
  FRA: 'https://flagcdn.com/w80/fr.png',
  ENG: 'https://flagcdn.com/w80/gb.png',
  ESP: 'https://flagcdn.com/w80/es.png',
  NED: 'https://flagcdn.com/w80/nl.png',
  ITA: 'https://flagcdn.com/w80/it.png',
  POR: 'https://flagcdn.com/w80/pt.png',
  BEL: 'https://flagcdn.com/w80/be.png',
  COL: 'https://flagcdn.com/w80/co.png',
  URU: 'https://flagcdn.com/w80/uy.png',
  JPN: 'https://flagcdn.com/w80/jp.png',
  KOR: 'https://flagcdn.com/w80/kr.png',
  AUS: 'https://flagcdn.com/w80/au.png',
  SUI: 'https://flagcdn.com/w80/ch.png',
  MAR: 'https://flagcdn.com/w80/ma.png',
  SEN: 'https://flagcdn.com/w80/sn.png',
  ECU: 'https://flagcdn.com/w80/ec.png',
  CRO: 'https://flagcdn.com/w80/hr.png',
};

const stadiums: Record<string, string> = {
  '2026-06-11': 'Estadio Azteca',
  '2026-06-12': 'SoFi Stadium',
  '2026-06-13': 'BMO Field',
  '2026-06-14': 'MetLife Stadium',
  '2026-06-15': 'Rose Bowl',
  '2026-06-16': 'Levi\'s Stadium',
  '2026-06-17': 'AT&T Stadium',
  '2026-06-18': 'Lumen Field',
  '2026-06-19': 'NRG Stadium',
  '2026-06-20': 'Lincoln Financial Field',
};

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('es-MX', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long' 
  });
}

function buildMatchData(): { title: string; matches: MatchDisplay[] }[] {
  const matchesByDate: Record<string, MatchDisplay[]> = {};
  
  MATCHES.forEach((match, index) => {
    const groupIndex = Math.floor(index / 4);
    const group = groupNames[groupIndex] || 'A';
    const dateKey = match.date;
    
    if (!matchesByDate[dateKey]) {
      matchesByDate[dateKey] = [];
    }
    
    matchesByDate[dateKey].push({
      id: match.id,
      date: match.date,
      dayName: formatDate(match.date),
      time: match.time,
      stadium: stadiums[match.date] || 'Estadio',
      group: `Grupo ${group}`,
      homeTeam: {
        name: teamNames[match.homeTeam] || match.homeTeam,
        flag: teamFlags[match.homeTeam] || '',
        isTBD: match.homeTeam === 'TBD',
      },
      awayTeam: {
        name: teamNames[match.awayTeam] || match.awayTeam,
        flag: teamFlags[match.awayTeam] || '',
        isTBD: match.awayTeam === 'TBD',
      },
      isCompleted: match.isCompleted,
    });
  });
  
  return Object.entries(matchesByDate).map(([date, matches]) => ({
    title: formatDate(date),
    matches,
  }));
}

const matchSections = buildMatchData();

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
        {matchSections.map((section: { title: string; matches: MatchDisplay[] }, index: number) => (
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

function MatchCard({ match }: { match: MatchDisplay }) {
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
