import { useEffect, useState } from 'react'
import type { ChangeEvent, ReactElement } from 'react'
import { Link } from 'react-router-dom'
import { getPokemonList, type PokemonSummary } from '../api'

export default function ListPage() {
  const [pokemon, setPokemon] = useState<PokemonSummary[]>([])
  const [query, setQuery] = useState('')
  const [sortBy, setSortBy] = useState('id')
  const [order, setOrder] = useState('asc')
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      try {
        const list = await getPokemonList()
        setPokemon(list)
      } catch {
        setError('Could not load Pokemon.')
      }
    }

    load()
  }, [])

  function handleQueryChange(event: ChangeEvent<HTMLInputElement>) {
    setQuery(event.target.value)
  }

  function handleSortByChange(event: ChangeEvent<HTMLSelectElement>) {
    setSortBy(event.target.value)
  }

  function handleOrderChange(event: ChangeEvent<HTMLSelectElement>) {
    setOrder(event.target.value)
  }

  function comparePokemon(a: PokemonSummary, b: PokemonSummary): number {
    if (sortBy === 'name') {
      if (a.name < b.name) {
        return -1
      } else if (a.name > b.name) {
        return 1
      } else {
        return 0
      }
    } else {
      return a.id - b.id
    }
  }

  if (error !== '') {
    return <p>{error}</p>
  }

  const search = query.trim().toLowerCase()
  const shown: PokemonSummary[] = []

  for (let i = 0; i < pokemon.length; i++) {
    if (pokemon[i].name.includes(search)) {
      shown.push(pokemon[i])
    }
  }

  shown.sort(comparePokemon)

  if (order === 'desc') {
    shown.reverse()
  }

  const rows: ReactElement[] = []

  for (let i = 0; i < shown.length; i++) {
    const item = shown[i]
    rows.push(
      <li key={item.id}>
        <Link to={'/pokemon/' + item.id}>
          #{item.id} {item.name}
        </Link>
      </li>,
    )
  }

  return (
    <section>
      <h1>Pokemon</h1>
      <div className="controls">
        <input value={query} onChange={handleQueryChange} placeholder="Search by name" />
        <select value={sortBy} onChange={handleSortByChange}>
          <option value="id">ID</option>
          <option value="name">Name</option>
        </select>
        <select value={order} onChange={handleOrderChange}>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
      <ul className="list">{rows}</ul>
    </section>
  )
}
