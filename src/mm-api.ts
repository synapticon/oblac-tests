/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface ConnectResponseSuccess {
  /**
   * @format uri
   * @example "ws://127.0.0.1:63524?clientId=f8544f85-3fe5-463d-8f09-ac93e7903a3c"
   */
  reqResUrl?: string;
  /**
   * @format uri
   * @example "ws://127.0.0.1:63525?clientId=6432345f-8f4b-4cdc-854b-451d3b171076"
   */
  pubSubUrl?: string;
}

export interface ErrorObject {
  message: string;
  code?: number;
}

export interface SystemVersion {
  /** @example "v5.0.0" */
  version?: string;
}

export interface HardwareDescription {
  fileVersion?: string;
  device?: {
    macAddress?: string;
    serialNumber?: string;
    name?: string;
    id?: string;
    version?: string;
    components?: HardwareDescriptionComponent[];
  };
}

export interface HardwareDescriptionComponent {
  name?: string;
  serialNumber?: string;
  version?: string;
}

export interface Device {
  deviceAddress?: number;
  type?: number;
  position?: number;
  alias?: number;
  id?: string;
  hardwareDescription?: HardwareDescription;
}

export type Devices = Device[];

export interface ParameterInfoItem {
  /** @example 8195 */
  index?: number;
  /** @example 1 */
  subindex?: number;
  /** @example "Pole pairs" */
  name?: string;
  /** @example "" */
  unit?: string;
  /** @example "Motor specific settings" */
  group?: string;
  /** @example true */
  readAccess?: boolean;
  /** @example true */
  writeAccess?: boolean;
  /** @example -2147483648 */
  min?: number;
  /** @example 2147483647 */
  max?: number;
  /** @example 5 */
  valueType?: number;
}

export interface ParameterValue {
  value?: string | number | number[];
}

export interface DeviceParameter {
  /**
   * The unique identifier for the device parameter.
   * @example "0x1000:00.8612-02-0001553-2341"
   */
  id?: string;
  /**
   * The index of the device parameter.
   * @example 4096
   */
  index?: number;
  /**
   * The subindex of the device parameter.
   * @example 0
   */
  subindex?: number;
  /**
   * The unsigned integer value of the parameter.
   * @example 655762
   */
  uintValue?: number;
  /**
   * The signed integer value of the parameter.
   * @example -10
   */
  intValue?: number;
  /**
   * The float value of the parameter.
   * @format float
   * @example 3.14
   */
  floatValue?: number;
  /**
   * Raw byte values for the parameter.
   * @example []
   */
  rawValue?: number[];
  /**
   * The string representation of the parameter.
   * @example "Sample String"
   */
  stringValue?: string;
  /**
   * The type of value represented by the parameter.
   * @example "uintValue"
   */
  typeValue?: string;
  success?: {
    /**
     * The success code indicating the status of the operation.
     * @example 1
     */
    code?: number;
    /**
     * A message associated with the success code.
     * @example ""
     */
    message?: string;
  };
  /**
   * The status of the parameter retrieval operation.
   * @example "success"
   */
  status?: string;
  /**
   * The name of the device parameter.
   * @example "Device type"
   */
  name?: string;
  /**
   * The unit of measurement for the parameter, if applicable.
   * @example ""
   */
  unit?: string;
  /**
   * The group the parameter belongs to.
   * @example ""
   */
  group?: string;
  /**
   * Indicates whether the parameter can be read.
   * @example true
   */
  readAccess?: boolean;
  /**
   * Indicates whether the parameter can be written.
   * @example false
   */
  writeAccess?: boolean;
  /**
   * The minimum allowable value for the parameter.
   * @example -2147483648
   */
  min?: number;
  /**
   * The maximum allowable value for the parameter.
   * @example 2147483647
   */
  max?: number;
  /**
   * The type of the parameter value, represented by an integer.
   * @example 7
   */
  valueType?: number;
  /** The current value of the parameter. Defaults to 0 for numerical types, empty array for raw values, or empty string for string values based on type. */
  value?: number | string | number[];
}

export interface IParameter {
  /**
   * The index of the device parameter.
   * @example 4096
   */
  index?: number;
  /**
   * The subindex of the device parameter.
   * @example 0
   */
  subindex?: number;
  /**
   * Indicates whether to load the parameter from cache.
   * @example false
   */
  loadFromCache?: boolean;
}

/** The value of a device parameter, containing either success or error properties. */
export interface IParameterValue {
  /**
   * The index of the device parameter.
   * @example 4096
   */
  index?: number;
  /**
   * The subindex of the device parameter.
   * @example 0
   */
  subindex?: number;
  /**
   * The signed integer value of the parameter.
   * @example -10
   */
  intValue?: number;
  /**
   * The unsigned integer value of the parameter.
   * @example 655762
   */
  uintValue?: number;
  /**
   * The float value of the parameter.
   * @format float
   * @example 3.14
   */
  floatValue?: number;
  /**
   * The string representation of the parameter.
   * @example "Sample String"
   */
  stringValue?: string;
  /**
   * Raw byte values for the parameter.
   * @example []
   */
  rawValue?: number[];
  /**
   * The type of value represented by the parameter.
   * @example "uintValue"
   */
  typeValue?: string;
  success?: {
    /**
     * The success code indicating the status of the operation.
     * @example 1
     */
    code?: number;
    /**
     * A message associated with the success code.
     * @example ""
     */
    message?: string;
  };
  error?: {
    /**
     * The error code indicating the type of error.
     * @example 2
     */
    code?: number;
    /**
     * A message describing the error.
     * @example "An error occurred."
     */
    message?: string;
  };
}

export interface IGetDeviceParameterValues {
  /**
   * The device address of the device.
   * @example 2692012680
   */
  deviceAddress?: number;
  parameters?: {
    /**
     * The index of the device parameter.
     * @example 4096
     */
    index?: number;
    /**
     * The subindex of the device parameter.
     * @example 0
     */
    subindex?: number;
    /**
     * Indicates whether to load the parameter from cache.
     * @example false
     */
    loadFromCache?: boolean;
  }[];
}

export interface IDeviceParameterValues {
  /**
   * The address of the device.
   * @example 2692012680
   */
  deviceAddress?: number;
  parameterValues?: IParameterValue[];
}

export interface OsCommandResponse {
  /** @example [0,1,0,0,0,0,0,0] */
  command?: number[];
  /** @example [1,0,0,0,0,0,0,0] */
  data?: number[];
  /**
   * @format int32
   * @example 253
   */
  errorCode?: number;
  /** @example "Command timeout" */
  errorName?: string;
  errorDescription?: string;
  /**
   * A sequence of integers where each number represents a byte in the file system buffer.
   * @example [116,101,115,116]
   */
  fsBuffer?: number[];
  /** @format int32 */
  progress?: number;
  /** @example "failed" */
  request?: string;
  /** @example [3,0,253,0,0,0,0,0] */
  response?: number[];
  [key: string]: any;
}

/** Represents a single step in the Offset Detection procedure. */
export interface OffsetDetectionStep {
  /** @example "Open Phase Detection" */
  label?: string;
  /**
   * The status of the step result, which can be: 'idle', 'running', 'succeeded' or 'failed'.
   * @example "succeeded"
   */
  status?: string;
  /**
   * The value of the step result when the status is 'succeeded'.
   * @example 0
   */
  value?: number;
  /**
   * The error message when the status is 'failed'.
   * @example ""
   */
  error?: string;
}

export type OffsetDetectionResponse = OffsetDetectionStep[];

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;

export interface FullRequestParams extends Omit<RequestInit, "body"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">;
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown>
  extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = "http://{hostname}:{port}/api";
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) =>
    fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: "same-origin",
    headers: {},
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === "number" ? value : `${value}`)}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join("&");
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter(
      (key) => "undefined" !== typeof query[key],
    );
    return keys
      .map((key) =>
        Array.isArray(query[key])
          ? this.addArrayQueryParam(query, key)
          : this.addQueryParam(query, key),
      )
      .join("&");
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : "";
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string")
        ? JSON.stringify(input)
        : input,
    [ContentType.JsonApi]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string")
        ? JSON.stringify(input)
        : input,
    [ContentType.Text]: (input: any) =>
      input !== null && typeof input !== "string"
        ? JSON.stringify(input)
        : input,
    [ContentType.FormData]: (input: any) => {
      if (input instanceof FormData) {
        return input;
      }

      return Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === "object" && property !== null
              ? JSON.stringify(property)
              : `${property}`,
        );
        return formData;
      }, new FormData());
    },
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(
    params1: RequestParams,
    params2?: RequestParams,
  ): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected createAbortSignal = (
    cancelToken: CancelToken,
  ): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(
      `${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`,
      {
        ...requestParams,
        headers: {
          ...(requestParams.headers || {}),
          ...(type && type !== ContentType.FormData
            ? { "Content-Type": type }
            : {}),
        },
        signal:
          (cancelToken
            ? this.createAbortSignal(cancelToken)
            : requestParams.signal) || null,
        body:
          typeof body === "undefined" || body === null
            ? null
            : payloadFormatter(body),
      },
    ).then(async (response) => {
      const r = response as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const responseToParse = responseFormat ? response.clone() : response;
      const data = !responseFormat
        ? r
        : await responseToParse[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch((e) => {
              r.error = e;
              return r;
            });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data;
    });
  };
}

