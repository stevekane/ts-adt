export const log = console.log.bind(console)

export function concat<A> (a: A, list: A[]): A[] {
  return list.concat(a)
}

export function randIntRange (min: number, max: number): number {
  return min + Math.round(Math.random() * (max - min))
}
