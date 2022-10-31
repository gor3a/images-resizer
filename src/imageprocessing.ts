import sharp from "sharp"

interface sharpResize {
  source: string
  target: string
  width: number
  height: number
}

const resizeImage = async (params: sharpResize): Promise<null | string> => {
  try {
    await sharp(params.source)
      .resize(params.width, params.height)
      .toFormat('jpeg')
      .toFile(params.target)
    return null
  } catch {
    return 'Image could not be resized.'
  }
}

export default resizeImage