/**
 * @title Motion Master API
 * @version 0.0.382
 * @license MIT (https://opensource.org/licenses/MIT)
 * @baseUrl http://{hostname}:{port}/api
 * @contact <msankovic@synapticon.com>
 *
 * The Motion Master API is an HTTP interface for interacting with a running Motion Master process. It supports retrieving device lists, managing parameters, accessing files, executing profiles, performing auto-tuning, encoder calibration, and more. It is built on top of the [Motion Master Client](https://synapticon.github.io/oblac/motion-master-client/) library.
 *
 * ## Starting the API
 *
 * ### OBLAC Drives native app
 *
 * When the OBLAC Drives native app starts, it automatically launches Motion Master API and binds it to port 63526. Start Motion Master from the UI and configure it with the correct network interface before sending requests.
 *
 * ### Docker Compose
 *
 * The provided [`docker-compose.yml`](docker-compose.yml) starts both Motion Master and Motion Master API together. Motion Master initializes on the network interface identified by the `MM_MAC` environment variable. Both services use host network mode, so the API is accessible directly on port 63526 with no port mapping needed.
 *
 * Set `MM_MAC` to the MAC address of the EtherCAT network interface and start the services:
 *
 * ```terminal
 * MM_MAC=20:88:10:7C:62:6D docker compose up
 * ```
 *
 * Additional environment variables can be passed to override defaults:
 *
 * | Variable | Default | Description |
 * |---|---|---|
 * | `MM_DRV` | `soem` | EtherCAT driver (`soem` or `spoe`) |
 * | `MM_MAC` | — | MAC address of the EtherCAT network interface |
 * | `MM_REQ_RES_PORT` | `63524` | Motion Master request/response port |
 * | `MM_PUB_SUB_PORT` | `63525` | Motion Master publish/subscribe port |
 * | `MM_IPS` | — | Comma-separated list of device IP addresses (optional) |
 * | `MM_PDO_MODE` | `monitor` | PDO mode (`monitor` or `control`) |
 *
 * Since Motion Master runs on the same host, connect without specifying a remote address:
 *
 * ```terminal
 * curl http://localhost:63526/api/connect
 * ```
 *
 * ### Docker container (API only)
 *
 * Use this option when Motion Master is running on a separate host. The container runs in bridge network mode and the API is published on port 8080:
 *
 * ```terminal
 * docker run -d --name motion-master-api --publish=8080:63526 synapticon/motion-master-api:v0.0.382
 * ```
 *
 * Specify the Motion Master host IP when connecting:
 *
 * ```terminal
 * curl http://localhost:8080/api/connect/192.168.211.223
 * ```
 *
 * ## Usage
 *
 * All examples use cURL. The default API port is 63526.
 *
 * Connect to Motion Master on localhost:
 *
 * ```terminal
 * curl http://localhost:63526/api/connect
 * ```
 *
 * Or connect to a remote host (also required when Motion Master API runs in Docker bridge network mode, since it cannot reach the host's localhost directly):
 *
 * ```terminal
 * curl http://localhost:63526/api/connect/192.168.200.253
 * ```
 *
 * List connected devices:
 *
 * ```terminal
 * curl http://localhost:63526/api/devices
 * ```
 *
 * Read a parameter from the first device:
 *
 * ```terminal
 * curl http://localhost:63526/api/devices/1/upload/0x2030/1
 * ```
 *
 * Disconnect:
 *
 * ```terminal
 * curl http://localhost:63526/api/disconnect
 * ```
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  connect = {
    /**
     * @description This API call creates a MotionMasterClient instance and establishes WebSocket connections with the Motion Master process on the localhost. Successful execution of this call is necessary before making further requests to Motion Master.
     *
     * @tags system
     * @name Connect
     * @summary Connects to a Motion Master process running on the localhost.
     * @request GET:/connect
     */
    connect: (
      query?: {
        /**
         * The duration (in milliseconds) the client will wait for a response(s) to the previous request before raising a timeout error.
         * @default 10000
         * @example 10000
         */
        "request-timeout"?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<ConnectResponseSuccess, ErrorObject>({
        path: `/connect`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * @description This API call creates a MotionMasterClient instance and establishes WebSocket connections with the Motion Master process on the specified hostname. Successful execution of this call is necessary before making further requests to Motion Master.
     *
     * @tags system
     * @name ConnectWithHostname
     * @summary Connects to a Motion Master process running on the specified hostname.
     * @request GET:/connect/{hostname}
     */
    connectWithHostname: (
      hostname: string,
      query?: {
        /**
         * The duration (in milliseconds) the client will wait for a response(s) to the previous request before raising a timeout error.
         * @default 10000
         * @example 10000
         */
        "request-timeout"?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<ConnectResponseSuccess, ErrorObject>({
        path: `/connect/${hostname}`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * @description This API call creates a MotionMasterClient instance using a full `MotionMasterConnectionConfig` supplied as query string parameters. Use this endpoint when you need to control ports, timeouts, or other low-level connection settings that are not exposed by `/connect` or `/connect/{hostname}`. Successful execution of this call is necessary before making further requests to Motion Master.
     *
     * @tags system
     * @name ConnectWithConfig
     * @summary Connects to a Motion Master process using the full connection configuration.
     * @request GET:/connect/config
     */
    connectWithConfig: (
      query?: {
        /**
         * The IP address or domain name of the machine running the Motion Master process.
         * @default "127.0.0.1"
         * @example "192.168.1.200"
         */
        hostname?: string;
        /**
         * Port number for the Request/Response WebSocket connection.
         * @default 63524
         * @example 63524
         */
        "req-res-port"?: number;
        /**
         * Port number for the Publish/Subscribe WebSocket connection.
         * @default 63525
         * @example 63525
         */
        "pub-sub-port"?: number;
        /**
         * Time interval (in milliseconds) for sending Ping messages from the client to Motion Master.
         * @default 250
         * @example 250
         */
        "ping-system-interval"?: number;
        /**
         * Duration (in milliseconds) the client will wait for a response from Motion Master before considering it unresponsive. Should be a multiple of `ping-system-interval`.
         * @default 1000
         * @example 1000
         */
        "system-alive-timeout"?: number;
        /**
         * Duration (in milliseconds) Motion Master will wait for a response from the client before marking it as unresponsive. Configured on the Motion Master side via a protocol message.
         * @example 5000
         */
        "client-alive-timeout"?: number;
        /**
         * When `true`, the client connects using WebSocket Secure (`wss://`) instead of `ws://`. Note: currently only `ws://` is supported.
         * @default false
         */
        secure?: boolean;
        /**
         * The duration (in milliseconds) the client will wait for a response(s) to the previous request before raising a timeout error.
         * @default 10000
         * @example 10000
         */
        "request-timeout"?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<ConnectResponseSuccess, ErrorObject>({
        path: `/connect/config`,
        method: "GET",
        query: query,
        ...params,
      }),
  };
  disconnect = {
    /**
     * No description
     *
     * @tags system
     * @name Disconnect
     * @summary Closes the open WebSocket connections with the Motion Master process and destroys the client object.
     * @request GET:/disconnect
     */
    disconnect: (params: RequestParams = {}) =>
      this.request<void, ErrorObject>({
        path: `/disconnect`,
        method: "GET",
        ...params,
      }),
  };
  version = {
    /**
     * No description
     *
     * @tags system
     * @name GetVersion
     * @summary Retrieve the current version of the Motion Master Client library from package.json file.
     * @request GET:/version
     */
    getVersion: (params: RequestParams = {}) =>
      this.request<
        {
          /** @example "0.0.176" */
          version?: string;
        },
        ErrorObject
      >({
        path: `/version`,
        method: "GET",
        format: "json",
        ...params,
      }),
  };
  systemVersion = {
    /**
     * No description
     *
     * @tags system
     * @name GetSystemVersion
     * @summary Retrieve the version of the connected Motion Master.
     * @request GET:/system-version
     */
    getSystemVersion: (
      query?: {
        /**
         * The duration (in milliseconds) the client will wait for a response(s) to the previous request before raising a timeout error.
         * @default 5000
         * @example 5000
         */
        "request-timeout"?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<SystemVersion, ErrorObject>({
        path: `/system-version`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
  };
  systemLog = {
    /**
     * No description
     *
     * @tags system
     * @name GetSystemLog
     * @summary Retrieve the system log.
     * @request GET:/system-log
     */
    getSystemLog: (
      query?: {
        /**
         * The duration (in milliseconds) the client will wait for a response(s) to the previous request before raising a timeout error.
         * @default 5000
         * @example 5000
         */
        "request-timeout"?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /** @example "2024-10-04 10:54:57.633 (   0.001s)        motion_master.cc:166   INFO| Log level has been set to: 0" */
          content?: string;
          /** @example "########## OS RELEASE ##########\nWindows Professional 6.2 (0x30)" */
          runEnv?: string;
        },
        ErrorObject
      >({
        path: `/system-log`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
  };
  setSystemClientTimeout = {
    /**
     * No description
     *
     * @tags system
     * @name SetSystemClientTimeout
     * @summary Sets the system client timeout.
     * @request GET:/set-system-client-timeout/{timeout}
     */
    setSystemClientTimeout: (timeout: number, params: RequestParams = {}) =>
      this.request<void, ErrorObject>({
        path: `/set-system-client-timeout/${timeout}`,
        method: "GET",
        ...params,
      }),
  };
  devices = {
    /**
     * No description
     *
     * @tags system
     * @name GetDevices
     * @summary Retrieve a list of devices, each with its hardware description and optionally integro variant.
     * @request GET:/devices
     */
    getDevices: (
      query?: {
        /**
         * The duration (in milliseconds) the client will wait for a response(s) to the previous request before raising a timeout error.
         * @default 10000
         * @example 10000
         */
        "request-timeout"?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<any[], ErrorObject>({
        path: `/devices`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags device
     * @name GetDeviceParameterInfo
     * @summary Retrieve a list of parameters available on a device, excluding their values and metadata.
     * @request GET:/devices/{deviceRef}/parameter-info
     */
    getDeviceParameterInfo: (
      deviceRef: string,
      query?: {
        /**
         * The duration (in milliseconds) the client will wait for a response(s) to the previous request before raising a timeout error.
         * @default 5000
         * @example 5000
         */
        "request-timeout"?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<ParameterInfoItem[], ErrorObject>({
        path: `/devices/${deviceRef}/parameter-info`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags device
     * @name GetDeviceFileList
     * @summary Retrieve a list of files from the device flash memory.
     * @request GET:/devices/{deviceRef}/files
     */
    getDeviceFileList: (
      deviceRef: string,
      query?: {
        /**
         * The duration (in milliseconds) the client will wait for a response(s) to the previous request before raising a timeout error.
         * @default 30000
         * @example 30000
         */
        "request-timeout"?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<string[], ErrorObject>({
        path: `/devices/${deviceRef}/files`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags device
     * @name UnlockProtectedFiles
     * @summary Unlocks protected files to enable writing or deletion.
     * @request GET:/devices/{deviceRef}/files/unlock
     */
    unlockProtectedFiles: (
      deviceRef: string,
      query?: {
        /**
         * The duration (in milliseconds) the client will wait for a response(s) to the previous request before raising a timeout error.
         * @default 5000
         * @example 5000
         */
        "request-timeout"?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, ErrorObject>({
        path: `/devices/${deviceRef}/files/unlock`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * @description Retrieves the content of a specified file from the device. The API automatically detects whether the file is a text or binary file based on its content. If the file is a text file, it returns the content as a UTF-8 encoded string. If the file is a binary file, it returns the content as binary data. **Note**: Ensure that the specified filename exists on the device before making this request.
     *
     * @tags device
     * @name GetDeviceFile
     * @summary Retrieve a file's content (automatically detects Text vs Binary).
     * @request GET:/devices/{deviceRef}/files/{filename}
     */
    getDeviceFile: (
      deviceRef: string,
      filename: string,
      query?: {
        /**
         * The duration (in milliseconds) the client will wait for a response(s) to the previous request before raising a timeout error.
         * @default 30000
         * @example 30000
         */
        "request-timeout"?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        File,
        | ErrorObject
        | {
            /** @example "File param_dump.txt not found on device 1." */
            message?: string;
          }
      >({
        path: `/devices/${deviceRef}/files/${filename}`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags device
     * @name SetDeviceFile
     * @summary Write the file content to the specified filename on the device.
     * @request PUT:/devices/{deviceRef}/files/{filename}
     */
    setDeviceFile: (
      deviceRef: string,
      filename: string,
      data: File,
      query?: {
        /**
         * The duration (in milliseconds) the client will wait for a response(s) to the previous request before raising a timeout error.
         * @default 30000
         * @example 30000
         */
        "request-timeout"?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, ErrorObject>({
        path: `/devices/${deviceRef}/files/${filename}`,
        method: "PUT",
        query: query,
        body: data,
        ...params,
      }),

    /**
     * No description
     *
     * @tags device
     * @name DeleteDeviceFile
     * @summary Deletes a file from the device using the specified filename.
     * @request DELETE:/devices/{deviceRef}/files/{filename}
     */
    deleteDeviceFile: (
      deviceRef: string,
      filename: string,
      query?: {
        /**
         * The duration (in milliseconds) the client will wait for a response(s) to the previous request before raising a timeout error.
         * @default 3000
         * @example 3000
         */
        "request-timeout"?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, ErrorObject>({
        path: `/devices/${deviceRef}/files/${filename}`,
        method: "DELETE",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags device
     * @name QuickStop
     * @summary Requests a Quick Stop from the device.
     * @request GET:/devices/{deviceRef}/quick-stop
     */
    quickStop: (deviceRef: string, params: RequestParams = {}) =>
      this.request<void, ErrorObject>({
        path: `/devices/${deviceRef}/quick-stop`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags device
     * @name ResetFault
     * @summary Requests a Reset Fault from the device.
     * @request GET:/devices/{deviceRef}/reset-fault
     */
    resetFault: (
      deviceRef: string,
      query?: {
        /**
         * Indicates whether to force the fault reset even if the device is not in the FAULT CiA402 state.
         * @default false
         * @example true
         */
        force?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, ErrorObject>({
        path: `/devices/${deviceRef}/reset-fault`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags device
     * @name StartFirmwareInstallation
     * @summary Installs the firmware package on the device.
     * @request POST:/devices/{deviceRef}/start-firmware-installation
     */
    startFirmwareInstallation: (
      deviceRef: string,
      data: File,
      query?: {
        /** @example true */
        "skip-sii-installation"?: boolean;
        /**
         * List of files from the firmware package to skip during installation.
         * @example ["SOMANET_CiA_402.xml.zip","stack_image.svg.zip"]
         */
        "skip-files"?: string[];
        /**
         * The duration (in milliseconds) the client will wait for a response(s) to the previous request before raising a timeout error.
         * @default 180000
         * @example 180000
         */
        "request-timeout"?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, ErrorObject>({
        path: `/devices/${deviceRef}/start-firmware-installation`,
        method: "POST",
        query: query,
        body: data,
        ...params,
      }),

    /**
     * No description
     *
     * @tags device
     * @name GetDeviceLog
     * @summary Retrieve the device log.
     * @request GET:/devices/{deviceRef}/log
     */
    getDeviceLog: (
      deviceRef: string,
      query?: {
        /**
         * The duration (in milliseconds) the client will wait for a response(s) to the previous request before raising a timeout error.
         * @default 10000
         * @example 10000
         */
        "request-timeout"?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, ErrorObject>({
        path: `/devices/${deviceRef}/log`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags device
     * @name UploadParameter
     * @summary Reads a single parameter value from the specified device and sends it to the client.
     * @request GET:/devices/{deviceRef}/upload/{index}/{subindex}
     */
    uploadParameter: (
      deviceRef: string,
      index: string,
      subindex: string,
      query?: {
        /**
         * @default false
         * @example false
         */
        "load-from-cache"?: boolean;
        /**
         * The duration (in milliseconds) the client will wait for a response(s) to the previous request before raising a timeout error.
         * @default 1000
         * @example 1000
         */
        "request-timeout"?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<ParameterValue, ErrorObject>({
        path: `/devices/${deviceRef}/upload/${index}/${subindex}`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags device
     * @name GetDeviceParameterValues
     * @summary Retrieve parameter values for a specified device.
     * @request POST:/devices/{deviceRef}/get-parameter-values
     */
    getDeviceParameterValues: (
      deviceRef: string,
      data: IParameter[],
      query?: {
        /**
         * The duration (in milliseconds) the client will wait for a response(s) to the previous request before raising a timeout error.
         * @default 9000
         * @example 9000
         */
        "request-timeout"?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          parameterValues?: IParameterValue[];
        },
        void
      >({
        path: `/devices/${deviceRef}/get-parameter-values`,
        method: "POST",
        query: query,
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags device
     * @name GetMultiDeviceParameterValues
     * @summary Retrieve parameter values for multiple devices.
     * @request POST:/devices/get-multi-device-parameter-values
     */
    getMultiDeviceParameterValues: (
      data: IGetDeviceParameterValues[],
      query?: {
        /**
         * @default false
         * @example false
         */
        "load-from-cache"?: boolean;
        /**
         * The duration (in milliseconds) the client will wait for a response(s) to the previous request before raising a timeout error.
         * @default 9000
         * @example 9000
         */
        "request-timeout"?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          collection?: IDeviceParameterValues[];
        },
        ErrorObject
      >({
        path: `/devices/get-multi-device-parameter-values`,
        method: "POST",
        query: query,
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags device
     * @name GetDeviceParameters
     * @summary Retrieve all parameter info and values for the specified device.
     * @request GET:/devices/{deviceRef}/parameters
     */
    getDeviceParameters: (
      deviceRef: string,
      query?: {
        /**
         * @default false
         * @example false
         */
        "load-from-cache"?: boolean;
        /**
         * The duration (in milliseconds) the client will wait for a response(s) to the previous request before raising a timeout error.
         * @default 10000
         * @example 10000
         */
        "request-timeout"?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          parameters?: DeviceParameter[];
        },
        ErrorObject
      >({
        path: `/devices/${deviceRef}/parameters`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags device
     * @name DownloadParameter
     * @summary Writes a single parameter value to the specified device.
     * @request GET:/devices/{deviceRef}/download/{index}/{subindex}/{value}
     */
    downloadParameter: (
      deviceRef: string,
      index: string,
      subindex: string,
      value: string | number | number[],
      query?: {
        /**
         * The duration (in milliseconds) the client will wait for a response(s) to the previous request before raising a timeout error.
         * @default 1000
         * @example 1000
         */
        "request-timeout"?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, ErrorObject>({
        path: `/devices/${deviceRef}/download/${index}/${subindex}/${value}`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags device
     * @name DownloadBinaryParameter
     * @summary Writes a single binary parameter value to the specified device.
     * @request PUT:/devices/{deviceRef}/download/{index}/{subindex}
     */
    downloadBinaryParameter: (
      deviceRef: string,
      index: string,
      subindex: string,
      data: File,
      query?: {
        /**
         * The duration (in milliseconds) the client will wait for a response(s) to the previous request before raising a timeout error.
         * @default 5000
         * @example 5000
         */
        "request-timeout"?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, ErrorObject>({
        path: `/devices/${deviceRef}/download/${index}/${subindex}`,
        method: "PUT",
        query: query,
        body: data,
        ...params,
      }),

    /**
     * No description
     *
     * @tags device
     * @name SetDeviceParameterValues
     * @summary Sets parameter values for the specified device.
     * @request POST:/devices/{deviceRef}/set-parameter-values
     */
    setDeviceParameterValues: (
      deviceRef: string,
      data: IParameterValue[],
      query?: {
        /**
         * The duration (in milliseconds) the client will wait for a response(s) to the previous request before raising a timeout error.
         * @default 3000
         * @example 3000
         */
        "request-timeout"?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          parameterValues?: IParameterValue[];
        },
        ErrorObject
      >({
        path: `/devices/${deviceRef}/set-parameter-values`,
        method: "POST",
        query: query,
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags device
     * @name SetMultiDeviceParameterValues
     * @summary Sets parameter values for multiple devices.
     * @request POST:/devices/set-multi-device-parameter-values
     */
    setMultiDeviceParameterValues: (
      data: IDeviceParameterValues[],
      query?: {
        /**
         * The duration (in milliseconds) the client will wait for a response(s) to the previous request before raising a timeout error.
         * @default 3000
         * @example 3000
         */
        "request-timeout"?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          collection?: IDeviceParameterValues[];
        },
        ErrorObject
      >({
        path: `/devices/set-multi-device-parameter-values`,
        method: "POST",
        query: query,
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags device
     * @name StartCoggingTorqueRecording
     * @summary Starts the Cogging Torque Recording procedure.
     * @request GET:/devices/{deviceRef}/start-cogging-torque-recording
     */
    startCoggingTorqueRecording: (
      deviceRef: string,
      query?: {
        /**
         * @default false
         * @example true
         */
        "skip-auto-tuning"?: boolean;
        /**
         * The duration (in milliseconds) the client will wait for a response(s) to the previous request before raising a timeout error.
         * @default 180000
         * @example 180000
         */
        "request-timeout"?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<number[], ErrorObject>({
        path: `/devices/${deviceRef}/start-cogging-torque-recording`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags device
     * @name GetCoggingTorqueData
     * @summary Retrieve the parsed content of the `cogging_torque.bin` file.
     * @request GET:/devices/{deviceRef}/cogging-torque-data
     */
    getCoggingTorqueData: (
      deviceRef: string,
      query?: {
        /**
         * The duration (in milliseconds) the client will wait for a response(s) to the previous request before raising a timeout error.
         * @default 10000
         * @example 10000
         */
        "request-timeout"?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<number[], ErrorObject>({
        path: `/devices/${deviceRef}/cogging-torque-data`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags device
     * @name StartOffsetDetection
     * @summary Starts the Offset Detection procedure.
     * @request GET:/devices/{deviceRef}/start-offset-detection
     */
    startOffsetDetection: (
      deviceRef: string,
      query?: {
        /**
         * The duration (in milliseconds) the client will wait for a response(s) to the previous request before raising a timeout error.
         * @default 120000
         * @example 120000
         */
        "request-timeout"?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          commutationAngleOffset?: number;
        },
        ErrorObject
      >({
        path: `/devices/${deviceRef}/start-offset-detection`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags device
     * @name SetMotionControllerParameters
     * @summary Sets the motion controller parameters.
     * @request GET:/devices/{deviceRef}/set-motion-controller-parameters
     */
    setMotionControllerParameters: (
      deviceRef: string,
      query?: {
        /** @example 1 */
        target?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, ErrorObject>({
        path: `/devices/${deviceRef}/set-motion-controller-parameters`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags device
     * @name EnableMotionController
     * @summary Enables the motion controller.
     * @request GET:/devices/{deviceRef}/enable-motion-controller/{controllerType}
     */
    enableMotionController: (
      deviceRef: string,
      controllerType: string,
      query?: {
        /** @example false */
        filter?: boolean;
        /**
         * The duration (in milliseconds) the client will wait for a response(s) to the previous request before raising a timeout error.
         * @default 3000
         * @example 3000
         */
        "request-timeout"?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, ErrorObject>({
        path: `/devices/${deviceRef}/enable-motion-controller/${controllerType}`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags device
     * @name DisableMotionController
     * @summary Disables the motion controller.
     * @request GET:/devices/{deviceRef}/disable-motion-controller
     */
    disableMotionController: (
      deviceRef: string,
      query?: {
        /**
         * The duration (in milliseconds) the client will wait for a response(s) to the previous request before raising a timeout error.
         * @default 3000
         * @example 3000
         */
        "request-timeout"?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, ErrorObject>({
        path: `/devices/${deviceRef}/disable-motion-controller`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags device
     * @name GetEthercatNetworkState
     * @summary Retrieve the current EtherCAT network state.
     * @request GET:/devices/{deviceRef}/get-ethercat-network-state
     */
    getEthercatNetworkState: (
      deviceRef: string,
      query?: {
        /**
         * The duration (in milliseconds) the client will wait for a response(s) to the previous request before raising a timeout error.
         * @default 3000
         * @example 3000
         */
        "request-timeout"?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          state?: string;
        },
        ErrorObject
      >({
        path: `/devices/${deviceRef}/get-ethercat-network-state`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags device
     * @name SetEthercatNetworkState
     * @summary Sets the EtherCAT network state.
     * @request GET:/devices/{deviceRef}/set-ethercat-network-state/{state}
     */
    setEthercatNetworkState: (
      deviceRef: string,
      state: string,
      query?: {
        /**
         * The duration (in milliseconds) the client will wait for a response(s) to the previous request before raising a timeout error.
         * @default 3000
         * @example 3000
         */
        "request-timeout"?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, ErrorObject>({
        path: `/devices/${deviceRef}/set-ethercat-network-state/${state}`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags device
     * @name StartSystemIdentification
     * @summary Starts the System Identification procedure.
     * @request GET:/devices/{deviceRef}/start-system-identification
     */
    startSystemIdentification: (
      deviceRef: string,
      query?: {
        /**
         * Duration is specified as a float in seconds, with a default of 3.0 if not specified.
         * @example 3
         */
        "duration-seconds"?: number;
        /**
         * Torque amplitude is an integer, defaulting to 300 if not specified.
         * @example 300
         */
        "torque-amplitude"?: number;
        /**
         * Start frequency is an integer, defaulting to 2 if not specified.
         * @example 2
         */
        "start-frequency"?: number;
        /**
         * End frequency is an integer, defaulting to 60 if not specified.
         * @example 60
         */
        "end-frequency"?: number;
        /**
         * Runs the Next Generation System Identification algorithm instead of the existing one.
         * @default false
         * @example true
         */
        "next-gen-sys-id"?: boolean;
        /**
         * The duration (in milliseconds) the client will wait for a response(s) to the previous request before raising a timeout error.
         * @default 30000
         * @example 30000
         */
        "request-timeout"?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<string, ErrorObject>({
        path: `/devices/${deviceRef}/start-system-identification`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags device
     * @name GetCirculoEncoderMagnetDistance
     * @summary Retrieve the Circulo encoder magnet distance.
     * @request GET:/devices/{deviceRef}/circulo-encoder-magnet-distance
     */
    getCirculoEncoderMagnetDistance: (
      deviceRef: string,
      query?: {
        /**
         * @default 1
         * @example 1
         */
        "encoder-ordinal"?: number;
        /** @example 0 */
        "ring-revision"?: number;
        /**
         * The duration (in milliseconds) the client will wait for a response(s) to the previous request before raising a timeout error.
         * @default 5000
         * @example 5000
         */
        "request-timeout"?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          distance?: string;
          position?: string;
        },
        ErrorObject
      >({
        path: `/devices/${deviceRef}/circulo-encoder-magnet-distance`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags device
     * @name SetModesOfOperation
     * @summary Sets Mode of Operation (0x6060:00) on the device.
     * @request GET:/devices/{deviceRef}/set-modes-of-operation/{modesOfOperation}
     */
    setModesOfOperation: (
      deviceRef: string,
      modesOfOperation: number,
      params: RequestParams = {},
    ) =>
      this.request<void, ErrorObject>({
        path: `/devices/${deviceRef}/set-modes-of-operation/${modesOfOperation}`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags device
     * @name TransitionToCia402State
     * @summary Transitions the device to the specified CiA 402 state.
     * @request GET:/devices/{deviceRef}/transition-to-cia402-state/{state}
     */
    transitionToCia402State: (
      deviceRef: string,
      state: string,
      params: RequestParams = {},
    ) =>
      this.request<void, ErrorObject>({
        path: `/devices/${deviceRef}/transition-to-cia402-state/${state}`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags device
     * @name GetCia402State
     * @summary Retrieve the current CiA 402 state.
     * @request GET:/devices/{deviceRef}/cia402-state
     */
    getCia402State: (
      deviceRef: string,
      query?: {
        /**
         * The duration (in milliseconds) the client will wait for a response(s) to the previous request before raising a timeout error.
         * @default 5000
         * @example 5000
         */
        "request-timeout"?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          state?: string;
        },
        ErrorObject
      >({
        path: `/devices/${deviceRef}/cia402-state`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags device
     * @name SaveConfig
     * @summary Stores the modified parameter values in the device's config.csv file.
     * @request GET:/devices/{deviceRef}/save-config
     */
    saveConfig: (deviceRef: string, params: RequestParams = {}) =>
      this.request<void, ErrorObject>({
        path: `/devices/${deviceRef}/save-config`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags device
     * @name LoadConfig
     * @summary Replace or merge the contents of the config.csv file with the provided data and instruct the device to load the updated configuration.
     * @request PUT:/devices/{deviceRef}/load-config
     */
    loadConfig: (
      deviceRef: string,
      data: File,
      query?: {
        /**
         * Refreshes (rereads) the device parameter values after loading the new configuration, ensuring Motion Master uses the updated values instead of the old ones.
         * @default false
         * @example true
         */
        refresh?: boolean;
        /**
         * Applies either a replace or merge strategy when saving the config.csv file.
         * @default "replace"
         * @example "merge"
         */
        strategy?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, ErrorObject>({
        path: `/devices/${deviceRef}/load-config`,
        method: "PUT",
        query: query,
        body: data,
        ...params,
      }),

    /**
     * No description
     *
     * @tags device
     * @name StartOpenLoopFieldControl
     * @summary Starts the open loop field control procedure.
     * @request GET:/devices/{deviceRef}/start-open-loop-field-control
     */
    startOpenLoopFieldControl: (
      deviceRef: string,
      query?: {
        /** @example 360 */
        angle?: number;
        /** @example 5 */
        velocity?: number;
        /** @example 1000 */
        acceleration?: number;
        /** @example 1000 */
        torque?: number;
        /** @example null */
        "torque-speed"?: number;
        /**
         * The duration (in milliseconds) the client will wait for a response(s) to the previous request before raising a timeout error.
         * @default 120000
         * @example 120000
         */
        "request-timeout"?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, ErrorObject>({
        path: `/devices/${deviceRef}/start-open-loop-field-control`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags device
     * @name ComputeAutoTuningGainsVelocity
     * @summary Computes velocity auto tuning gains.
     * @request GET:/devices/{deviceRef}/compute-auto-tuning-gains/velocity
     */
    computeAutoTuningGainsVelocity: (
      deviceRef: string,
      query?: {
        /** @example 5 */
        "velocity-loop-bandwidth"?: number;
        /** @example 0.7 */
        "velocity-damping"?: number;
        /**
         * The duration (in milliseconds) the client will wait for a response(s) to the previous request before raising a timeout error.
         * @default 120000
         * @example 120000
         */
        "request-timeout"?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, ErrorObject>({
        path: `/devices/${deviceRef}/compute-auto-tuning-gains/velocity`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags device
     * @name ComputeAutoTuningGainsPosition
     * @summary Computes position auto tuning gains.
     * @request GET:/devices/{deviceRef}/compute-auto-tuning-gains/position
     */
    computeAutoTuningGainsPosition: (
      deviceRef: string,
      query: {
        /** @example "P_PI" */
        "controller-type": string;
        /**
         * Settling time given in seconds.
         * @example 0.2
         */
        "settling-time"?: number;
        /** @example 1 */
        "position-damping"?: number;
        /** @example 1 */
        "alpha-mult"?: number;
        /** @example 0 */
        order?: number;
        /** @example 1 */
        lb?: number;
        /** @example 1001 */
        ub?: number;
        /**
         * The duration (in milliseconds) the client will wait for a response(s) to the previous request before raising a timeout error.
         * @default 120000
         * @example 120000
         */
        "request-timeout"?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, ErrorObject>({
        path: `/devices/${deviceRef}/compute-auto-tuning-gains/position`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags device
     * @name StartFullAutoTuningVelocity
     * @summary Starts the full velocity auto-tuning procedure.
     * @request GET:/devices/{deviceRef}/start-full-auto-tuning/velocity
     */
    startFullAutoTuningVelocity: (
      deviceRef: string,
      query?: {
        /**
         * The duration (in milliseconds) the client will wait for a response(s) to the previous request before raising a timeout error.
         * @default 60000
         * @example 60000
         */
        "request-timeout"?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /** @format number */
          dampingRatio?: number;
          /** @format number */
          settlingTime?: number;
          /** @format number */
          bandwidth?: number;
          /** @format number */
          "0x2011:01"?: number;
          /** @format number */
          "0x2011:02"?: number;
          /** @format number */
          "0x2011:03"?: number;
          /** @format number */
          "0x2011:04"?: number;
        },
        ErrorObject
      >({
        path: `/devices/${deviceRef}/start-full-auto-tuning/velocity`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags device
     * @name StartFullAutoTuningPosition
     * @summary Starts the full position auto-tuning procedure.
     * @request GET:/devices/{deviceRef}/start-full-auto-tuning/position/{controllerType}
     */
    startFullAutoTuningPosition: (
      deviceRef: string,
      controllerType: string,
      query?: {
        /**
         * The duration (in milliseconds) the client will wait for a response(s) to the previous request before raising a timeout error.
         * @default 60000
         * @example 60000
         */
        "request-timeout"?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /** @format number */
          dampingRatio?: number;
          /** @format number */
          settlingTime?: number;
          /** @format number */
          bandwidth?: number;
          /** @format number */
          "0x2012:01"?: number;
          /** @format number */
          "0x2012:02"?: number;
          /** @format number */
          "0x2012:03"?: number;
          /** @format number */
          "0x2012:04"?: number;
          /** @format number */
          "0x2012:05"?: number;
          /** @format number */
          "0x2012:06"?: number;
          /** @format number */
          "0x2012:07"?: number;
          /** @format number */
          "0x2012:08"?: number;
        },
        ErrorObject
      >({
        path: `/devices/${deviceRef}/start-full-auto-tuning/position/${controllerType}`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags device
     * @name StopFullAutoTuning
     * @summary Stops the full auto-tuning procedure.
     * @request GET:/devices/{deviceRef}/stop-full-auto-tuning
     */
    stopFullAutoTuning: (
      deviceRef: string,
      query?: {
        /**
         * The duration (in milliseconds) the client will wait for a response(s) to the previous request before raising a timeout error.
         * @default 10000
         * @example 10000
         */
        "request-timeout"?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, ErrorObject>({
        path: `/devices/${deviceRef}/stop-full-auto-tuning`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags device
     * @name SetHaltBit
     * @summary Sets the halt bit to either high or low.
     * @request GET:/devices/{deviceRef}/set-halt-bit/{value}
     */
    setHaltBit: (
      deviceRef: string,
      value: boolean,
      params: RequestParams = {},
    ) =>
      this.request<void, ErrorObject>({
        path: `/devices/${deviceRef}/set-halt-bit/${value}`,
        method: "GET",
        ...params,
      }),

    /**
     * @description Sets the target torque and slope, switches to Torque Profile Mode, and transitions the device to Operation Enabled. The brake is released automatically by the drive in PT mode. When `skip-quick-stop` is `false`, the function waits for the target reached bit (0x6041) within `target-reach-timeout` milliseconds, waits for `holding-duration` if set, then issues a quick stop. `target-reach-timeout` is required when `skip-quick-stop` is `false`; omitting it returns a 400 error. When `skip-quick-stop` is `true` (default), the device remains in the Operation Enabled state and the caller is responsible for stopping it.
     *
     * @tags device
     * @name RunTorqueProfile
     * @summary Runs the torque profile.
     * @request GET:/devices/{deviceRef}/run-torque-profile
     */
    runTorqueProfile: (
      deviceRef: string,
      query?: {
        /**
         * @default 100
         * @example -500
         */
        target?: number;
        /**
         * Delay in milliseconds to hold at the target before issuing a quick stop. Only effective when target-reach-timeout is set.
         * @example 1000
         */
        "holding-duration"?: number;
        /**
         * @default 50
         * @example 20
         */
        slope?: number;
        /**
         * When false, a quick stop is issued after the target is reached. Requires target-reach-timeout to be set, otherwise a 400 error is returned. When true (default), the device remains in the Operation Enabled state.
         * @default true
         * @example false
         */
        "skip-quick-stop"?: boolean;
        /**
         * Time in milliseconds to wait for the target reached bit (0x6041). Required when skip-quick-stop is false.
         * @example 5000
         */
        "target-reach-timeout"?: number;
        /** @example 10 */
        window?: number;
        /** @example 5 */
        "window-time"?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<string, ErrorObject>({
        path: `/devices/${deviceRef}/run-torque-profile`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * @description Sets the target velocity, acceleration and deceleration, switches to Profile Velocity Mode, and transitions the device to Operation Enabled. The brake is released automatically by the drive in PV mode. When `skip-quick-stop` is `false`, the function waits for the target reached bit (0x6041) within `target-reach-timeout` milliseconds, waits for `holding-duration` if set, then issues a quick stop. `target-reach-timeout` is required when `skip-quick-stop` is `false`; omitting it returns a 400 error. When `skip-quick-stop` is `true` (default), the device remains in the Operation Enabled state and the caller is responsible for stopping it.
     *
     * @tags device
     * @name RunVelocityProfile
     * @summary Runs the velocity profile.
     * @request GET:/devices/{deviceRef}/run-velocity-profile
     */
    runVelocityProfile: (
      deviceRef: string,
      query?: {
        /**
         * @default 1000
         * @example 5000
         */
        acceleration?: number;
        /**
         * @default 1000
         * @example -700
         */
        target?: number;
        /**
         * @default 1000
         * @example 5000
         */
        deceleration?: number;
        /**
         * Delay in milliseconds to hold at the target before issuing a quick stop. Only effective when target-reach-timeout is set.
         * @example 1000
         */
        "holding-duration"?: number;
        /**
         * When false, a quick stop is issued after the target is reached. Requires target-reach-timeout to be set, otherwise a 400 error is returned. When true (default), the device remains in the Operation Enabled state.
         * @default true
         * @example false
         */
        "skip-quick-stop"?: boolean;
        /**
         * Time in milliseconds to wait for the target reached bit (0x6041). Required when skip-quick-stop is false.
         * @example 5000
         */
        "target-reach-timeout"?: number;
        /** @example 10 */
        window?: number;
        /** @example 5 */
        "window-time"?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<string, ErrorObject>({
        path: `/devices/${deviceRef}/run-velocity-profile`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * @description Sets the target position, velocity, acceleration and deceleration, switches to Profile Position Mode, transitions the device to Operation Enabled, and applies the set point. The brake is released automatically by the drive in PP mode. When `skip-quick-stop` is `false`, the function waits for the target reached bit (0x6041) within `target-reach-timeout` milliseconds, waits for `holding-duration` if set, then issues a quick stop. `target-reach-timeout` is required when `skip-quick-stop` is `false`; omitting it returns a 400 error. When `skip-quick-stop` is `true` (default), the device remains in the Operation Enabled state and the caller is responsible for stopping it.
     *
     * @tags device
     * @name RunPositionProfile
     * @summary Runs the position profile.
     * @request GET:/devices/{deviceRef}/run-position-profile
     */
    runPositionProfile: (
      deviceRef: string,
      query?: {
        /**
         * @default 1000
         * @example 5000
         */
        acceleration?: number;
        /**
         * @default 1000
         * @example 325000
         */
        target?: number;
        /**
         * @default 1000
         * @example 5000
         */
        deceleration?: number;
        /**
         * Delay in milliseconds to hold at the target before issuing a quick stop. Only effective when target-reach-timeout is set.
         * @example 3000
         */
        "holding-duration"?: number;
        /**
         * When true, the target is added to the current position (0x6064) to compute the absolute target position.
         * @default false
         * @example true
         */
        relative?: boolean;
        /**
         * When false, a quick stop is issued after the target is reached. Requires target-reach-timeout to be set, otherwise a 400 error is returned. When true (default), the device remains in the Operation Enabled state.
         * @default true
         * @example false
         */
        "skip-quick-stop"?: boolean;
        /**
         * Time in milliseconds to wait for the target reached bit (0x6041). Required when skip-quick-stop is false.
         * @example 5000
         */
        "target-reach-timeout"?: number;
        /**
         * @default 100
         * @example 500
         */
        velocity?: number;
        /** @example 10 */
        window?: number;
        /** @example 5 */
        "window-time"?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<string, ErrorObject>({
        path: `/devices/${deviceRef}/run-position-profile`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags device
     * @name ApplySetPoint
     * @summary Applies a new position set-point.
     * @request GET:/devices/{deviceRef}/apply-set-point
     */
    applySetPoint: (deviceRef: string, params: RequestParams = {}) =>
      this.request<void, ErrorObject>({
        path: `/devices/${deviceRef}/apply-set-point`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags device
     * @name ForceOnDemandParametersUpdate
     * @summary Resets faults or performs a CiA402 state transition to apply updated on-demand parameter values.
     * @request GET:/devices/{deviceRef}/force-on-demand-parameters-update
     */
    forceOnDemandParametersUpdate: (
      deviceRef: string,
      params: RequestParams = {},
    ) =>
      this.request<void, ErrorObject>({
        path: `/devices/${deviceRef}/force-on-demand-parameters-update`,
        method: "GET",
        ...params,
      }),

    /**
     * @description ⚠️ **Note:** This endpoint may return a large JSON response, which can crash or freeze Swagger UI. Please use another API client to test this endpoint reliably.
     *
     * @tags device
     * @name StartCirculoEncoderNarrowAngleCalibrationProcedure
     * @summary Starts the Circulo Encoder Narrow Angle Calibration procedure.
     * @request GET:/devices/{deviceRef}/start-circulo-encoder-narrow-angle-calibration
     */
    startCirculoEncoderNarrowAngleCalibrationProcedure: (
      deviceRef: string,
      query?: {
        /**
         * @default 1
         * @example 1
         */
        "encoder-ordinal"?: number;
        /**
         * Activates encoder health monitoring by configuring register 0x2C to 0x0C.
         * @default false
         * @example true
         */
        "activate-health-monitoring"?: boolean;
        /**
         * Performs a single iteration of the encoder calibration without altering or recalibrating the encoder. Use this option to review the encoder's previous calibration.
         * @default false
         * @example true
         */
        "measurement-only"?: boolean;
        /**
         * Specifies the external encoder type. Default is 0 (none). Options: 1 - C7 Inner, 2 - C7 Outer, 3 - C9 Inner, 4 - C9 Outer.
         * @default 0
         * @example 0
         */
        "external-encoder-type"?: number;
        /**
         * The duration (in milliseconds) the client will wait for a response(s) to the previous request before raising a timeout error.
         * @default 120000
         * @example 120000
         */
        "request-timeout"?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          data: number[][];
          result: {
            value: number;
            meaning: string;
          };
        }[],
        ErrorObject
      >({
        path: `/devices/${deviceRef}/start-circulo-encoder-narrow-angle-calibration`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags device
     * @name StartCirculoEncoderConfiguration
     * @summary Starts the Circulo Encoder Configuration procedure.
     * @request GET:/devices/{deviceRef}/start-circulo-encoder-configuration
     */
    startCirculoEncoderConfiguration: (
      deviceRef: string,
      query?: {
        /**
         * @default 1
         * @example 1
         */
        "encoder-ordinal"?: number;
        /**
         * @default 0
         * @example 10000
         */
        "battery-mode-max-acceleration"?: number;
        /**
         * Specifies the Circulo type when configuring external encoder. Default is 0 (none). Options: 1 - C7, 2 - C7 SMM, 3 - C9, 4 - C9 SMM.
         * @default 0
         * @example 2
         */
        "external-circulo-type"?: number;
        /**
         * The duration (in milliseconds) the client will wait for a response(s) to the previous request before raising a timeout error.
         * @default 30000
         * @example 30000
         */
        "request-timeout"?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, ErrorObject>({
        path: `/devices/${deviceRef}/start-circulo-encoder-configuration`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags device
     * @name CheckCirculoEncoderErrors
     * @summary Checks if any errors are present in the encoder.
     * @request GET:/devices/{deviceRef}/check-circulo-encoder-errors
     */
    checkCirculoEncoderErrors: (
      deviceRef: string,
      query?: {
        /**
         * @default 1
         * @example 1
         */
        "encoder-ordinal"?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /**
           * A short, human-readable name for the error.
           * @example "MT_ERR"
           */
          name: string;
          /**
           * A brief error code or message identifying the error type.
           * @example "Multiturn communication error: MTD line not 1 when trying to read MT data, MTD line is not 0 right after the last clock pulse, or SSI error bit active on MT interface"
           */
          error: string;
          /**
           * A concise description of the error condition.
           * @example "Multiturn Counter communication error."
           */
          description: string;
          /**
           * Suggested steps to resolve the error.
           * @example "Check MT configuration, connect a battery. Power cycle the drive."
           */
          remedy: string;
          /**
           * A comprehensive explanation of the error, including context and details.
           * @example "The Multiturn counter is in error state. Connect the multiturn battery, check the battery voltage, configure the multiturn bits in OBLAC Drives, configure internal encoder and save changes. Power cycle the drive. If the error is still present, please contact support."
           */
          fullDescription: string;
        }[],
        ErrorObject
      >({
        path: `/devices/${deviceRef}/check-circulo-encoder-errors`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags device
     * @name StartIntegroEncoderCalibration
     * @summary Starts the Integro Encoder Calibration procedure.
     * @request GET:/devices/{deviceRef}/start-integro-encoder-calibration
     */
    startIntegroEncoderCalibration: (
      deviceRef: string,
      params: RequestParams = {},
    ) =>
      this.request<void, ErrorObject>({
        path: `/devices/${deviceRef}/start-integro-encoder-calibration`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags device
     * @name RunOsCommand
     * @summary Runs OS command.
     * @request POST:/devices/{deviceRef}/run-os-command
     */
    runOsCommand: (
      deviceRef: string,
      query: {
        /**
         * A comma-separated list of numbers.
         * @example "0,0,0,0,0,0,0,0"
         */
        command: string;
        /**
         * The maximum time allowed for the command to complete.
         * @default 10000
         * @example 10000
         */
        "command-timeout"?: number;
        /**
         * The interval (in milliseconds) for polling the command response.
         * @default 1000
         * @example 1000
         */
        "response-polling-interval"?: number;
        /** Boolean value to toggle the OS command mode. */
        "os-command-mode"?:
          | "EXECUTE_THE_NEXT_COMMAND_IMMEDIATELY"
          | "ABORT_THE_CURRENT_COMMAND_AND_ALL_COMMANDS_IN_THE_BUFFER"
          | boolean;
        /**
         * Specifies whether to read data from the fs-buffer.
         * @default false
         * @example false
         */
        "read-fs-buffer"?: boolean;
        /**
         * The timeout for reading/writing the fs-buffer content, in milliseconds.
         * @default 30000
         * @example 30000
         */
        "fs-buffer-read-write-timeout"?: number;
      },
      data: any,
      params: RequestParams = {},
    ) =>
      this.request<OsCommandResponse, ErrorObject>({
        path: `/devices/${deviceRef}/run-os-command`,
        method: "POST",
        query: query,
        body: data,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags device
     * @name RunKublerEncoderRegisterCommunicationOsCommand
     * @summary Runs Kubler encoder register communication OS command.
     * @request GET:/devices/{deviceRef}/run-kubler-encoder-register-communication-os-command
     */
    runKublerEncoderRegisterCommunicationOsCommand: (
      deviceRef: string,
      query?: {
        /**
         * Read (0) or write (1) operation.
         * @default 0
         * @example 0
         */
        rw?: number;
        /**
         * The register address to read from or write to.
         * @default 0
         * @example 4
         */
        "register-address"?: number;
        /**
         * The length of the register to read or write.
         * @default 0
         * @example 4
         */
        "register-length"?: number;
        /**
         * The value to write to the register (only used when rw is 1).
         * @default 0
         * @example 0
         */
        "register-write-value"?: number;
        /**
         * The maximum time allowed for the command to complete.
         * @default 10000
         * @example 10000
         */
        "command-timeout"?: number;
        /**
         * The interval (in milliseconds) for polling the command response.
         * @default 1000
         * @example 1000
         */
        "response-polling-interval"?: number;
        /**
         * Boolean value to toggle the OS command mode.
         * @default false
         * @example false
         */
        "os-command-mode"?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<OsCommandResponse, ErrorObject>({
        path: `/devices/${deviceRef}/run-kubler-encoder-register-communication-os-command`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags device
     * @name ResetKublerEncoderMultiturnPosition
     * @summary Resets the multiturn position of the Kubler encoder to 0.
     * @request GET:/devices/{deviceRef}/reset-kubler-encoder-multiturn-position
     */
    resetKublerEncoderMultiturnPosition: (
      deviceRef: string,
      params: RequestParams = {},
    ) =>
      this.request<OsCommandResponse, ErrorObject>({
        path: `/devices/${deviceRef}/reset-kubler-encoder-multiturn-position`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags device
     * @name GetIntegroEncoderFirmwareVersion
     * @summary Gets the Integro encoder firmware version.
     * @request GET:/devices/{deviceRef}/get-integro-encoder-firmware-version
     */
    getIntegroEncoderFirmwareVersion: (
      deviceRef: string,
      params: RequestParams = {},
    ) =>
      this.request<OsCommandResponse, ErrorObject>({
        path: `/devices/${deviceRef}/get-integro-encoder-firmware-version`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags device
     * @name ReadoutIntegroIntegratedEncoderError
     * @summary Reads and parses the error register from an Integro integrated encoder.
     * @request GET:/devices/{deviceRef}/readout-integro-integrated-encoder-error
     */
    readoutIntegroIntegratedEncoderError: (
      deviceRef: string,
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /**
           * The original 32-bit value read from the encoder error register.
           * @format int32
           */
          registerValue?: number;
          /**
           * The lower 16 bits of the register containing debug information.
           * @format int32
           */
          debugInfo?: number;
          /** Structured information about the encoder error code. */
          errorInfo?: {
            /**
             * The 16-bit numeric error code.
             * @format int32
             */
            errorCode?: number;
            /** A short, human-readable name for the error. */
            name?: string;
            /** A detailed description explaining the error. */
            description?: string;
            /** The category or type of error (e.g., hardware, communication, logic). */
            category?: string;
            /** Expected behavior or consequence when this error occurs. */
            behavior?: string;
          };
        },
        ErrorObject
      >({
        path: `/devices/${deviceRef}/readout-integro-integrated-encoder-error`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description This endpoint logs into the SMM for parameter download, transmits parameters from the provided CSV file, verifies each parameter group sequentially, and finally validates the entire SMM configuration, effectively applying a new SMM parameter set. On success, it responds with the content of the safety parameters report file. The default credentials are username: "Test" and password: "SomanetSMM". --- ⚠️ **WARNING: SAFETY-CRITICAL APPLICATION & MANDATORY COMPLIANCE** 1. **SCOPE OF AUTOMATION** This endpoint is designed to automate the parameterization of Safe Motion Module. Use of this endpoint is strictly limited to configurations where a known, valid configuration (.csv) is already available. 2. **MANDATORY CHECKLIST ADHERENCE** Execution of this endpoint does **NOT** bypass the requirements outlined in the “Commissioning of Joints with Known Safety Configuration” checklist. The user must ensure all physical prerequisites are met, including: - Correct mechanical mounting per IEC 61800-5-2:2016. - Proper encoder calibration. - Verification that the FSoE Watchdog is correctly configured on the FSoE Master. 3. **VALIDATION OF LIMITS & REACTIONS** As per standard operating procedure, the safety configuration must be manually checked by intentionally violating limits to trigger and verify the expected reaction. If safe torque values are used, they must be validated by applying specific torque and verifying the reported data. 4. **SYSTEM-WIDE FUNCTIONAL TEST** Automation of individual drive parameters does not validate the safety of the machine. The user is legally required to validate the safety functions of the entire system by triggering every implemented safety function, including establishing a process for repeated testing of STO/SBC functions. 5. **LIABILITY & ARCHIVING** The developer is not liable for configurations that produce violations during regular operation; safety margins must be manually adjusted. Upon completion, the user **MUST** export and archive the safety parameter report along with the commissioning checklists. **BY EXECUTING THIS ENDPOINT, YOU ACKNOWLEDGE THAT YOU HAVE COMPLETED ALL PRE-COMMISSIONING STEPS AND WILL PERFORM ALL POST-COMMISSIONING VALIDATION TESTS LISTED IN THE PROJECT CHECKLIST.**
     *
     * @tags device
     * @name ConfigureSmm
     * @summary Load, verify, and validate SMM parameters from a CSV file.
     * @request POST:/devices/{deviceRef}/configure-smm
     */
    configureSmm: (
      deviceRef: string,
      data: File,
      query?: {
        /**
         * Username for SMM login for parameter download.
         * @default "Test"
         * @example "Test"
         */
        username?: string;
        /**
         * Password for SMM login for parameter download.
         * @default "SomanetSMM"
         * @example "SomanetSMM"
         */
        password?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<string, ErrorObject>({
        path: `/devices/${deviceRef}/configure-smm`,
        method: "POST",
        query: query,
        body: data,
        type: ContentType.Text,
        ...params,
      }),

    /**
     * No description
     *
     * @tags device
     * @name UpdateSmmSoftware
     * @summary Updates the SMM software using the provided binary file.
     * @request POST:/devices/{deviceRef}/update-smm-software
     */
    updateSmmSoftware: (
      deviceRef: string,
      data: File,
      query?: {
        /**
         * Username for SMM login for software update.
         * @default "Test"
         * @example "Test"
         */
        username?: string;
        /**
         * Password for SMM login for software update.
         * @default "SomanetSMM"
         * @example "SomanetSMM"
         */
        password?: string;
        /**
         * CRC value in hexadecimal format (e.g., `0xCAAF7349` or `CAAF7349`).
         * @example "0xCAAF7349"
         */
        crc?: string;
        /**
         * Optional size of each firmware data chunk in bytes.
         * @default 1000
         * @example 1000
         */
        chunkSize?: number;
        /**
         * Optional timeout (ms) for each OS command.
         * @default 30000
         * @example 30000
         */
        commandTimeout?: number;
        /**
         * Optional polling interval (ms) for command responses.
         * @default 1000
         * @example 1000
         */
        responsePollingInterval?: number;
        /**
         * Optional timeout (ms) for FS buffer read/write operations.
         * @default 120000
         * @example 120000
         */
        fsBufferReadWriteTimeout?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, ErrorObject>({
        path: `/devices/${deviceRef}/update-smm-software`,
        method: "POST",
        query: query,
        body: data,
        ...params,
      }),

    /**
     * No description
     *
     * @tags device
     * @name UpdateSmmSoftwareToEncrypted
     * @summary Updates the SMM software to an encrypted version using the provided binary file.
     * @request POST:/devices/{deviceRef}/update-smm-software-to-encrypted
     */
    updateSmmSoftwareToEncrypted: (
      deviceRef: string,
      data: File,
      query?: {
        /**
         * Username for SMM login for software update.
         * @default "Test"
         * @example "Test"
         */
        username?: string;
        /**
         * Password for SMM login for software update.
         * @default "SomanetSMM"
         * @example "SomanetSMM"
         */
        password?: string;
        /**
         * CRC value in hexadecimal format (e.g., `0xCAAF7349` or `CAAF7349`).
         * @example "0xCAAF7349"
         */
        crc?: string;
        /**
         * Optional size of each firmware data chunk in bytes.
         * @default 1000
         * @example 1000
         */
        chunkSize?: number;
        /**
         * Optional timeout (ms) for each OS command.
         * @default 30000
         * @example 30000
         */
        commandTimeout?: number;
        /**
         * Optional polling interval (ms) for command responses.
         * @default 1000
         * @example 1000
         */
        responsePollingInterval?: number;
        /**
         * Optional timeout (ms) for FS buffer read/write operations.
         * @default 120000
         * @example 120000
         */
        fsBufferReadWriteTimeout?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, ErrorObject>({
        path: `/devices/${deviceRef}/update-smm-software-to-encrypted`,
        method: "POST",
        query: query,
        body: data,
        ...params,
      }),

    /**
     * No description
     *
     * @tags device
     * @name WriteCirculoIntegratedEncoderConfigBinFile
     * @summary Writes the Circulo integrated encoder configuration binary file.
     * @request GET:/devices/{deviceRef}/write-circulo-integrated-encoder-config-bin-file/{encoderOrdinal}
     */
    writeCirculoIntegratedEncoderConfigBinFile: (
      deviceRef: string,
      encoderOrdinal: number,
      params: RequestParams = {},
    ) =>
      this.request<void, ErrorObject>({
        path: `/devices/${deviceRef}/write-circulo-integrated-encoder-config-bin-file/${encoderOrdinal}`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags device
     * @name RunChirpSignal
     * @summary Runs the chirp signal on the device.
     * @request GET:/devices/{deviceRef}/run-chirp-signal
     */
    runChirpSignal: (
      deviceRef: string,
      query?: {
        /**
         * Duration for streaming HRD data during the procedure, in milliseconds (ms).
         * @default 4000
         * @example 4000
         */
        "hrd-streaming-duration"?: number;
        /**
         * Modes of operation for the chirp signal. See [ModesOfOperation](https://synapticon.github.io/oblac/motion-master-client/enums/ModesOfOperation.html) for the allowed values.
         * @default 10
         * @example 10
         */
        "modes-of-operation"?: number;
        /**
         * Signal type for the chirp signal. See [SystemIdentificationOsCommandSignalType](https://synapticon.github.io/oblac/motion-master-client/enums/SystemIdentificationOsCommandSignalType.html) for the allowed values.
         * @default 0
         * @example 0
         */
        "signal-type"?: number;
        /**
         * Start frequency of the chirp signal in millihertz (mHz).
         * @default 2000
         * @example 2000
         */
        "start-frequency"?: number;
        /**
         * Start procedure for the chirp signal. See [SystemIdentificationOsCommandStartProcedure](https://synapticon.github.io/oblac/motion-master-client/enums/SystemIdentificationOsCommandStartProcedure.html) for the allowed values.
         * @default 2
         * @example 2
         */
        "start-procedure"?: number;
        /**
         * Target amplitude of the chirp signal in permils (‰) of the rated torque.
         * @default 300
         * @example 300
         */
        "target-amplitude"?: number;
        /**
         * Target frequency of the chirp signal in millihertz (mHz).
         * @default 100000
         * @example 100000
         */
        "target-frequency"?: number;
        /**
         * Duration of the frequency sweep, in milliseconds (ms), representing the transition time from start to target frequency.
         * @default 3000
         * @example 3000
         */
        "transition-time"?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<string, ErrorObject>({
        path: `/devices/${deviceRef}/run-chirp-signal`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags device
     * @name StartLimitedRangeSystemIdentification
     * @summary Starts the Limited Range System Identification procedure.
     * @request GET:/devices/{deviceRef}/start-limited-range-system-identification
     */
    startLimitedRangeSystemIdentification: (
      deviceRef: string,
      query?: {
        /**
         * Duration for streaming HRD data during the procedure, in milliseconds (ms).
         * @default 3200
         * @example 3200
         */
        "hrd-streaming-duration"?: number;
        /**
         * The symmetric position excursion limit (+/-value), expressed in position units.
         * @default 10000
         * @example 10000
         */
        "range-limit"?: number;
        /**
         * The minimum admissible excursion limit used as a lower bound in internal scaling calculations.
         * @default 1000
         * @example 1000
         */
        "range-limit-min"?: number;
        /**
         * Start frequency of the chirp signal in millihertz (mHz).
         * @default 1000
         * @example 1000
         */
        "start-frequency"?: number;
        /**
         * Target amplitude of the chirp signal in permils (‰) of the rated torque.
         * @default 300
         * @example 300
         */
        "target-amplitude"?: number;
        /**
         * Target frequency of the chirp signal in millihertz (mHz).
         * @default 100000
         * @example 100000
         */
        "target-frequency"?: number;
        /**
         * Duration of the frequency sweep, in milliseconds (ms), representing the transition time from start to target frequency.
         * @default 3000
         * @example 3000
         */
        "transition-time"?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, ErrorObject>({
        path: `/devices/${deviceRef}/start-limited-range-system-identification`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags device
     * @name RunOffsetDetection
     * @summary Starts the new Offset Detection procedure.
     * @request GET:/devices/{deviceRef}/run-offset-detection
     */
    runOffsetDetection: (
      deviceRef: string,
      query?: {
        /**
         * Comma-separated list of step names to execute during the Offset Detection procedure.
         * @default ""
         * @example "openPhaseDetection,phaseResistanceMeasurement,phaseInductanceMeasurement"
         */
        stepNames?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<OffsetDetectionResponse, ErrorObject>({
        path: `/devices/${deviceRef}/run-offset-detection`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description ⚠️ **Warning**: This action is irreversible. Every file not listed in `files-to-keep` will be permanently deleted. Ensure you have a backup before proceeding.
     *
     * @tags device
     * @name FactoryReset
     * @summary Performs a factory reset on the device.
     * @request GET:/devices/{deviceRef}/factory-reset
     */
    factoryReset: (
      deviceRef: string,
      query?: {
        /**
         * Comma-separated list of filenames to keep during the factory reset. Any file not listed here will be deleted. If omitted, defaults to `.assembly_config,.factory_config,.hardware_description,.variant,stack_info.json`.
         * @example ".hardware_description,.variant"
         */
        "files-to-keep"?: string;
        /**
         * Whether to install an empty firmware after file removal.
         * @default true
         */
        "install-empty-firmware"?: boolean;
        /**
         * Whether to reload the currently installed firmware. Only applies when `install-empty-firmware` is false.
         * @default false
         */
        "reload-firmware"?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, ErrorObject>({
        path: `/devices/${deviceRef}/factory-reset`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * @description Starts collecting parameter data for the specified device using a fixed parameter set derived from the device's UI PDO mapping, or the default PDO mapping if unavailable. Each device can have its own active monitoring session. Starting a new session for a device will stop any existing session for that specific device. Data accumulates continuously in memory until the session is stopped or the client disconnects.
     *
     * @tags device
     * @name StartMonitoring
     * @summary Starts a data monitoring session for the specified device.
     * @request GET:/devices/{deviceRef}/monitoring/start
     */
    startMonitoring: (
      deviceRef: string,
      query?: {
        /**
         * The duration (in milliseconds) the client will wait for a response(s) to the previous request before raising a timeout error.
         * @example 5000
         */
        "request-timeout"?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, ErrorObject>({
        path: `/devices/${deviceRef}/monitoring/start`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * @description Returns all parameter data collected since the monitoring session was started for the specified device. The first row contains parameter IDs as column headers. Data remains accessible after the session is stopped until a new session is started for the same device or the client disconnects. Returns an empty string if no session has been started for the device.
     *
     * @tags device
     * @name GetMonitoringData
     * @summary Returns the data collected by the active monitoring session for the specified device as CSV.
     * @request GET:/devices/{deviceRef}/monitoring/data
     */
    getMonitoringData: (deviceRef: string, params: RequestParams = {}) =>
      this.request<string, ErrorObject>({
        path: `/devices/${deviceRef}/monitoring/data`,
        method: "GET",
        ...params,
      }),

    /**
     * @description Stops the active monitoring session for the specified device. Collected data remains readable via `/monitoring/data` until a new session is started for the same device or the client disconnects.
     *
     * @tags device
     * @name StopMonitoring
     * @summary Stops the active data monitoring session for the specified device.
     * @request GET:/devices/{deviceRef}/monitoring/stop
     */
    stopMonitoring: (deviceRef: string, params: RequestParams = {}) =>
      this.request<void, ErrorObject>({
        path: `/devices/${deviceRef}/monitoring/stop`,
        method: "GET",
        ...params,
      }),
  };
}
