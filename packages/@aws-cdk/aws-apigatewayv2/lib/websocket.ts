import { Construct, IResource as IResourceBase, Resource } from '@aws-cdk/core';
import { CfnApi } from './apigatewayv2.generated';

/**
 * DocString
 */
export interface IWebSocketApi extends IResourceBase {
  /**
   * The ID of this API Gateway WebSocketApi.
   * @attribute
   */
  readonly webSocketApiId: string;
}

/**
 * DocString
 */
export interface WebSocketApiProps {
  /**
   * A name for the API Gateway RestApi resource.
   *
   * @default - ID of the RestApi construct.
   */
  readonly apiName?: string;

  /**
   * A description of the purpose of this API Gateway RestApi resource.
   *
   * @default - No description.
   */
  readonly description?: string;

  /**
   * Expression to use to identify the Route Selection Key.
   *
   * @default - "${request.body.key}"
   */
  readonly routeSelectionExpression?: string;
}

/**
 * Represents a WebSocket API in Amazon API Gateway.
 *
 * Use `addRoute` to configure the API model.
 *
 * By default, the API will automatically be deployed and accessible from a
 * public endpoint.
 *
 * @resource AWS::apigatewayv2::Api
 */
export class WebSocketApi extends Resource implements IWebSocketApi {

  /**
   * DocString
   */
  public static fromWebSocketApiId(scope: Construct, id: string, webSocketApiId: string): IWebSocketApi {
    class Import extends Resource implements IWebSocketApi {
      public readonly webSocketApiId = webSocketApiId;
    }

    return new Import(scope, id);
  }

  /**
   * The ID of this API Gateway RestApi.
   */
  public readonly webSocketApiId: string;

  constructor(scope: Construct, id: string, props: WebSocketApiProps = { }) {
    super(scope, id, {
      physicalName: props.apiName || id,
    });

    const resource = new CfnApi(this, 'Resource', {
      name: this.physicalName,
      description: props.description,
      protocolType: "WEBSOCKET",
      routeSelectionExpression: props.routeSelectionExpression || "${request.body.key}"
    });
    this.node.defaultChild = resource;

    this.webSocketApiId = resource.ref;
  }
}
