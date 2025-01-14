import { InvalidContentTypeError, InvalidUrlError } from '../common/utils/error';

class RequestUrlParser {
  static resolveRawUrl(wrappedUrl: string): string {
    const urlRegex = new RegExp(/\(https?:\/\/[^)]+\)/);
    const matched = urlRegex.exec(wrappedUrl);
    if (!matched) {
      throw new InvalidUrlError(`Url not found in ${wrappedUrl}`);
    }
    const firstMatched = matched[0];

    return firstMatched.substring(1, firstMatched.length - 1);
  }

  static resolveNoSelectorQuery(wrappedUrl: string): string {
    const urlRegex = new RegExp(/\(.+\)/);
    const matched = urlRegex.exec(wrappedUrl);
    if (!matched) {
      throw new InvalidUrlError(`Invalid query format ${wrappedUrl}`);
    }
    const firstMatched = matched[0];

    return firstMatched.substring(1, firstMatched.length - 1);
  }

  static resolveContentType(wrappedUrl: string): string {
    const typeRegex = new RegExp(/^(json|xml|html|ipfs|random|aml)\(.+\)/);

    if (typeRegex.test(wrappedUrl)) {
      return typeRegex.exec(wrappedUrl)[1];
    }

    throw new InvalidContentTypeError('Request type has to be one of [json,xml,html,ipfs,random]');
  }

  static resolveSelectionPath(wrappedUrl: string): string {
    const rawUrl = this.resolveNoSelectorQuery(wrappedUrl);
    const pathStartIndex = wrappedUrl.indexOf(rawUrl) + rawUrl.length + 1; // + 1 for bracket char

    return wrappedUrl.substr(pathStartIndex);
  }

  static resolveLeftSideBound(wrappedUrl: string): string {
    const typeRegex = new RegExp(/^random\((-?\d+),(-?\d+)\)/);

    if (typeRegex.test(wrappedUrl)) {
      return typeRegex.exec(wrappedUrl)[1];
    }

    throw new InvalidContentTypeError('Invalid numeric bounds format');
  }

  static resolveRightSideBound(wrappedUrl: string): string {
    const typeRegex = new RegExp(/^random\((-?\d+),(-?\d+)\)/);

    if (typeRegex.test(wrappedUrl)) {
      return typeRegex.exec(wrappedUrl)[2];
    }

    throw new InvalidContentTypeError('Invalid numeric bounds format');
  }

  static resolveAmlCryptoTypeAndAddress(wrappedUrl: string): {crypto: string, address: string} {
    const typeRegex = new RegExp(/^aml\((.+),(.+)\)/);

    if (typeRegex.test(wrappedUrl)) {
      return {crypto: typeRegex.exec(wrappedUrl)[1], address: typeRegex.exec(wrappedUrl)[2]};
    }

    throw new InvalidContentTypeError('Invalid AML query. Expected something like aml(ETH,0xdeadbeef)');
  }
}

export default RequestUrlParser;
