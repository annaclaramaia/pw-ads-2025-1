import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box'
import React from 'react'

export default function About() {
  const [state, setState] = React.useState('')

  // Função que é chamada pelo useEffect() para carregar os dados
  // do back-end quando o componente for exibido
  async function loadData() {
    try {
      const response = await fetch(import.meta.env.VITE_API_BASE + '/sobre/1')
      const data = await response.json()

      // Atualiza a variável de estado com os dados obtidos
      setState(data.info)
    }
    catch(error) {
      console.error(error)
    }
  }

  // useEffect() que será executado apenas quando o componente for carregado
  React.useEffect(() => {
    loadData()
  }, [])

  return <>
    <Typography variant="h1">
      Sobre o Projeto Karangos
    </Typography>
    <Box>
      {state}
    </Box>
  </>
}

