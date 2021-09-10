import { _seed } from './_seeding'

_seed().then(() => {
  console.log('Emulator running on http://localhost:4000/')
  process.exit()
})
