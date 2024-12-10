# API versioning

## Why is it important?

API versioning is crucial for maintaining backward compatibility while allowing for the evolution of your API. It ensures that changes to the API do not break existing clients and provides a clear path for introducing new features and improvements.

## Implemented Approach

We have chosen the middleware-based approach for API versioning. This approach allows us to handle versioning at the router level, making it easier to manage different versions of the API without duplicating code.

### Folder Structure

```
📁 server/
└── 📁 api/
  ├── 📁 books/
    ├── 📁 v1/
    ├── 📁 v2/
  ├── 📁 borrow/
    ├── 📁 v1/
    └── 📁 v3/
  └── 📁 user/
    └── 📁 v1/
```

### Benefits of Middleware-Based Versioning

- **No URL Changes**: The version is specified in the headers, so the URL remains clean and consistent.
- **Granular Control**: You can version individual routes, allowing for more granular control over API changes.
- **Future-Proof**: This approach makes it easier to manage and deprecate old versions of the API without duplicating code.

## Resources

- https://www.codemzy.com/blog/nodejs-api-versioning
