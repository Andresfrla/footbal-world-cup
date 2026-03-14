import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { Container } from '../../components/Container';
import { Colors, Spacing, FontSizes } from '../../constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { MATCHES } from '../../src/matches';

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

const teamNameToCode: Record<string, string> = {
  'México': 'MEX', 'Estados Unidos': 'USA', 'Canadá': 'CAN', 'Brasil': 'BRA',
  'Argentina': 'ARG', 'Alemania': 'GER', 'Francia': 'FRA', 'Inglaterra': 'ENG',
  'España': 'ESP', 'Países Bajos': 'NED', 'Italia': 'ITA', 'Portugal': 'POR',
  'Bélgica': 'BEL', 'Colombia': 'COL', 'Uruguay': 'URU', 'Japón': 'JPN',
  'República de Corea': 'KOR', 'Corea del Sur': 'KOR', 'Australia': 'AUS',
  'Suiza': 'SUI', 'Marruecos': 'MAR', 'Senegal': 'SEN', 'Ecuador': 'ECU',
  'Croacia': 'CRO', 'Sudáfrica': 'RSA', 'Dinamarca': 'DEN', 'Irlanda': 'IRL',
  'Paraguay': 'PAR', 'Catar': 'QAT', 'Turquía': 'TUR', 'Rumania': 'ROU',
  'Escocia': 'SCO', 'Haití': 'HAI', 'Polonia': 'POL', 'Ucranía': 'UKR',
  'Serbia': 'SRB', 'Chile': 'CHI', 'Perú': 'PER', 'Venezuela': 'VEN',
  'Panamá': 'PAN', 'Costa Rica': 'CRC', 'Jamaica': 'JAM', 'Honduras': 'HON',
  'Gales': 'WAL', 'Bosnia': 'BIH', 'Nigeria': 'NGA', 'Macedonia': 'MKD',
  'República Checa': 'CZE', 'Eslovaquia': 'SVK', 'Kosovo': 'KOS', 'Irán': 'IRN',
  'Arabia Saudita': 'KSA', 'Arabia Saudí': 'KSA', 'Emiratos Árabes': 'UAE', 'Irak': 'IRQ', 'China': 'CHN',
  'India': 'IND', 'Catar 2022': 'QAT', 'Camerún': 'CMR', 'Ghana': 'GHA',
  'Costa de Marfil': 'CIV', 'Argelia': 'ALG', 'Túnez': 'TUN', 'Egipto': 'EGY',
  'Burkina Faso': 'BFA', 'Nigeria/Gales/Bosnia': 'NGA', 'Dinamarca/Macedonia/República Checa/Irlanda': 'DEN',
  'Italia/Nigeria/Gales/Bosnia': 'ITA', 'Turquía/Rumania/Eslovaquia/Kosovo': 'TUR',
  'Curazao': 'CUW', 'Cabo Verde': 'CPV', 'Nueva Zelanda': 'NZL', 'Noruega': 'NOR',
  'Austria': 'AUT', 'Jordania': 'JOR', 'Uzbekistán': 'UZB', 'Venezuela/Estados Unidos': 'VEN',
};

