import '@aws-cdk/assert/jest';
import { Stack } from '@aws-cdk/core';
import { WebSocketApi } from '../lib';

test('defaults', () => {
  const stack = new Stack();
  new WebSocketApi(stack, 'my-api');
  expect(stack).toMatchTemplate({
    Resources: {
      myapi4C7BF186: {
        Type: "AWS::ApiGatewayV2::Api",
        Properties: {
          Name: "my-api",
          ProtocolType: "WEBSOCKET",
          RouteSelectionExpression: "${request.body.key}"
        }
      }
    }
  });
});

test('set name', () => {
  const stack = new Stack();
  new WebSocketApi(stack, 'my-api', {apiName: "RichardApiName"});
  expect(stack).toMatchTemplate({
    Resources: {
      myapi4C7BF186: {
        Type: "AWS::ApiGatewayV2::Api",
        Properties: {
          Name: "RichardApiName",
          ProtocolType: "WEBSOCKET",
          RouteSelectionExpression: "${request.body.key}"
        }
      }
    }
  });
});

test('set description', () => {
  const stack = new Stack();
  new WebSocketApi(stack, 'my-api', {description: "This describes my API"});
  expect(stack).toMatchTemplate({
    Resources: {
      myapi4C7BF186: {
        Type: "AWS::ApiGatewayV2::Api",
        Properties: {
          Name: "my-api",
          Description: "This describes my API",
          ProtocolType: "WEBSOCKET",
          RouteSelectionExpression: "${request.body.key}"
        }
      }
    }
  });
});

test('set Selection Expression', () => {
  const stack = new Stack();
  new WebSocketApi(stack, 'my-api', {routeSelectionExpression: "${request.body.OtherKey}"});
  expect(stack).toMatchTemplate({
    Resources: {
      myapi4C7BF186: {
        Type: "AWS::ApiGatewayV2::Api",
        Properties: {
          Name: "my-api",
          ProtocolType: "WEBSOCKET",
          RouteSelectionExpression: "${request.body.OtherKey}"
        }
      }
    }
  });
});