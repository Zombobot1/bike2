import { _seed } from './_seeding'

_seed().then(() => {
  console.info('Emulator running on http://localhost:4000/')
  process.exit()
})
