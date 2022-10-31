import express from 'express'
import File from '../../file'
import { Image } from '../../types/image'

const images: express.Router = express.Router()

const validate = async (image: Image): Promise<null | string> => {
  if (!(await File.isImageAvailableOnOriginal(image.filename))) {
    const availableImageNames: string = (await File.getAvailableImageNames()).join(', ')
    return `Available images: ${availableImageNames}.`
  }

  if (!image.width && !image.height) {
    return null
  }
  const width: number = parseInt(<string>image.width)
  if (width < 1) {
    return "'width' need to be positive number"
  }
  const height: number = parseInt(<string>image.height)
  if (height < 1) {
    return "'height' need to be positive number"
  }
  return null
}

images.get('/', async (request: express.Request, response: express.Response): Promise<void> => {
  const validationMessage: null | string = await validate(request.query)
  if (validationMessage) {
    response.send(validationMessage)
    return
  }

  let error: null | string = ''

  if (
    await File.isImageAvailableOnResized(
      request.query.filename,
      request.query.width,
      request.query.height
    )
  ) {
  } else {
    error = await File.createThumb(request.query)
  }

  // Handle image processing error
  if (error) {
    response.send(error)
    return
  }

  // Retrieve appropriate image path and display image
  const path: null | string = await File.getImagePath(request.query)
  if (path) {
    response.sendFile(path)
  } else {
    response.send('This should not have happened :-D What did you do?')
  }
})

export default images
