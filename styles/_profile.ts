import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0e1621',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  profileSection: {
    alignItems: 'center',
    marginTop: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ccc',
    marginBottom: 10,
  },
  name: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  username: {
    color: '#aaa',
    fontSize: 14,
    marginBottom: 6,
  },
  bio: {
    color: '#ccc',
    textAlign: 'center',
    paddingHorizontal: 30,
    fontSize: 13,
    marginBottom: 16,
  },
  editButton: {
    backgroundColor: '#2E3440',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 12,
    marginBottom: 16,
  },
  editText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export { styles}