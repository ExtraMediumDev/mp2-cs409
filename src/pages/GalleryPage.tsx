import { useEffect, useState } from 'react'
import type { ChangeEvent, ReactElement } from 'react'
import { Link } from 'react-router-dom'
import { getNamesForType, getPokemonList, getTypes, spriteUrl, type PokemonSummary } from '../api'

export default function GalleryPage() {
  const [pokemon, setPokemon] = useState<PokemonSummary[]>([])
  const [types, setTypes] = useState<string[]>([])
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [allowedNames, setAllowedNames] = useState<string[] | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      try {
        const list = await getPokemonList()
        const typeNames = await getTypes()
        setPokemon(list)
        setTypes(typeNames)
      } catch {
        setError('Could not load gallery.')
      }
    }

    load()
  }, [])

  useEffect(() => {
    async function loadAllowedNames() {
      if (selectedTypes.length === 0) {
        setAllowedNames(null)
        return
      }

      try {
        const names: string[] = []

        for (let i = 0; i < selectedTypes.length; i++) {
          const namesForType = await getNamesForType(selectedTypes[i])

          for (let j = 0; j < namesForType.length; j++) {
            names.push(namesForType[j])
          }
        }

        setAllowedNames(names)
      } catch {
        setError('Could not filter by type.')
      }
    }

    loadAllowedNames()
  }, [selectedTypes])

  function handleTypeChange(event: ChangeEvent<HTMLInputElement>) {
    const type = event.target.value
    const next: string[] = []
    let alreadySelected = false

    for (let i = 0; i < selectedTypes.length; i++) {
      if (selectedTypes[i] === type) {
        alreadySelected = true
      } else {
        next.push(selectedTypes[i])
      }
    }

    if (!alreadySelected) {
      next.push(type)
    }

    setSelectedTypes(next)
  }

  if (error !== '') {
    return <p>{error}</p>
  }

  const shown: PokemonSummary[] = []

  for (let i = 0; i < pokemon.length; i++) {
    if (allowedNames === null) {
      shown.push(pokemon[i])
    } else if (allowedNames.includes(pokemon[i].name)) {
      shown.push(pokemon[i])
    }
  }

  const filters: ReactElement[] = []

  for (let i = 0; i < types.length; i++) {
    const type = types[i]
    filters.push(
      <label key={type}>
        <input
          type="checkbox"
          value={type}
          checked={selectedTypes.includes(type)}
          onChange={handleTypeChange}
        />
        {type}
      </label>,
    )
  }

  const cards: ReactElement[] = []

  for (let i = 0; i < shown.length; i++) {
    const item = shown[i]
    cards.push(
      <Link key={item.id} to={'/pokemon/' + item.id}>
        <img src={spriteUrl(item.id)} alt={item.name} />
        <span>{item.name}</span>
      </Link>,
    )
  }

  return (
    <section>
      <h1>Gallery</h1>
      <div className="filters">{filters}</div>
      <div className="gallery">{cards}</div>
    </section>
  )
}
