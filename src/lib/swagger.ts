import fs from 'fs'
import path from 'path'
import yaml from 'js-yaml'

export const getApiDocs = async () => {
  const filePath = path.join(process.cwd(), 'openapi.yaml')
  const fileContents = fs.readFileSync(filePath, 'utf8')
  const spec = yaml.load(fileContents) as object
  return spec
}
