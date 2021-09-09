export interface UseCase<I, O> {
  exec (input: I): O
}
