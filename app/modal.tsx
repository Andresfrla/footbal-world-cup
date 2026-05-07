import { StyleSheet, View, Dimensions, Pressable } from 'react-native';
import { Link } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { Colors, Spacing } from '../constants/theme';

const { height } = Dimensions.get('window');

export default function ModalScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.backdrop}>
        <Pressable style={StyleSheet.absoluteFill} />
      </View>

      <View style={styles.content}>
        <ThemedText type="title">This is a modal</ThemedText>

        <View style={styles.buttonContainer}>
          <Link href="/" dismissTo style={styles.link}>
            <ThemedText type="link">Go to home screen</ThemedText>
          </Link>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
    opacity: 0.5,
  },
  content: {
    backgroundColor: Colors.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: Spacing.xl,
    paddingBottom: height * 0.1,
    alignItems: 'center',
    gap: Spacing.lg,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
