import React from 'react'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import FavoriteIcon from '@mui/icons-material/Favorite';
import foto from '../assets/vintage-cars.png'

export default function SobreProjeto() {
    const [likes, setLikes] = React.useState(() => {
        
        const storedLikes = window.localStorage.getItem('likes');
        
        return storedLikes ? Number(storedLikes) : 0;
    })
    
    React.useEffect(() => {
        window.localStorage.setItem('likes', likes)
    }, [likes])

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

        <Card sx={{ maxWidth: 400 }}>
            
        <CardMedia
            sx={{ height: 300 }}
            image={foto}
            title="vintage-cars.png"
        />

        <CardContent>
            <Typography gutterBottom variant="h5" component="div">
                Sobre o Projeto Karangos
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {state}
            </Typography>
        </CardContent>

        <CardActions>
            <Button 
            variant="contained"
            color="secondary"
            startIcon={<FavoriteIcon />}
            onClick={() => setLikes(Number(likes) + 1)}
            >
            Curtir ({likes})
            </Button>
        </CardActions>
        
        </Card>
        </>
    );
}