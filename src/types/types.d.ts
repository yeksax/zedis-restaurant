type Schema<T> = import('zod').infer<T>;

type Action<T> = Awaited<ReturnType<T>>;
