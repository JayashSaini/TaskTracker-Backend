class ApiError {
  constructor(
    public statusCode: number,
    public message: string,
    public data: object | null = null,
    public success: boolean = false
  ) {}
}

export default ApiError;
