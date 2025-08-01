import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0C1220',
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 48,
    fontWeight: '700',
    color: 'white',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    marginBottom: 40,
  },
  label: {
    color: 'white',
    fontSize: 14,
    marginBottom: 5,
  },
  input: {
    color: 'white',
    borderRadius: 10,
    padding: 12,
    marginBottom: 5,
    marginTop: 5,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  passwordInput: {
    flex: 1,
    color: 'white',
    paddingVertical: 12,
    marginBottom: 5,
    marginTop: 5,
  },
  forgotContainer: {
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  forgotText: {
    color: '#CF8E4D',
    fontSize: 13,
  },
  loginButton: {
    backgroundColor: '#2A2F45',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 30,
  },
  loginText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  dividerGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 10,
    marginBottom: 50,
    marginTop: 120,
  },
  divider: {
    borderWidth: 1,
    flex: 1,
    borderColor: '#e6e6e6'
  },
  dividerText: {
    fontSize: 17,
    fontWeight: 500,
    color: '#C2C2C2'
  },
  socialButtonGroup: {
    paddingTop: 4,
  },
  socialButton: {
    height: 53,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    columnGap: 0,
    borderWidth: 0,
    overflow: 'hidden',
    
  },
  socialText: {
    color: 'white',
    fontSize: 15,
    marginLeft:24,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 40,
    borderRadius:16,
  },
  signupText: {
    color: '#ccc',
  },
  joinNow: {
    color: '#F9A826',
    marginLeft: 4,
  },
});

export {styles}