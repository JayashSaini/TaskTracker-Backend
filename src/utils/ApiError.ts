class ApiError {
  constructor(
    public statusCode: number,
    public message: string,
    public success: boolean = false
  ) {}
}

export default ApiError;
