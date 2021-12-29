// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import exp from "constants";
import type { NextApiRequest, NextApiResponse } from "next";
import ResponseFuncs from "../../types/ResponseFuncs";
import { connect } from "../../utils/connection";

type Data = {
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const method: keyof ResponseFuncs = req.method as keyof ResponseFuncs;

  const catcher = (error: Error) => res.status(400).json({ error: error});

  const handleCase: ResponseFuncs = {
    GET: async (req: NextApiRequest, res: NextApiResponse<any>) => {
      const { Todo } = await connect();
      const todos = await Todo.find({});
      res.json(todos);
    },
    POST: async (req: NextApiRequest, res: NextApiResponse<any>) => {
      const { Todo } = await connect();
      const { item } = req.body;
      const todo = new Todo({ item });
      await todo.save();
      res.json(todo);
    }
  };

  const response = handleCase[method];
  if (response) response(req, res)
  else res.status(404).json({ error: "Method not found" });
}
