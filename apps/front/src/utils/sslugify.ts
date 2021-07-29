import slugify from 'slugify'
export const sslugify = (str_: string) => slugify(str_, { lower: true, strict: true })
