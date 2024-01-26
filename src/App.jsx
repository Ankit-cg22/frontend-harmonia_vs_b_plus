/* eslint-disable no-empty */
/* eslint-disable no-unused-vars */
// App.js

import React, { useState } from 'react';
import {
  Container,
  Paper,
  Grid,
  TextField,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import axios from 'axios';

const App = () => {
  const [action, setAction] = useState('insert');
  const [key, setKey] = useState('');
  const [value, setValue] = useState('');
  const [data1, setData1] = useState('');
  const [data2, setData2] = useState('');
  const [time1 , setTime1] = useState('')
  const [time2 , setTime2] = useState('')
  const [loading , setLoading] = useState(false)
  const HARMONIA_BASE_URL  = 'https://harmonia-b-plus-tree-server.onrender.com'
  const B_PLUS_BASE_URL = 'https://bplustreeserver.up.railway.app'
  const handleSubmit = async (e) => {
    e.preventDefault();
    function microsecondsToMilliseconds(microsecondsString) {
      const microseconds = parseFloat(microsecondsString);
      if (isNaN(microseconds)) {
        console.error('Invalid microsecond value. Please provide a valid numeric value.');
        return null;
      }
      return microseconds / 1000;
    }

    setData1("")
    setTime1("")
    setTime2("")
    setData2("")
    if(action === 'insert'){
        setLoading(true)

        const req1 =axios.post(HARMONIA_BASE_URL + '/insert', {key , value } )
        const req2 =axios.post(B_PLUS_BASE_URL + '/insert', {key , value } )
        

        axios.all([req1 , req2])
        .then(axios.spread((res1 , res2)=>{
          setData1(res1.data.data.message);
          setTime1(microsecondsToMilliseconds(res1.data.data.timeTakenInMicroSeconds));
          setData2("Data Inserted successfully")
          setTime2(res2.data.time)
        }))
        .catch(err =>{
          console.log(err)
        })
        .finally(()=>{
          setLoading(false)
        })

    }
    else if(action === 'search'){
        setLoading(true)
        const req1 = axios.post(HARMONIA_BASE_URL + '/search', {key } )
        const req2 = axios.post(B_PLUS_BASE_URL + '/search', {key } )

        axios.all([req1 , req2])
        .then(axios.spread((res1 , res2) => {
          setData1(res1.data.data.value == '-1' ? "Data not found" : res1.data.data.value);
          setTime1(microsecondsToMilliseconds(res1.data.data.timeTakenInMicroSeconds));
          setData2(res2.data.value.length == 0 ? "Data not foud" : res2.data.value[0])
          setTime2(res2.data.time)
        }))
        .finally(()=>{
          setLoading(false)
        })
    }
  };

  return (
    <Container maxWidth="md" style={{ marginTop: '50px' }}>
      <Typography variant="h5" style={{marginBottom : "20px"}}>Comparison between harmonia b+ tree and regular b+ tree</Typography>
      <Grid container spacing={2}>
        {/* Section 1: Form */}
        <Grid item xs={6}>
          <Paper elevation={3} style={{ padding: '20px' }}>
            <Typography variant="h5" gutterBottom>
              Select you operation
            </Typography>
            <form onSubmit={handleSubmit}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Action</InputLabel>
                <Select
                  value={action}
                  onChange={(e) => setAction(e.target.value)}
                >
                  <MenuItem value="insert">Insert</MenuItem>
                  <MenuItem value="search">Search</MenuItem>
                </Select>
              </FormControl>

              {action === 'insert' && (
                <>
                  <TextField
                    label="Key"
                    fullWidth
                    margin="normal"
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                  />
                  <TextField
                    label="Value"
                    fullWidth
                    margin="normal"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                  />
                </>
              )}

              {action === 'search' && (
                <TextField
                  label="Key"
                  fullWidth
                  margin="normal"
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                />
              )}

              <Button
                type="submit"
                variant="contained"
                color="primary"
                style={{ marginTop: '20px' }}
              >
                {loading ? <CircularProgress style={{color:"white"}}/> : 'Submit'}
              </Button>
            </form>
          </Paper>
        </Grid>

        {/* Section 2: Results */}
        <Grid item xs={6}>
          <Grid container spacing={2}>
            {/* Subsection 1: Result from Server 1 */}
            <Grid item xs={12}>
              <Paper elevation={3} style={{ padding: '20px', marginBottom: '10px' }}>
                <Typography variant="h6" gutterBottom>
                  Result from Harmoia B+ tree server
                </Typography>
                {data1 && 
                <>
                <Typography variant="subtitle1">data : {data1}</Typography>
                <Typography variant="subtitle1">time (in milliseconds): {time1}</Typography>
                </>}
              </Paper>
            </Grid>

            {/* Subsection 2: Result from Server 2 */}
            <Grid item xs={12}>
              <Paper elevation={3} style={{ padding: '20px' }}>
                <Typography variant="h6" gutterBottom>
                  Result from B+ tree server
                </Typography>
                {data2 && 
                <>
                <Typography variant="subtitle1">data : {data2}</Typography>
                <Typography variant="subtitle1">time (in milliseconds): {time2}</Typography>
                </>}
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default App;
