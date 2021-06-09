// * Styling
import "./App.css";

// * Components
import AppFrame from "./components/AppFrame";
import Layout from "./components/Layout";

// * Context
import { AuthProvider } from "./context/AuthContext";
import { TxProvider } from "./context/TxContext";

function App() {
  return (
    <AuthProvider>
      <TxProvider>
        <Layout>
          <AppFrame />
        </Layout>
      </TxProvider>
    </AuthProvider>
  );
}

export default App;
