import React, { useEffect } from 'react';
import { StatusBar, View } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import RootNavigator from './src/navigation/RootNavigator';
import { store } from './src/redux/store/store';
import { persistor } from './src/redux/store/persistStore';
import { enableScreens } from 'react-native-screens';

const App = () => {
  enableScreens();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <View style={{ backgroundColor: '#ffffff' }}>
            <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
          </View>
          <RootNavigator />
        </PersistGate>
      </Provider>
    </GestureHandlerRootView>
  );
};

export default App;