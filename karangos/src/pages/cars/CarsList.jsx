import React from 'react'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper';
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import IconButton from '@mui/material/IconButton'
import { Link } from 'react-router-dom'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import AddCircleIcon from '@mui/icons-material/AddCircle'

import { feedbackWait, feedbackConfirm, feedbackNotify } from '../../ui/Feedback'

export default function CarsList() {

  const columns = [
    { 
      field: 'id', 
      headerName: 'Cód.', 
      width: 90 
    },
    {
      field: 'brand',
      headerName: 'Marca / Modelo',
      width: 200,
      valueGetter: (value, row) => row.brand + '/' + row.model
    },
    {
      field: 'color',
      headerName: 'Cor',
      width: 150
    },
    {
      field: 'year_manufacture',
      headerName: 'Ano de Fabricação',
      width: 150,
      align: 'center',
      headerAlign: 'center',
      valueFormatter: value => {
        if(value) {
          const date = new Date(value)
        }
        else return ''
      }
    },
    {
      field: 'imported',
      headerName: 'Importado',
      width: 90,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (params.value === 1 ? 'SIM' : null)
    },
    {
      field: 'plates',
      headerName: 'Placas',
      width: 150,
      align: 'center',
      headerAlign: 'center'
    },
    {
      field: 'selling_price',
      headerName: 'Preço de Venda',
      width: 200,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => {
        if (params.value == null) return null;
        return params.value.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        });
      }
    },
    {
      field: 'selling_date',
      headerName: 'Data de Venda',
      width: 200,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => {
        if (!params.value) return null;
        const date = new Date(params.value);
        return date.toLocaleString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          timeZone: 'UTC',
        });
      }
    },
    {
      field: '_actions',
      headerName: 'Ações',
      width: 150,
      sortable: false,
      align: 'center',
      headerAlign: 'center',
      renderCell: params => {
        return <>
          <Link to={'./' + params.id}>
            <IconButton aria-label="editar">
              <EditIcon />
            </IconButton>
          </Link>
          
          <IconButton aria-label="excluir" 
            onClick={() => handleDeleteButtonClick(params.id)}>
            <DeleteForeverIcon color="error" />
          </IconButton>
        </>
      }
    } 
  ];

  const [state, setState] = React.useState({
    cars: []
  })
  const {
    cars
  } = state

  async function loadData() {
    feedbackWait(true)
    try {
      const response = await fetch(import.meta.env.VITE_API_BASE + '/cars')
      const data = await response.json()

      setState({ ...state, cars: data })
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

  async function handleDeleteButtonClick(id) {
    if(await feedbackConfirm('Deseja realmente excluir este item?')) {
      feedbackWait(true)
      try {
        await fetch(import.meta.env.VITE_API_BASE + `/cars/${id}`,
          { method: 'DELETE' }
        )
        loadData()
        feedbackNotify('Exclusão efetuada com sucesso.')
      }
      catch(error) {
        console.error(error)
        feedbackNotify('ERRO: ' + error.message, 'error')
      }
      finally {
        feedbackWait(false)
      }
    }
  }

  return <>
    <Typography variant="h1" gutterBottom>
      Listagem de Veículos
    </Typography>

    <Box sx={{
      display: 'flex',
      justifyContent: 'right',    // Conteúdo alinhado à direita
      mb: 2                       // Margem inferior (margin-bottom)
    }}>
      <Link to={'./new'}>
        <Button
          variant="contained"
          size="large"
          color="secondary"
          startIcon={ <AddCircleIcon /> }
        >
          Novo Veículo
        </Button>
      </Link>
    </Box>

    <Paper sx={{ height: 400, width: '100%' }} elevation={10}>
      <DataGrid
        rows={cars}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5]}
        disableRowSelectionOnClick
      />
    </Paper>
  </>
}