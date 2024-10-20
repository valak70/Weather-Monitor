import React from 'react'
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom"; 
import WeatherSummary from './components/WeatherSummary/weatherSummary'
import AlertForm from './components/Alert/alert'

const App = () => {
  return (
    <BrowserRouter>
    <Routes>
      <Route path = "/" element = {<WeatherSummary/>}></Route>
      <Route path = "/alert" element = {<AlertForm/>}></Route>
    </Routes>
    </BrowserRouter>
  )
}

export default App