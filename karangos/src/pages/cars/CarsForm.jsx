import React from 'react'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { ptBR } from 'date-fns/locale/pt-BR'
import { feedbackWait, feedbackNotify, feedbackConfirm } from '../../ui/Feedback'
import { useNavigate, useParams } from 'react-router-dom'
import { useMask } from '@react-input/mask'
import { Checkbox, FormControlLabel } from '@mui/material';


export default function CarsForm() {

  const carsColors = [
    { value: 'Amarelo', label: 'Amarelo' },
    { value: 'Azul', label: 'Azul' },
    { value: 'Bege', label: 'Bege' },
    { value: 'Branco', label: 'Branco' },
    { value: 'Cinza', label: 'Cinza' },
    { value: 'Dourado', label: 'Dourado' },
    { value: 'Laranja', label: 'Laranja' },
    { value: 'Marrom', label: 'Marrom' },
    { value: 'Prata', label: 'Prata' },
    { value: 'Preto', label: 'Preto' },
    { value: 'Rosa', label: 'Rosa' },
    { value: 'Roxo', label: 'Roxo' },
    { value: 'Verde', label: 'Verde' },
    { value: 'Vermelho', label: 'Vermelho' },
    { value: 'Vinho', label: 'Vinho' }
  ];  

  const carsPlates = useMask({
      mask: "aaa-#$##",
      replacement: { 
        'a': /[A-Z]/, 
        '#': /[0-9]/,
        '$': /[A-J0-9]/
      },
      showMask: false
  })

  const currentYear = new Date().getFullYear();
  const yearManufactureOptions = Array.from({ length: currentYear - 1950 }, (_, index) => {
  const year = currentYear - index;
  return { value: year, label: year.toString() };
  });

  function ImportedCheckbox({ value, onChange }) {
    return (
      <div className="MuiFormControl-root">
        <FormControlLabel
          control={
            <Checkbox
              checked={value === 1}
              onChange={(e) => onChange(e.target.checked ? 1 : 0)}
              color="primary"
            />
          }
          label="Importado"
        />
      </div>
    );
  }
  

  const formDefaults = {
    brand: '',
    model: '',
    color: '',
    year_manufacture: '',
    imported: 0,
    plates: '',
    selling_price: null,
    selling_date: null
  }

  const navigate = useNavigate()
  const params = useParams()

  // Variáveis de estado
  const [state, setState] = React.useState({
    cars: { ...formDefaults },
    formModified: false
  })
  const {
    cars,
    formModified
  } = state

  React.useEffect(() => {
    // Sabemos que estamos editando (e não cadastrando um novo) veículo
    // quando a rota ativa contiver um parâmetro chamado id
    if(params.id) loadData()
  }, [])

  async function loadData() {
    feedbackWait(true)
    try {
      const response = await fetch(
        import.meta.env.VITE_API_BASE + `/cars/${params.id}`
      )
      const result = await response.json()

      // Armazena os dados obtidos na variável de estado
      setState({ ...state, cars: result })
    }
    catch(error) {
      console.error(error)
      feedbackNotify('ERRO: ' + error.message)
    }
    finally {
      feedbackWait(false)
    }
  }

  /* Preenche o campo do objeto "cars" conforme o campo correspondente do
     formulário for modificado */
  function handleFieldChange(event) {
    // Vamos observar no console as informações que chegam à função
    console.log('CAMPO MODIFICADO:', {
      name: event.target.name,
      value: event.target.value
    })

    const carsCopy = { ...cars }
    carsCopy[event.target.name] = event.target.value
    setState({ ...state, cars: carsCopy, formModified: true })
  }

  async function handleFormSubmit(event) {
    event.preventDefault() 
    feedbackWait(true)
    const reqOptions = {
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...cars,
        imported: cars.imported ? 1 : 0,
        selling_date: cars.selling_date 
          ? new Date(cars.selling_date).toISOString()
          : null
      })
    }
      try{
        if(params.id) {
        await fetch(
            import.meta.env.VITE_API_BASE + `/cars/${params.id}`,
            { ...reqOptions, method: 'PUT' }
          )
        }
      else {
        await fetch(
          import.meta.env.VITE_API_BASE + `/cars`,
          { ...reqOptions, method: 'POST' }
        )
      }

      feedbackNotify('Item salvo com sucesso.', 'success', 2500, () => {
        // Retorna para a página de listagem
        navigate('..', { relative: 'path', replace: true })
      })
    }
    catch(error) {
      console.error(error)
      feedbackNotify('ERRO: ' + error.message, 'error')
    }
    finally {
      feedbackWait(false)
    }
  }

  async function handleBackButtonClick() {
    if(
      formModified &&
      ! await feedbackConfirm('Há informações não salvas. Deseja realmente sair?')
    ) return    // Sai da função sem fazer nada

    // Aqui o usuário respondeu que quer voltar e perder os dados
    navigate('..', { relative: 'path', replace: 'true' })
  }

  return <>
    <Typography variant="h1" gutterBottom>
      Cadastro de Veículos
    </Typography>

    <Box className="form-fields">
      <form onSubmit={handleFormSubmit}>

        {/* autoFocus ~> foco do teclado no primeiro campo */}
        <TextField 
          variant="outlined"
          name="brand"
          label="Marca"
          fullWidth
          required
          autoFocus
          value={cars.brand}
          onChange={handleFieldChange}
        />

        <TextField
          variant="outlined" 
          name="model"
          label="Modelo" 
          fullWidth
          required
          value={cars.model}
          onChange={handleFieldChange}
        />

        <TextField
          variant="outlined"
          name="color"
          label="Cor"
          fullWidth
          required
          value={cars.color}
          onChange={handleFieldChange}
          select
        >
        {
          carsColors.map(s =>
          <MenuItem key={s.value} value={s.value}>
            {s.label}
          </MenuItem>
          )
        }
        </TextField>


        { }
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
          <DatePicker 
            label="Data de Venda"
            value={cars.selling_date}
            slotProps={{
              textField: {
                variant: "outlined",
                fullWidth: true
              }
            }}
            onChange={ date => {
              const event = { target: { name: 'selling_date', value: date } }
              handleFieldChange(event)
            }}
          />
        </LocalizationProvider>

        <TextField 
          variant="outlined"
          name="year_manufacture"
          label="Ano de Fabricação"
          fullWidth
          required
          value={cars.year_manufacture}
          onChange={handleFieldChange}
          select
        >
          {
            yearManufactureOptions.map(opt =>
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            )
          }
        </TextField>        

        <ImportedCheckbox
          value={cars.imported}
          onChange={(checked) => {
          const event = { target: { name: 'imported', value: checked } }
          handleFieldChange(event)
          }}
        />

        <TextField
          inputRef={carsPlates}
          name="plates"
          label="Placas"
          required
          value={cars.plates}
          onChange={handleFieldChange}
        />

        <TextField
          variant="outlined"
          name="selling_price"
          label="Preço de Venda"
          type="number"
          fullWidth
          value={cars.selling_price ?? ''}
          onChange={(e) => {
            const event = { target: { name: 'selling_price', value: Number(e.target.value) } }
            handleFieldChange(event)
          }}
        />

        <Box sx={{
          display: 'flex',
          justifyContent: 'space-around',
          width: '100%'
        }}>
          <Button
            variant="contained"
            color="secondary"
            type="submit"
          >
            Salvar
          </Button>
          <Button
            variant="outlined"
            onClick={handleBackButtonClick}
          >
            Voltar
          </Button>
        </Box>

        <Box sx={{
          fontFamily: 'monospace',
          display: 'flex',
          flexDirection: 'column',
          width: '100vw'
        }}>
          { JSON.stringify(cars, null, ' ') }
        </Box>

      </form>
    </Box>
  </>
}