import { _seed } from './_seeding'
import seedUsers from './_initUsers'

seedUsers().then(() => {
  _seed().then(() => {
    console.info('Seeding success!')
    process.exit(0)
  })
})
