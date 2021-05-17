import axios from 'axios';

import DataFetcher from '@core/domain/common/port/DataFetcherPort';
import {HttpError} from '@core/domain/common/utils/error';
import Request from '@core/domain/request/Request';
import RequestUrlParser from '@core/domain/request/RequestUrlParser';

class AxiosAmlDataFetcherAdapter implements DataFetcher {
  constructor(private readonly bearerToken: string, private readonly baseUrl: string) {
  }

  async fetch(request: Request): Promise<string> {
    const {crypto, address} = RequestUrlParser.resolveAmlCryptoTypeAndAddress(request.url);

    try {
      const {data} = await axios.get(`${this.baseUrl}/${address}?address_type=${crypto}`, {
        headers: {Authorization: `Bearer ${this.bearerToken}`},
      });

      return data;
    } catch (e) {
      throw new HttpError(e.response.statusText, e.response.status);
    }
  }
}

export default AxiosAmlDataFetcherAdapter;
