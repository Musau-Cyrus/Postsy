import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  diagonalOverlay: {
    position: 'absolute',
    width: width * 2,
    height: height * 2,
    backgroundColor: '#0F172A',
    transform: [{ rotate: '45deg' }],
    top: -height * 1.2,
    left: -width * 0.6,
    opacity: 0.15, // Light transparency for subtle effect
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoCircle: {
    width: 100,
    height: 100,
    backgroundColor: '#0F172A',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  logoText: {
    fontSize: 62,
    color: 'white',
    fontWeight: 'bold',
  },
  appName: {
    color: 'white',
    marginTop: 10,
    fontSize: 16,
    fontWeight: '500',
  },
});

export { styles }