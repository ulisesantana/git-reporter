import { handleError } from '../../../../src/core/domain/error'

describe('Errors should be handled', () => {
  it('logging instances of errors', () => {
    const log = jest.fn()

    handleError(new Error('Boom!!'), log)

    expect(log).toHaveBeenCalledWith('Error: Boom!!')
  })
  it('logging unknown errors', () => {
    const log = jest.fn()

    handleError('fake error', log)

    expect(log).toHaveBeenCalledWith('Unknown error received:', 'fake error')
  })
})
