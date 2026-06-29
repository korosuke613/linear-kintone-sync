import { Env } from "@humanwhocodes/env";
import { LinearClient } from "@linear/sdk";

export const getLinearClient = () => {
  const env = new Env();
  return new LinearClient({ apiKey: env.require("LINEAR_API_TOKEN") });
};
