import React from 'react'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

export default function SobreProjeto() {
    const [state, setState] = React.useState({
        info: ''
    })
    const {
        info
    } = state
    
    async function loadData() {
        feedbackWait(true)
        try {
          const response = await fetch(`${import.meta.env.VITE_API_BASE}/sobre/1`)
          const data = await response.json()
          console.log('API RETORNOU:', data)
          setState({ ...state, info: data.info })
        } 
        catch(error) {
          console.error(error)
          feedbackNotify(error.message, 'error')
        }
        finally {
          feedbackWait(false)
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
            {info}
         </Typography>
        </Box>
        
        </>
    )
}