import { useEffect, useState } from 'react'
import type { ReactElement } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getPokemon, getPokemonList, type PokemonDetail } from '../api'

export default function DetailPage() {
  const params = useParams()
  const id = params.id
  const [pokemon, setPokemon] = useState<PokemonDetail | null>(null)
  const [ids, setIds] = useState<number[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      if (!id) {
        return
      }

      setPokemon(null)
      setError('')

      try {
        const detail = await getPokemon(id)
        setPokemon(detail)
      } catch {
        setError('Could not load this Pokemon.')
      }
    }

    load()
  }, [id])

  useEffect(() => {
    async function loadIds() {
      try {
        const list = await getPokemonList()
        const allIds: number[] = []

        for (let i = 0; i < list.length; i++) {
          allIds.push(list[i].id)
        }

        setIds(allIds)
      } catch {
        setError('Could not load this Pokemon.')
      }
    }

    loadIds()
  }, [])

  if (error !== '') {
    return <p>{error}</p>
  }

  if (pokemon === null) {
    return <p>Loading...</p>
  }

  let index = -1

  for (let i = 0; i < ids.length; i++) {
    if (ids[i] === pokemon.id) {
      index = i
    }
  }

  let previousId: number | null = null
  if (index > 0) {
    previousId = ids[index - 1]
  }

  let nextId: number | null = null
  if (index >= 0 && index < ids.length - 1) {
    nextId = ids[index + 1]
  }

  let previousButton: ReactElement = <span>Previous</span>
  if (previousId !== null) {
    previousButton = <Link to={'/pokemon/' + previousId}>Previous</Link>
  }

  let nextButton: ReactElement = <span>Next</span>
  if (nextId !== null) {
    nextButton = <Link to={'/pokemon/' + nextId}>Next</Link>
  }

  return (
    <section className="detail">
      <img src={pokemon.sprite} alt={pokemon.name} />
      <h1>{pokemon.name}</h1>
      <p>ID: {pokemon.id}</p>
      <p>Height: {pokemon.height}</p>
      <p>Weight: {pokemon.weight}</p>
      <p>Base experience: {pokemon.base_experience}</p>
      <p>Types: {pokemon.types.join(', ')}</p>
      <p>Abilities: {pokemon.abilities.join(', ')}</p>
      <div className="controls">
        {previousButton}
        {nextButton}
      </div>
    </section>
  )
}
