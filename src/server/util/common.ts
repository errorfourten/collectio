import common from '@root/config/common'

const PORT = process.env.PORT || 8000

const getMongoDBURI = () => {
  if (common.inProduction) {
    if (!process.env.MONGO_PROD_DB) {
      throw new Error('Production requires environment variable MONGO_PROD_DB to be set!')
    }
    return process.env.MONGO_PROD_DB
  }
  if (!process.env.MONGO_TEST_DB) {
    throw new Error('Testing requires environment variable MONGO_TEST_DB to be set!')
  }
  return process.env.MONGO_TEST_DB
}
const MONGODB_URI = getMongoDBURI()

export default {
  ...common,
  PORT,
  MONGODB_URI
}
