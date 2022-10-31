import path from 'path'
import fs from 'fs'
import { Image } from './types/image'
import throwError from './utils/error'

export default class File {
  static imagesOriginalPath = path.join(__dirname, '../assets/images/original')
  static imagesResizedPath = path.join(__dirname, '../assets/images/resized')
  static imagesPath = path.join(__dirname, '../assets/images')

  static async accessJsonFile() {
    const file = 'result.json'
    const fileFullPath = path.resolve(this.imagesPath, file)
    try {
      await fs.promises.access(fileFullPath)
      return fileFullPath
    } catch {
      return ''
    }
  }

  static async readJsonFile(): Promise<Image[]> {
    try {
      const fileFullPath = await this.accessJsonFile()
      if (!fileFullPath) throwError("Can't found file")

      let jsonFile = fs.readFileSync(fileFullPath)
      return JSON.parse(jsonFile.toString())
    } catch (e) {
      return []
    }
  }

  static async appendToJsonFile(data: Image[]): Promise<boolean | Error> {
    try {
      const fileFullPath = await this.accessJsonFile()
      if (!fileFullPath) throwError("Can't found file")

      fs.readFile(fileFullPath, (err, data) => {
        let json = JSON.parse(data.toString())
        json.concat(data)
        fs.promises.writeFile(fileFullPath, JSON.stringify(json))
      })
      return true
    } catch (e: any) {
      return e
    }
  }

  static async isImageAvailableOnResized(
    filename: string = '',
    width: string,
    height: string
  ): Promise<boolean> {
    if (!filename || !width || !height) return false
    const resizedImages = await this.readJsonFile()
    return !!resizedImages.filter((image) => {
      return image.filename == filename && image.width == width && image.height == height
    }).length
  }

  static async isImageAvailableOnOriginal(filename: string = ''): Promise<boolean> {
    if (!filename) {
      return false
    }
    return (await File.getAvailableImageNames()).includes(filename)
  }

  static async getAvailableImageNames(): Promise<string[]> {
    try {
      return (await fs.promises.readdir(this.imagesOriginalPath)).map(
        (filename: string): string => filename.split('.')[0]
      )
    } catch {
      return []
    }
  }
}
