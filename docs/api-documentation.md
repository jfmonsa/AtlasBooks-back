# API documentation
We are using `swagger-jsdoc` and  `swagger-ui-express` packages, check `.routes` files to see examples on how to document endpoints

> [!NOTE]
> Api documentation is avaiable at `api/v1/docs` route in devloper server (production url or local developer server)

## Key Points to Document Each Endpoint
1. Summary and Description: Provide a brief summary and detailed description of what the endpoint does.
2. Tags: Group related endpoints together using tags.
3. Request Parameters: Document any path parameters, query parameters, headers, and cookies.
4. Request Body: Describe the structure of the request body, including required fields and their types.
5. Responses: Document the possible responses, including status codes and the structure of the response body.
6. Security: Specify any security requirements, such as authentication tokens.