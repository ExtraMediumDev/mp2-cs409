import axios from 'axios'

export type PokemonSummary = {
  id: number
  name: string
}

export type PokemonDetail = {
  id: number
  name: string
  height: number
  weight: number
  base_experience: number
  types: string[]
  abilities: string[]
  sprite: string
}

let cachedList: PokemonSummary[] | null = null

export function spriteUrl(id: number): string {
  return 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/' + id + '.png'
}

function idFromUrl(url: string): number {
  const parts = url.split('/')

  for (let i = parts.length - 1; i >= 0; i--) {
    if (parts[i] !== '') {
      return Number(parts[i])
    }
  }

  return 0
}

export async function getPokemonList(): Promise<PokemonSummary[]> {
  if (cachedList !== null) {
    return cachedList
  }

  const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=151&offset=0')
  const results = response.data.results
  const list: PokemonSummary[] = []

  for (let i = 0; i < results.length; i++) {
    const item = {
      id: idFromUrl(results[i].url),
      name: results[i].name,
    }
    list.push(item)
  }

  cachedList = list
  return list
}

export async function getTypes(): Promise<string[]> {
  const response = await axios.get('https://pokeapi.co/api/v2/type')
  const results = response.data.results
  const names: string[] = []

  for (let i = 0; i < results.length; i++) {
    names.push(results[i].name)
  }

  return names
}

export async function getNamesForType(type: string): Promise<string[]> {
  const response = await axios.get('https://pokeapi.co/api/v2/type/' + type)
  const entries = response.data.pokemon
  const names: string[] = []

  for (let i = 0; i < entries.length; i++) {
    names.push(entries[i].pokemon.name)
  }

  return names
}

export async function getPokemon(id: string): Promise<PokemonDetail> {
  const response = await axios.get('https://pokeapi.co/api/v2/pokemon/' + id)
  const data = response.data

  const types: string[] = []
  for (let i = 0; i < data.types.length; i++) {
    types.push(data.types[i].type.name)
  }

  const abilities: string[] = []
  for (let i = 0; i < data.abilities.length; i++) {
    abilities.push(data.abilities[i].ability.name)
  }

  let sprite = data.sprites.front_default
  if (!sprite) {
    sprite = spriteUrl(data.id)
  }

  const detail: PokemonDetail = {
    id: data.id,
    name: data.name,
    height: data.height,
    weight: data.weight,
    base_experience: data.base_experience,
    types: types,
    abilities: abilities,
    sprite: sprite,
  }

  return detail
}
