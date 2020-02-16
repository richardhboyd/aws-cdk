import '@aws-cdk/assert/jest';
import { Role } from '@aws-cdk/aws-iam';
import { Duration, Stack } from '@aws-cdk/core';
import { ContentHandling, Integration, PassthroughBehavior, WebSocketApi } from '../lib';

test('only required fields', () => {
  const stack = new Stack();
  const myApi = new WebSocketApi(stack, 'my-api');
  new Integration(stack, "myIntegration", {api: myApi});
  expect(stack).toMatchTemplate({
    Resources: {
      myapi4C7BF186: {
        Type: "AWS::ApiGatewayV2::Api",
        Properties: {
          Name: "my-api",
          ProtocolType: "WEBSOCKET",
          RouteSelectionExpression: "${request.body.key}"
        }
      },
      myIntegrationD536CA2F: {
        Type: "AWS::ApiGatewayV2::Integration",
        Properties: {
          ApiId: {
            Ref: "myapi4C7BF186"
          },
          IntegrationType: "MOCK"
        }
      }
    }
  });
});

test('specified content handling', () => {
  const stack = new Stack();
  const myApi = new WebSocketApi(stack, 'my-api');
  new Integration(stack, "myIntegration", {
    api: myApi,
    contentHandlingStrategy: ContentHandling.CONVERT_TO_TEXT
  });
  expect(stack).toMatchTemplate({
    Resources: {
      myapi4C7BF186: {
        Type: "AWS::ApiGatewayV2::Api",
        Properties: {
          Name: "my-api",
          ProtocolType: "WEBSOCKET",
          RouteSelectionExpression: "${request.body.key}"
        }
      },
      myIntegrationD536CA2F: {
        Type: "AWS::ApiGatewayV2::Integration",
        Properties: {
          ApiId: {
            Ref: "myapi4C7BF186"
          },
          IntegrationType: "MOCK",
          ContentHandlingStrategy: "CONVERT_TO_TEXT"
        }
      }
    }
  });
});

test('specified passthrough behavior', () => {
  const stack = new Stack();
  const myApi = new WebSocketApi(stack, 'my-api');
  new Integration(stack, "myIntegration", {
    api: myApi,
    passthroughBehavior: PassthroughBehavior.NEVER
  });
  expect(stack).toMatchTemplate({
    Resources: {
      myapi4C7BF186: {
        Type: "AWS::ApiGatewayV2::Api",
        Properties: {
          Name: "my-api",
          ProtocolType: "WEBSOCKET",
          RouteSelectionExpression: "${request.body.key}"
        }
      },
      myIntegrationD536CA2F: {
        Type: "AWS::ApiGatewayV2::Integration",
        Properties: {
          ApiId: {
            Ref: "myapi4C7BF186"
          },
          IntegrationType: "MOCK",
          PassthroughBehavior: "NEVER"
        }
      }
    }
  });
});

test('specified role', () => {
  const stack = new Stack();
  const myRole = Role.fromRoleArn(stack, "myRole", "arn:aws:000000000000:lu-moon-1:iam:role:myRoleName");
  const myApi = new WebSocketApi(stack, 'my-api');
  new Integration(stack, "myIntegration", {
    api: myApi,
    role: myRole
  });
  expect(stack).toMatchTemplate({
    Resources: {
      myapi4C7BF186: {
        Type: "AWS::ApiGatewayV2::Api",
        Properties: {
          Name: "my-api",
          ProtocolType: "WEBSOCKET",
          RouteSelectionExpression: "${request.body.key}"
        }
      },
      myIntegrationD536CA2F: {
        Type: "AWS::ApiGatewayV2::Integration",
        Properties: {
          ApiId: {
            Ref: "myapi4C7BF186"
          },
          IntegrationType: "MOCK",
          CredentialsArn: "arn:aws:000000000000:lu-moon-1:iam:role:myRoleName",
        }
      }
    }
  });
});

test('specified integration method', () => {
  const stack = new Stack();
  const myApi = new WebSocketApi(stack, 'my-api');
  new Integration(stack, "myIntegration", {
    api: myApi,
    integrationHttpMethod: "POST"
  });
  expect(stack).toMatchTemplate({
    Resources: {
      myapi4C7BF186: {
        Type: "AWS::ApiGatewayV2::Api",
        Properties: {
          Name: "my-api",
          ProtocolType: "WEBSOCKET",
          RouteSelectionExpression: "${request.body.key}"
        }
      },
      myIntegrationD536CA2F: {
        Type: "AWS::ApiGatewayV2::Integration",
        Properties: {
          ApiId: {
            Ref: "myapi4C7BF186"
          },
          IntegrationType: "MOCK",
          IntegrationMethod: "POST"
        }
      }
    }
  });
});

test('specified timeout', () => {
  const stack = new Stack();
  const myApi = new WebSocketApi(stack, 'my-api');
  new Integration(stack, "myIntegration", {
    api: myApi,
    timeout: Duration.seconds(5)
  });
  expect(stack).toMatchTemplate({
    Resources: {
      myapi4C7BF186: {
        Type: "AWS::ApiGatewayV2::Api",
        Properties: {
          Name: "my-api",
          ProtocolType: "WEBSOCKET",
          RouteSelectionExpression: "${request.body.key}"
        }
      },
      myIntegrationD536CA2F: {
        Type: "AWS::ApiGatewayV2::Integration",
        Properties: {
          ApiId: {
            Ref: "myapi4C7BF186"
          },
          IntegrationType: "MOCK",
          TimeoutInMillis: 5000
        }
      }
    }
  });
});