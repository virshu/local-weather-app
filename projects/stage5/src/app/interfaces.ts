export interface ICurrentWeather {
  city: string
  country: string
  date: number
  image: string
  temperature: number
  description: string
}

export interface ICurrentWeatherData {
  weather: [
    {
      description: string
      icon: string
    },
  ]
  main: {
    temp: number
  }
  sys: {
    country: string
  }
  dt: number
  name: string
}