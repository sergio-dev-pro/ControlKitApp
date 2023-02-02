import {StyleSheet} from 'react-native';

// GStyles === "GlobalStyles"
const GStyles = StyleSheet.create({
  view: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  container: {
    width: '100%',
    padding: 20,
    maxWidth: 450,
    flex:1
  },
  maxWidth: {maxWidth: 450},
});

export default GStyles;
