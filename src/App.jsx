import './App.css';
import MyRoute from './Router';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

// Import store and persistor from reduxStore
import { store, persistor } from './reduxStore/store';

function App() {

  return (

        <Provider store={store}> {/* Provide Redux store */}
      <PersistGate loading={null} persistor={persistor}> {/* Wait for persisted state */}
          <MyRoute />
      </PersistGate>
    </Provider>

  );

}

export default App;
