import type { IdParam } from '../../types/request.types.ts'
import {
  createProductService,
  findProductsService,
  findProductByIdService,
  updateProductService,
  deleteProductService,
} from './productServices.ts'
import type { Request, Response } from 'express'

export const createProductController = async (req: Request, res: Response) => {
  const createdProduct = await createProductService(req.body)

  return res.status(201).json(createdProduct)
}

export const findProductsController = async (req: Request, res: Response) => {
  const products = await findProductsService()
  return res.status(200).json(products)
}

export const findProductByIdController = async (
  req: Request<IdParam>,
  res: Response,
) => {
  const product = await findProductByIdService(req.params.id)

  return res.status(200).json(product)
}

export const updateProductController = async (
  req: Request<IdParam>,
  res: Response,
) => {
  const updatedProduct = await updateProductService(req.body, req.params.id)
  return res.status(200).json(updatedProduct)
}

export const deleteProductController = async (
  req: Request<IdParam>,
  res: Response,
) => {
  await deleteProductService(req.params.id)

  return res.status(204).send()
}
