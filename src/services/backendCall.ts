// services/backendCall.ts
import axios from 'axios';
import {BASE_URL} from './apiConfig';
import {useAuthStore} from '../store/authStore';

export const backendCall = async ({
  url,
  method = 'POST',
  data,
  source,
  isNavigate = true,
  isShowErrorMessage = true,
  contentType = 'application/json',
  dataModel,
  origin,
}: BackendCallProps) => {
  try {
    const token = useAuthStore.getState().token;

    const headers: any = {
      'Content-Type': contentType,
      'Accept': 'application/json',
    };

    if (origin) {
      headers['Origin'] = origin;
    }

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await axios({
      url: `${BASE_URL}${url}`,
      method,
      data,
      headers,
      cancelToken: source?.token,
    });

    let _response = response.data;

    // Data model adapter
    if (dataModel) {
      const dataSet = dataModel.adapt(_response?.data);
      _response.data = dataSet;
    }

    return _response;
  } catch (error: any) {
    const status = error?.response?.status;
    const message = error?.response?.data?.message;

    if (isShowErrorMessage) {
      console.log('API Error:', message);
    }

    // Handle 401 (token expired)
    if (status === 401 && isNavigate) {
      useAuthStore.getState().logout();

      // DO NOT use window.location in React Native
      // navigation should be handled in UI layer
    }

    return error?.response?.data;
  }
};

interface BackendCallProps {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  data?: any;
  source?: any;
  isNavigate?: boolean;
  isShowErrorMessage?: boolean;
  contentType?: string;
  dataModel?: any;
  origin?: string;
}
