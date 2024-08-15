import z from 'zod'
import { request } from './'

const postSchema = z.object({
  userId: z.number(),
  id: z.number(),
  title: z.string(),
  body: z.string(),
})

const postListSchema = z.array(postSchema)

export type Post = z.infer<typeof postSchema>

export async function getPostsApi() {
  const { data } = await request.get<Post[]>('/posts', {
    responseZod: postListSchema,
  })
  return data
}

export async function getPostApi(id: number) {
  const { data } = await request.get<Post>(`/posts/${id}`, {
    responseZod: postSchema,
  })
  return data
}
