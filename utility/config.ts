import {z} from "zod";

const clientEnvironmentVariables = z.object({
    NEXT_PUBLIC_GRAPHQL_URL: z.string(),
});

declare global {
    namespace NodeJS {
        interface ProcessEnv
            extends z.infer<typeof clientEnvironmentVariables> {
        }
    }
}