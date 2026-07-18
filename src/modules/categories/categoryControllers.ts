import type { Request, Response } from 'express'
import type { IdParam } from '../../types/request.types.ts'
import {
  createCategoryService,
  deleteCategoryService,
  findAllCategoriesService,
  findCategoryByIdService,
  updateCategoryService,
} from './categoryServices.ts'

export const createCategoryController = async (req: Request, res: Response) => {
  const createdCategory = await createCategoryService(req.body)

  return res.status(201).json(createdCategory)
}

export const findAllCategoriesController = async (
  req: Request,
  res: Response,
) => {
  const foundAllCategories = await findAllCategoriesService()

  return res.status(200).json(foundAllCategories)
}

export const findCategoryByIdController = async (
  req: Request<IdParam>,
  res: Response,
) => {
  const foundCategoryById = await findCategoryByIdService(req.params.id)

  return res.status(200).json(foundCategoryById)
}

export const updateCategoryController = async (
  req: Request<IdParam>,
  res: Response,
) => {
  const updatedCategory = await updateCategoryService(req.body, req.params.id)

  return res.status(200).json(updatedCategory)
}

export const deleteCategoryController = async (
  req: Request<IdParam>,
  res: Response,
) => {
  await deleteCategoryService(req.params.id)

  return res.status(204).send()
}
