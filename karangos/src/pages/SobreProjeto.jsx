import React from 'react'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

export default function SobreProjeto() {
    const [state, setState] = React.useState('')
    
    async function loadData() {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_BASE}/sobre/1`)
          const data = await response.json()

          setState( data.info )
        } 
        catch(error) {
          console.error(error)
        }
    }
    
    React.useEffect(() => {
        loadData()
    }, [])

    return (
        <>
        <Typography variant='h1' gutterBottom>
            Sobre o Projeto Karangos
        </Typography>

        <Box>
         <Typography variant='body1'>
            {state}
         </Typography>
        </Box>
        
        </>
    )
}