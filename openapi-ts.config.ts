import fs from 'node:fs'
import { defineConfig } from '@hey-api/openapi-ts'
import dotenv from 'dotenv'

// eslint-disable-next-line node/prefer-global/process
const env = process.env.NODE_ENV || 'development'
if (fs.existsSync(`.env.${env}`)) {
  dotenv.config({ path: `.env.${env}` })
}
else {
  dotenv.config()
}

export default defineConfig({
// eslint-disable-next-line node/prefer-global/process
  input: process.env.OPENAPI_SPEC_URL!,
  output: 'app/api/v1_1',
})
