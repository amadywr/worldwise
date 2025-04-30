import { createContext, useContext, useEffect, useState } from 'react'

const CitiesContext = createContext()

// const BASE_URL = 'http://localhost:3000'

export function CitiesProvider({ children }) {
  const [cities, setCities] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [currentCity, setCurrentCity] = useState({})

  useEffect(() => {
    function fetchCities() {
      try {
        setIsLoading(true)
        const storedCities = localStorage.getItem('cities')
        if (storedCities) {
          setCities(JSON.parse(storedCities))
        }
      } catch (error) {
        alert('There was an error fetching cities from localStorage')
      } finally {
        setIsLoading(false)
      }
    }

    fetchCities()
  }, [])

  async function getCity(id) {
    try {
      setIsLoading(true)
      const city = cities.find((city) => city.id === Number(id))

      if (city) {
        setCurrentCity(city)
      } else {
        alert('City not found')
      }
    } catch (error) {
      alert('There was an error fetching the city')
    } finally {
      setIsLoading(false)
    }
  }

  async function createCity(newCity) {
    try {
      setIsLoading(true)
      const cityWithId = { ...newCity, id: Date.now() }
      const updatedCities = [...cities, cityWithId]
      setCities(updatedCities)
      localStorage.setItem('cities', JSON.stringify(updatedCities))
    } catch (error) {
      alert('There was an error creating the city')
    } finally {
      setIsLoading(false)
    }
  }

  async function deleteCity(id) {
    try {
      setIsLoading(true)
      const updatedCities = cities.filter((city) => city.id !== id)
      setCities(updatedCities)
      localStorage.setItem('cities', JSON.stringify(updatedCities))
    } catch (error) {
      alert('There was an error deleting the city')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        getCity,
        createCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  )
}

export function useCities() {
  const context = useContext(CitiesContext)

  if (context === undefined)
    throw new Error("Cities context used outside it's provider")

  return context
}

// export { CitiesProvider, useCities }
