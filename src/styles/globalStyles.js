import { StyleSheet } from 'react-native';

export const colors = {
  primary: '#003a6b',
  secondary: '#ffffff'
};

export const fonts = {
  bold: 'bitter-bold',
  italic: 'bitter-italic',
  regular: 'bitter',
  boltItalic: 'bitter-bold-italic',
};

export const globalStyles = StyleSheet.create({
  logo: {
    width: 60,
    height: 60,
    marginBottom: 10
  },
  title: {
    color: colors.primary,
    fontSize: 22,
    fontFamily: fonts.bold,
    marginBottom: 5
  },
  subTitle: {
    fontSize: 14,
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 30,
    fontFamily: fonts.regular
  },
  welcomeText: {
    color: colors.secondary,
    fontSize: 30,
    fontFamily: fonts.bold,
    textAlign: 'justify',
    padding: 20,
    lineHeight: 30,
  },
  welcomeContainer: {
    flex: 1,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: colors.secondary,
  },
  button: {
    backgroundColor: colors.secondary,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 15,
    width: '100%',
  },
  buttonText: {
    color: colors.primary,
    fontSize: 15,
    fontFamily: fonts.bold,
  },
  buttonDark: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 15,
    width: '100%',
  },
  buttonDarkText: {
    color: colors.secondary,
    fontSize: 15,
    fontFamily: fonts.bold,
  },
  label: {
    color: colors.secondary,
    marginBottom: 4,
    marginTop: 10,
    fontFamily: fonts.regular,
    fontSize: 14
  },
  input: {
    backgroundColor: colors.secondary,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 5,
    color: colors.primary,
    fontFamily: fonts.regular,
    marginTop: 4,
    fontSize: 14
  },
  clickableText: {
    color: colors.secondary,
    fontSize: 12,
    fontFamily: fonts.bold,
    marginStart: 5
  },
  scroll: {
    flexGrow: 1,
  },
});