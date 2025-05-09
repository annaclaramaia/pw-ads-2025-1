import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

// import './App.css'

import CssBaseline from '@mui/material/CssBaseline'

import { ThemeProvider } from '@mui/material/styles'
import theme from './ui/theme'

import FooterBar from "./ui/FooterBar"
import TopBar from './ui/TopBar'

function App() {

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <TopBar />
      </ThemeProvider>
      <FooterBar/>
    </>
  )
}

export default App