import React, { Component, createRef } from "react";
import debounce from "lodash.debounce";
import Input from "./components/Input";
import SearchResults from "./components/SearchResults";
import SetUnits from "./components/SetUnits";
import WeatherReport from "./components/WeatherReport";

class App extends Component {
  state={
    searchResults:[],
    error:false,
    isLoading:true,
    selectedLocId:0,
    tenpUnits:"C",
    weatherData:{}
  }
  searchRef = createRef();
  componentDidMount(){
    this.searchRef.current.focus();
    this.getWeather();
  }

  componentDidUpdate(_, prevState){
    if(
        prevState.selectedLocId !== this.state.selectedLocId || prevState.tempUnits !== this.state.tempUnits
    ){
        this.getWeather(this.state.selectedLocId);
    }
  }
  searchLocations = debounce(keyword=>{
    fetch(`https://api.weatherserver.com/weather/cities/${keyword}`)
    .then(res=> res.json())
    .then(({results})=>this.setState({searchResults: results,error:false}))
    .catch(() => this.setState({error:true}))
  },200)

  getWeather =() =>{
    this.setState({
        searchResults:[],
        isLoading:true,
        error:false
    });
    this.searchRef.current.value="";
    fetch(`https://api.weatherserver.com/weather/current/${this.state.selectedLocId}/${this.state.tempUnits}`)
    .then(res=> res.json())
    .then(results => this.setState({
        weatherData:results,
        isLoading:false
    }))
    .catch(()=>this.setState({error:true}))
  }

  render() {
    return (
      <div id="weather-app">
        <h1>WeatherWatch</h1>
        <Input label="LOCATION" onInput={e=> this.searchLocations(e.target.value)} inputRef={this.searchRef}/>
        {this.state.searchResults.length>0 && (
            <SearchResults data={this.state.searchResults} selectLocation ={cityId => this.setState({selectedLocId:cityId})} />
        )}
      <SetUnits value={this.state.tempUnits} onSet={e=>this.setState({tempUnits:e.target.value})} />

      {this.state.isLoading ? (<div id="id-loading" />):
      <WeatherReport 
       weatherData={this.state.weatherData}
       units ={this.state.tempUnits}
      />
      }
       
       {this.state.error? <div id="error-panel"/>:null}
      </div>
    );
  }
}

export default App;
