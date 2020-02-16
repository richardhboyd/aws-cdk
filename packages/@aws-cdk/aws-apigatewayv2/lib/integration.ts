import { IRole } from '@aws-cdk/aws-iam';
import { Construct, Duration, IResource, Resource } from '@aws-cdk/core';
import { CfnIntegration } from './apigatewayv2.generated';
import { IWebSocketApi } from './websocket';

/**
 * DocString
 */
export interface IIntegration extends IResource {
  /**
   * The ID of this API Gateway Integration.
   * @attribute
   */
  readonly integrationId: string;
}

/**
 * DocString
 */
export interface IntegrationProps {
  /**
   * The API identifier.
   *
   */
  readonly api: IWebSocketApi;

  /**
   * A description of the purpose of this API Gateway RestApi resource.
   *
   * @default - No description.
   */
  readonly description?: string;

  /**
   * The integration type of an integration.
   *
   * @default - MOCK.
   */
  readonly integrationType?: IntegrationType;

  /**
   * This is a DocString
   *
   * @default - None.
   */
  readonly contentHandlingStrategy?: ContentHandling;

  /**
   * This is a DocString
   *
   * @default - None.
   */
  readonly passthroughBehavior?: PassthroughBehavior;

  /**
   * This is a DocString
   *
   * @default - None.
   */
  readonly role?: IRole;

  /**
   * The integration's HTTP method type.
   * Required unless you use a MOCK integration.
   *
   * @default - None
   */
  readonly integrationHttpMethod?: string;

  /**
   * Custom timeout between 50 and 29,000 milliseconds. The default value is
   * 29,000 milliseconds or 29 seconds
   *
   * @default - 29 seconds
   */
  readonly timeout?: Duration;

  /**
   * The Uniform Resource Identifier (URI) for the integration.
   *
   * - If you specify HTTP for the `type` property, specify the API endpoint URL.
   * - If you specify MOCK for the `type` property, don't specify this property.
   * - If you specify AWS for the `type` property, specify an AWS service that
   *   follows this form: `arn:aws:apigateway:region:subdomain.service|service:path|action/service_api.`
   *   For example, a Lambda function URI follows this form:
   *   arn:aws:apigateway:region:lambda:path/path. The path is usually in the
   *   form /2015-03-31/functions/LambdaFunctionARN/invocations.
   *
   * @see https://docs.aws.amazon.com/apigateway/api-reference/resource/integration/#uri
   * @default - None
   */
  readonly uri?: string;

  /**
   * The request parameters that API Gateway sends with the backend request.
   * Specify request parameters as key-value pairs (string-to-string
   * mappings), with a destination as the key and a source as the value.
   *
   * Specify the destination by using the following pattern
   * integration.request.location.name, where location is querystring, path,
   * or header, and name is a valid, unique parameter name.
   *
   * The source must be an existing method request parameter or a static
   * value. You must enclose static values in single quotation marks and
   * pre-encode these values based on their destination in the request.
   *
   * @default - None
   */
  readonly requestParameters?: { [dest: string]: string };

  /**
   * A map of Apache Velocity templates that are applied on the request
   * payload. The template that API Gateway uses is based on the value of the
   * Content-Type header that's sent by the client. The content type value is
   * the key, and the template is the value (specified as a string), such as
   * the following snippet:
   *
   *   { "application/json": "{\n  \"statusCode\": \"200\"\n}" }
   *
   * @see http://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-mapping-template-reference.html
   *
   * @default - None
   */
  readonly requestTemplates?: { [contentType: string]: string };

  /**
   * The template selection expression for the integration.
   *
   * @default - None
   */
  readonly templateSelectionExpression?: string;
}

/**
 * Represents a WebSocket API Integration in Amazon API Gateway.
 *
 * @resource AWS::apigatewayv2::Integration
 */
export class Integration extends Resource implements IIntegration {

  /**
   * DocString
   */
  public static fromIntegrationId(scope: Construct, id: string, integrationId: string): IIntegration {
    class Import extends Resource implements IIntegration {
      public readonly integrationId = integrationId;
    }

    return new Import(scope, id);
  }

  /**
   * The ID of this API Gateway Integration.
   */
  public readonly integrationId: string;

  constructor(scope: Construct, id: string, props: IntegrationProps) {
    super(scope, id, {
      physicalName: id,
    });

    const resource = new CfnIntegration(this, 'Resource', {
      description: props.description,
      apiId: props.api.webSocketApiId,
      contentHandlingStrategy: props.contentHandlingStrategy,
      integrationType: props.integrationType || IntegrationType.MOCK,
      passthroughBehavior: props.passthroughBehavior,
      credentialsArn: props.role ? props.role.roleArn : undefined,
      integrationMethod: props.integrationHttpMethod,
      integrationUri: props.uri,
      requestParameters: props.requestParameters,
      requestTemplates: props.requestTemplates,
      templateSelectionExpression: props.templateSelectionExpression,
      timeoutInMillis: props.timeout ? props.timeout.toMilliseconds() : undefined
    });
    this.node.defaultChild = resource;

    this.integrationId = resource.ref;
  }
}

/**
 * This is a DocString
 */
export enum ContentHandling {
  /**
   * Converts a request payload from a base64-encoded string to a binary blob.
   */
  CONVERT_TO_BINARY = 'CONVERT_TO_BINARY',

  /**
   * Converts a request payload from a binary blob to a base64-encoded string.
   */
  CONVERT_TO_TEXT = 'CONVERT_TO_TEXT'
}

/**
 * DocString
 */
export enum IntegrationType {
  /**
   * For integrating the API method request with an AWS service action,
   * including the Lambda function-invoking action. With the Lambda
   * function-invoking action, this is referred to as the Lambda custom
   * integration. With any other AWS service action, this is known as AWS
   * integration.
   */
  AWS = 'AWS',

  /**
   * For integrating the API method request with the Lambda function-invoking
   * action with the client request passed through as-is. This integration is
   * also referred to as the Lambda proxy integration
   */
  AWS_PROXY = 'AWS_PROXY',

  /**
   * For integrating the API method request with an HTTP endpoint, including a
   * private HTTP endpoint within a VPC. This integration is also referred to
   * as the HTTP custom integration.
   */
  HTTP = 'HTTP',

  /**
   * For integrating the API method request with an HTTP endpoint, including a
   * private HTTP endpoint within a VPC, with the client request passed
   * through as-is. This is also referred to as the HTTP proxy integration
   */
  HTTP_PROXY = 'HTTP_PROXY',

  /**
   * For integrating the API method request with API Gateway as a "loop-back"
   * endpoint without invoking any backend.
   */
  MOCK = 'MOCK'
}

/**
 * This is a DocString
 */
export enum PassthroughBehavior {
  /**
   * Passes the request body for unmapped content types through to the
   * integration back end without transformation.
   */
  WHEN_NO_MATCH = 'WHEN_NO_MATCH',

  /**
   * Rejects unmapped content types with an HTTP 415 'Unsupported Media Type'
   * response
   */
  NEVER = 'NEVER',

  /**
   * Allows pass-through when the integration has NO content types mapped to
   * templates. However if there is at least one content type defined,
   * unmapped content types will be rejected with the same 415 response.
   */
  WHEN_NO_TEMPLATES = 'WHEN_NO_TEMPLATES'
}
