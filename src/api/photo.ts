import { z } from 'zod'
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

export async function getPhotoList(params: {
  page: number
  pageSize: number
}): Promise<Photo[]> {
  const start = (params.page - 1) * params.pageSize
  const limit = params.pageSize

  const { data } = await request.get<Photo[]>(
    `/photos?_start=${start}&_limit=${limit}`,
    // TODO: 根据 responseSchema 自动推导 data 类型
    { responseSchema: photoListSchema },
  )

  return data
}

export async function getPhoto(id: number): Promise<Photo> {
  const { data } = await request.get<Photo>(`/photos/${id}`, {
    responseSchema: photoSchema,
  })
  return data
}