const flagByCountryCode: Record<string, string> = {
  RSA: 'https://flagcdn.com/w80/za.png', DEN: 'https://flagcdn.com/w80/dk.png', IRL: 'https://flagcdn.com/w80/ie.png',
  PAR: 'https://flagcdn.com/w80/py.png', QAT: 'https://flagcdn.com/w80/qa.png', TUR: 'https://flagcdn.com/w80/tr.png',
  ROU: 'https://flagcdn.com/w80/ro.png', SCO: 'https://flagcdn.com/w80/gb-sct.png', HAI: 'https://flagcdn.com/w80/ht.png',
  POL: 'https://flagcdn.com/w80/pl.png', UKR: 'https://flagcdn.com/w80/ua.png', SRB: 'https://flagcdn.com/w80/rs.png',
  CHI: 'https://flagcdn.com/w80/cl.png', PER: 'https://flagcdn.com/w80/pe.png', VEN: 'https://flagcdn.com/w80/ve.png',
  PAN: 'https://flagcdn.com/w80/pa.png', CRC: 'https://flagcdn.com/w80/cr.png', JAM: 'https://flagcdn.com/w80/jm.png',
  HON: 'https://flagcdn.com/w80/hn.png', WAL: 'https://flagcdn.com/w80/gb-wls.png', BIH: 'https://flagcdn.com/w80/ba.png',
  NGA: 'https://flagcdn.com/w80/ng.png', MKD: 'https://flagcdn.com/w80/mk.png', CZE: 'https://flagcdn.com/w80/cz.png',
  SVK: 'https://flagcdn.com/w80/sk.png', KOS: 'https://flagcdn.com/w80/xk.png', IRN: 'https://flagcdn.com/w80/ir.png',
  KSA: 'https://flagcdn.com/w80/sa.png', UAE: 'https://flagcdn.com/w80/ae.png', IRQ: 'https://flagcdn.com/w80/iq.png',
  CHN: 'https://flagcdn.com/w80/cn.png', IND: 'https://flagcdn.com/w80/in.png', CMR: 'https://flagcdn.com/w80/cm.png',
  GHA: 'https://flagcdn.com/w80/gh.png', CIV: 'https://flagcdn.com/w80/ci.png', ALG: 'https://flagcdn.com/w80/dz.png',
  TUN: 'https://flagcdn.com/w80/tn.png', EGY: 'https://flagcdn.com/w80/eg.png', BFA: 'https://flagcdn.com/w80/bf.png',
  CUW: 'https://flagcdn.com/w80/cw.png', CPV: 'https://flagcdn.com/w80/cv.png', NZL: 'https://flagcdn.com/w80/nz.png',
  NOR: 'https://flagcdn.com/w80/no.png', AUT: 'https://flagcdn.com/w80/at.png', JOR: 'https://flagcdn.com/w80/jo.png',
  UZB: 'https://flagcdn.com/w80/uz.png',
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

export default function MatchesScreen() {
  const [activeTab, setActiveTab] = useState<'date' | 'group'>('date');
  const [loading, setLoading] = useState(true);
  const [allMatches, setAllMatches] = useState<MatchDisplay[]>([]);

  useEffect(() => {
    // Simulamos un tiempo de carga y procesamos los datos locales
    const loadMatches = () => {
      setLoading(true);
      
      const formattedMatches: MatchDisplay[] = MATCHES.map((match) => {
        const dateObj = new Date(match.date);
        
        const getTeamCode = (teamName: string): string => {
          if (teamName.includes('/')) {
            const firstTeam = teamName.split('/')[0];
            return teamNameToCode[firstTeam] || firstTeam;
          }
          return teamNameToCode[teamName] || teamName;
        };
        
        const homeCode = getTeamCode(match.homeTeam);
        const awayCode = getTeamCode(match.awayTeam);
        const isHomeTBD = match.homeTeam.includes('/') || match.homeTeam === 'TBD';
        const isAwayTBD = match.awayTeam.includes('/') || match.awayTeam === 'TBD';
        
        return {
          id: match.id,
          date: match.date,
          dayName: dateObj.toLocaleDateString('es-MX', { 
            weekday: 'long', 
            day: 'numeric', 
            month: 'long' 
          }),
          time: match.time,
          stadium: match.stadium || 'Estadio por definir',
          group: match.group || 'Fase de Grupos',
          homeTeam: {
            name: match.homeTeam,
            flag: teamFlags[homeCode] || flagByCountryCode[homeCode] || '',
            isTBD: isHomeTBD,
          },
          awayTeam: {
            name: match.awayTeam,
            flag: teamFlags[awayCode] || flagByCountryCode[awayCode] || '',
            isTBD: isAwayTBD,
          },
          isCompleted: match.isCompleted,
        };
      });
      
      setAllMatches(formattedMatches);
      setLoading(false);
    };

    // Usamos timeout para simular un pequeño delay de asincronía y no bloquear el primer render
    setTimeout(loadMatches, 300);
  }, []);

  const matchSections = React.useMemo(() => {
    if (activeTab === 'date') {
      const grouped: Record<string, MatchDisplay[]> = {};
      allMatches.forEach((m) => {
        if (!grouped[m.date]) grouped[m.date] = [];
        grouped[m.date].push(m);
      });
      return Object.entries(grouped)
        .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
        .map(([_, matches]) => ({
          title: matches[0].dayName,
          matches,
        }));
    } else {
      const grouped: Record<string, MatchDisplay[]> = {};
      allMatches.forEach((m) => {
        if (!grouped[m.group]) grouped[m.group] = [];
        grouped[m.group].push(m);
      });
      return Object.entries(grouped)
        // Optionally sort by group name
        .sort(([groupA], [groupB]) => groupA.localeCompare(groupB))
        .map(([group, matches]) => ({
          title: group,
          matches,
        }));
    }
  }, [allMatches, activeTab]);

  if (loading) {
    return (
      <Container>
        <View style={[styles.scrollView, { justifyContent: 'center', alignItems: 'center' }]}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={{ marginTop: 10, color: Colors.textSecondary }}>Cargando partidos...</Text>
        </View>
      </Container>
    );
  }

  return (
    <Container>
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[0]}
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
        {matchSections.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialIcons name="event-available" size={60} color={Colors.textSecondary} />
            <Text style={styles.emptyStateTitle}>Próximamente</Text>
            <Text style={styles.emptyStateDesc}>
              Los partidos del Mundial 2026 aún no han sido programados ni publicados por completo en la fuente de datos oficial. Tan pronto como estén disponibles, aparecerán aquí automáticamente.
            </Text>
          </View>
        ) : (
          matchSections.map((section: { title: string; matches: MatchDisplay[] }, index: number) => (
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
          ))
        )}

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
  emptyState: {
    padding: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.xl,
    backgroundColor: Colors.card,
    borderRadius: 16,
    marginHorizontal: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  emptyStateTitle: {
    fontSize: FontSizes.xl,
    fontWeight: 'bold',
    color: Colors.text,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  emptyStateDesc: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
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
