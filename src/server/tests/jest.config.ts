import type { Config } from '@jest/types'

const config: Config.InitialOptions = {
  verbose: true,
  testEnvironment: 'node',
  preset: 'ts-jest',
  globals: {
    'ts-jest': {
      isolatedModules: true
    }
  },
  rootDir: '../../',
  setupFilesAfterEnv: [
    'dotenv/config',
    '@testing-library/jest-dom/extend-expect'
  ],
  moduleNameMapper: {
    '^@root/(.*)$': '<rootDir>/$1',
    '^@controllers/(.*)$': '<rootDir>/server/controllers/$1',
    '^@middleware/(.*)$': '<rootDir>/server/middleware/$1',
    '^@util/(.*)$': '<rootDir>/server/util/$1',
    '^@services/(.*)$': '<rootDir>/server/services/$1',
    '^@models/(.*)$': '<rootDir>/server/models/$1'
  }
}

export default config
