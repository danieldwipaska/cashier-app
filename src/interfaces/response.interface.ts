export default interface Response<T> {
  statusCode: number;
  message: string;
  error?: string;
  data?: T;
  accessToken?: string;
  refreshToken?: string;
}
