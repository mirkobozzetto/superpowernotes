export class OpenAIServiceError extends Error {
  constructor(
    message: string,
    public code: string
  ) {
    super(message);
    this.name = "OpenAIServiceError";
  }
}
