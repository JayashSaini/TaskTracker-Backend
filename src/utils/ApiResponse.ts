class ApiResponse {
  constructor(
    public statusCode: number,
    public data: object | null,
    public message: string,
    public success: boolean
  ) {}
}

export default ApiResponse;
