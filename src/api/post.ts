import { z } from 'zod'
import { request } from './'

const postSchema = z.object({
  userId: z.number(),
  id: z.number(),
  title: z.string(),
  body: z.string(),
})

const postListSchema = z.array(postSchema)

export type Post = z.infer<typeof postSchema>

export async function getPostListApi(params: {
  page: number
  pageSize: number
}): Promise<Post[]> {
  const start = (params.page - 1) * params.pageSize
  const limit = params.pageSize

  const { data } = await request.get<Post[]>(
    `/posts?_start=${start}&_limit=${limit}`,
    { responseSchema: postListSchema },
  )

  return data
}

export async function getPostApi(id: number): Promise<Post> {
  const { data } = await request.get<Post>(`/posts/${id}`, {
    responseSchema: postSchema,
  })
  return data
}
