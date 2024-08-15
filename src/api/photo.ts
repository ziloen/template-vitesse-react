import z from 'zod'
import { request } from './'

const photoSchema = z.object({
  albumId: z.number(),
  id: z.number(),
  title: z.string(),
  url: z.string(),
  thumbnailUrl: z.string(),
})

const photoListSchema = z.array(photoSchema)

export type Photo = z.infer<typeof photoSchema>

export async function getPhotoListApi(params: {
  page: number
  pageSize: number
}) {
  const start = (params.page - 1) * params.pageSize
  const limit = params.pageSize

  const { data } = await request.get<Photo[]>(
    `/photos?_start=${start}&_limit=${limit}`,
    {
      responseZod: photoListSchema,
    }
  )

  return data
}

export async function getPhotoApi(id: number) {
  const { data } = await request.get<Photo>(`/photos/${id}`, {
    responseZod: photoSchema,
  })
  return data
}
