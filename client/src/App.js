import useLocalStorage from 'use-local-storage';
import './App.css';
import Home from './components/Home';

function App() {  
  const defaultDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const [theme, setTheme] = useLocalStorage('theme', defaultDark? 'dark': 'light');

  const switchTheme = () => {
    const newTheme = theme === 'light'? 'dark': 'light';
    setTheme(newTheme);
  }

  return (
    <div className="App" data-theme={theme}>
      <Home switchTheme={switchTheme} theme={theme}/>
    </div>
  );
}

export default App;
