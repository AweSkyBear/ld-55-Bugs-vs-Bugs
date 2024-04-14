let _gameState: 'in-game' | 'before-game' = 'before-game'

export const isInGame = () => _gameState === 'in-game'
export const isNotInGame = () => _gameState !== 'in-game'

export const setGameState = (st: typeof _gameState) => (_gameState = st)

export const getGameState = () => _gameState
