import type { NextApiRequest, NextApiResponse } from 'next'

type Moved = {
  Location: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Moved>
) {
  res.redirect(301, '/api/ads/graphql')
}