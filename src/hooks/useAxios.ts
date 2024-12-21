import {
  REQUEST_HEADER_AUTH_KEY,
  TOKEN_TYPE
} from '@/utils/constants/api.constant';
import { API_URL, COOKIE_NAME } from '@/utils/constants/app.constant';
import isEmpty from '@/utils/helpers/isEmpty';
import isString from '@/utils/helpers/isString';
import Toast from '@/utils/helpers/Toast';
import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig
} from 'axios';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';

interface ApiResponse<T = any> {
  message: string;
  data?: T;
}

interface RequestOptions {
  method: AxiosRequestConfig['method'];
  data?: any;
  url: string;
  contentType?: string;
  customHeaders?: Record<string, string>;
  responseType?: AxiosRequestConfig['responseType'];
  params?: Record<string, any>;
  baseURL?: string;
  successToast?: boolean;
  errorToast?: boolean;
  customToastMessage?: string;
  customErrorToastMessage?: string;
  customToastMessageType?: 'success' | 'error' | 'warning';
  onUploadProgress?: (progress: number) => void;
  onDownloadProgress?: (progress: number) => void;
  timeout?: number;
  retry?: number;
  cancelable?: boolean;
  onCancel?: () => void;
}

const UseAxios = () => {
  const token = Cookies.get(COOKIE_NAME);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [retryCount, setRetryCount] = useState(0);
  const cancelTokenSource = axios.CancelToken.source();

  useEffect(() => {
    return () => {
      cancelTokenSource.cancel('Request cancelled by the user.');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const createAxiosInstance = (
    customBaseURL?: string,
    customHeaders?: Record<string, string>,
    contentType?: string
  ) => {
    return axios.create({
      baseURL: customBaseURL || API_URL,
      headers: {
        'Content-Type': isEmpty(contentType) ? 'application/json' : contentType,
        ...customHeaders
      }
    });
  };

  const makeRequest = async <T = object>({
    method,
    data,
    url,
    contentType,
    customHeaders,
    responseType,
    params,
    baseURL,
    successToast = false,
    errorToast = false,
    customToastMessage,
    customErrorToastMessage,
    customToastMessageType = 'success',
    onUploadProgress,
    onDownloadProgress,
    timeout = 100000,
    retry = 0,
    cancelable = false,
    onCancel
  }: RequestOptions): Promise<AxiosResponse<ApiResponse<T>>> => {
    setIsLoading(true);
    const AxiosDefault = createAxiosInstance(
      baseURL,
      customHeaders,
      contentType
    );

    AxiosDefault.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        if (isString(token) && !isEmpty(token)) {
          if (config.headers) {
            config.headers[REQUEST_HEADER_AUTH_KEY] = `${TOKEN_TYPE}${token}`;
          }
        }
        config.timeout = timeout;
        if (cancelable) {
          config.cancelToken = cancelTokenSource.token;
        }
        return config;
      },
      (error: AxiosError) => Promise.reject(error)
    );

    AxiosDefault.interceptors.response.use(
      (response: AxiosResponse<ApiResponse<T>>) => {
        setIsLoading(false);
        setUploadProgress(0);
        setDownloadProgress(0);

        if (successToast) {
          if (customToastMessage) {
            Toast(customToastMessage, customToastMessageType);
          } else if (response.data.message) {
            Toast(response.data.message, 'success');
          }
        }
        return response;
      },
      async (error: AxiosError<ApiResponse<T>>) => {
        setIsLoading(false);
        setUploadProgress(0);
        setDownloadProgress(0);

        if (error.response?.status === 401) {
          try {
            Cookies.remove(COOKIE_NAME);
          } catch (e) {
            return Promise.reject(e);
          }
        }

        if (retryCount < retry) {
          setRetryCount(retryCount + 1);
          return makeRequest({
            method,
            data,
            url,
            contentType,
            customHeaders,
            responseType,
            params,
            successToast,
            errorToast,
            customToastMessage,
            customErrorToastMessage,
            customToastMessageType,
            onUploadProgress,
            onDownloadProgress,
            timeout,
            retry,
            cancelable,
            onCancel
          });
        }

        if (axios.isCancel(error)) {
          if (onCancel) onCancel();
          return Promise.reject({ canceled: true });
        }

        if (errorToast) {
          const axiosError = error as AxiosError<ApiResponse<T>>;
          const errorMessage =
            customErrorToastMessage ||
            axiosError.response?.data?.message ||
            'An error occurred';
          Toast(errorMessage, 'error');
        }
        return Promise.reject(
          (error as AxiosError<ApiResponse<T>>)?.response?.data ||
            (error as AxiosError<ApiResponse<T>>)
        );
      }
    );

    try {
      const response = await AxiosDefault({
        method,
        data,
        url,
        params,
        responseType: responseType || 'json',
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 1) // Prevent division by zero
          );
          setUploadProgress(percentCompleted);
          if (onUploadProgress) {
            onUploadProgress(percentCompleted);
          }
        },
        onDownloadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 1) // Prevent division by zero
          );
          setDownloadProgress(percentCompleted);
          if (onDownloadProgress) {
            onDownloadProgress(percentCompleted);
          }
        }
      });
      return response;
    } catch (error) {
      setIsLoading(false);
      setUploadProgress(0);
      setDownloadProgress(0);
      const axiosError = error as AxiosError<ApiResponse<T>>;
      return Promise.reject(axiosError.response?.data || axiosError);
    }
  };

  return { makeRequest, isLoading, uploadProgress, downloadProgress };
};

export default UseAxios;
