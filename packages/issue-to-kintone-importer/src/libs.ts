import { LinearClient } from "@linear/sdk";
import { Env } from "@humanwhocodes/env";

export const getLinearClient = () => {
  const env = new Env();
  return new LinearClient({ apiKey: env.require("LINEAR_API_TOKEN") });
};
