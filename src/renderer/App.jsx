import { scan } from "react-scan";

import InAppBrowser from "./components/microapps/InAppBrowser";

const App = () => {
  return (
    <div data-atlas="App" className="text-foreground">
      <InAppBrowser />
    </div>
  );
}

export default App;