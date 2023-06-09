# social-media-api-using-cross-api

This is an example of applying an api created using cross-api cli. <br>
check it in [cross-api](https://github.com/Mauro-Domingues/cross-api) <br>
Version used: ^3.2.4 <br>
This is an structure example, no unit tests were created.

## Small doc for tests

### BaseUrl = `localhost:3333`

<hr>

## users

 - CREATE

headers:
```typescript
{
  "url": "baseUrl/register",
  "method": "POST",
  "Content-type": "application/json" | "multipart/form-data; boundary=something"
}
```
body:
```typescript
{
  "email": string,
  "password": string,
  "profile_id"?: string,
  "avatar"?: File, // only if "Content-type": "multipart/form-data; boundary=something"
  "age"?: number,
  "bio"?: string,
  "name"?: string,
  "surname"?: string,
  "address"?: {
    "type": "address" | "billing_address" | "shipping_address",
    "street": string,
    "number": number,
    "district": string,
    "complement"?: string,
    "city": string,
    "uf": string,
    "zipcode": number,
    "lat"?: number,
    "lon"?: number,
    "user_id": string
  },
  "permissions_id_array": string[],
  "role_id": string,
}
```

<hr>

 - LOGIN

headers:
```typescript
{
  "url": "baseUrl/login",
  "method": "POST",
  "Content-type": "application/json",
}
```
body:
```typescript
// Login using email and password or refresh_token
{
  "email": string,
  "password": string,
  "refresh_token"?: string
}
```

<hr>

 - SEND FORGOT PASSWORD EMAIL

headers:
```typescript
{
  "url": "baseUrl/forgot-password",
  "method": "POST",
  "Content-type": "application/json",
}
```
body:
```typescript
{
  "email": string,
}
```

<hr>

 - RESET PASSWORD

headers:
```typescript
{
  "url": "baseUrl/reset-password?token=string",
  "method": "POST",
  "Content-type": "application/json",
}
```
body:
```typescript
{
  "password": string
}
```

<hr>

 - LIST

headers:
```typescript
{
  "url": "baseUrl/users",
  "method": "GET",
  "Authorization": "Bearer token"
}
```

<hr>

 - SHOW

headers:
```typescript
{
  "url": "baseUrl/users/:id",
  "method": "GET",
  "Authorization": "Bearer token"
}
```

<hr>

 - ME -> me is a show user with detailed data

headers:
```typescript
{
  "url": "baseUrl/me",
  "method": "GET",
  "Authorization": "Bearer token"
}
```

<hr>

 - UPDATE

headers:
```typescript
{
  "url": "baseUrl/register",
  "method": "PUT",
  "Content-type": "application/json" | "multipart/form-data; boundary=something",
  "Authorization": "Bearer token"
}
```
body:
```typescript
{
  "profile_id"?: string,
  "avatar"?: File, // only if "Content-type": "multipart/form-data; boundary=something"
  "age"?: number,
  "bio"?: string,
  "name"?: string,
  "surname"?: string,
  "address"?: {
    "type": "address" | "billing_address" | "shipping_address",
    "street": string,
    "number": number,
    "district": string,
    "complement"?: string,
    "city": string,
    "uf": string,
    "zipcode": number,
    "lat"?: number,
    "lon"?: number,
    "user_id": string
  },
  "permissions_id_array": string[],
  "role_id": string,
}
```

<hr>

 - DELETE

headers:
```typescript
{
  "url": "baseUrl/users/:id",
  "method": "DELETE",
  "Authorization": "Bearer token"
}
```

<hr>

## Profiles

 - CREATE

headers:
```typescript
{
  "url": "baseUrl/profiles",
  "method": "POST",
  "Content-type": "application/json" | "multipart/form-data; boundary=something",
  "Authorization": "Bearer token"
}
```
body:
```typescript
{
  "avatar"?: File, // only if "Content-type": "multipart/form-data; boundary=something"
  "age"?: number,
  "bio"?: string,
  "name"?: string,
  "surname"?: string,
  "user_id": string
}
```

<hr>

 - LIST

headers:
```typescript
{
  "url": "baseUrl/profiles",
  "method": "GET"
}
```

<hr>

 - SHOW

headers:
```typescript
{
  "url": "baseUrl/profiles/:id",
  "method": "GET"
}
```

<hr>

 - UPDATE

headers:
```typescript
{
  "url": "baseUrl/profiles/:id",
  "method": "PUT",
  "Content-type": "application/json" | "multipart/form-data; boundary=something",
  "Authorization": "Bearer token"
}
```
body:
```typescript
{
  "avatar"?: File, // only if "Content-type": "multipart/form-data; boundary=something"
  "age"?: number,
  "bio"?: string,
  "name"?: string,
  "surname"?: string,
  "user_id": string
}
```

<hr>

 - DELETE

headers:
```typescript
{
  "url": "baseUrl/profiles/:id",
  "method": "DELETE",
  "Authorization": "Bearer token"
}
```

<hr>

## Addresses

 - CREATE

headers:
```typescript
{
  "url": "baseUrl/addresses"
  "method": "POST",
  "Content-type": "application/json",
  "Authorization": "Bearer token"
}
```
body:
```typescript
{
  "type": "address" | "billing_address" | "shipping_address",
  "street": string,
  "number": number,
  "district": string,
  "complement"?: string,
  "city": string,
  "uf": string,
  "zipcode": number,
  "lat"?: number,
  "lon"?: number,
  "user_id": string
}
```

<hr>

 - LIST

headers:
```typescript
{
  "url": "baseUrl/addresses",
  "method": "GET",
  "Authorization": "Bearer token"
}
```

<hr>

 - SHOW

headers:
```typescript
{
  "url": "baseUrl/addresses/:id",
  "method": "GET",
  "Authorization": "Bearer token"
}
```

<hr>

 - UPDATE

headers:
```typescript
{
  "url": "baseUrl/addresses/:id",
  "method": "PUT",
  "Content-type": "application/json",
  "Authorization": "Bearer token"
}
```
body:
```typescript
{
  "type": "address" | "billing_address" | "shipping_address",
  "street": string,
  "number": number,
  "district": string,
  "complement"?: string,
  "city": string,
  "uf": string,
  "zipcode": number,
  "lat"?: number,
  "lon"?: number,
  "user_id": string
}
```

<hr>

 - DELETE

headers:
```typescript
{
  "url": "baseUrl/addresses/:id",
  "method": "DELETE",
  "Authorization": "Bearer token"
}
```

<hr>


## Roles

 - CREATE

headers:
```typescript
{
  "url": "baseUrl/roles",
  "method": "POST",
  "Content-type": "application/json",
  "Authorization": "Bearer token"
}
```
body:
```typescript
{
  "name": string,
  "description": string,
  "slug": string,
  "permissions_id_array"?: string[]
}
```

<hr>

 - LIST

headers:
```typescript
{
  "url": "baseUrl/roles",
  "method": "GET",
  "Authorization": "Bearer token"
}
```

<hr>

 - SHOW

headers:
```typescript
{
  "url": "baseUrl/roles/:id",
  "method": "GET",
  "Authorization": "Bearer token"
}
```

<hr>

 - UPDATE

headers:
```typescript
{
  "url": "baseUrl/roles/:id",
  "method": "PUT",
  "Content-type": "application/json",
  "Authorization": "Bearer token"
}
```
body:
```typescript
{
  "name": string,
  "description": string,
  "permissions_id_array"?: string[]
}
```

<hr>

 - DELETE

headers:
```typescript
{
  "url": "baseUrl/roles/:id",
  "method": "DELETE",
  "Authorization": "Bearer token"
}
```

<hr>

## Permissions

 - CREATE

headers:
```typescript
{
  "url": "baseUrl/permissions",
  "method": "POST",
  "Content-type": "application/json",
  "Authorization": "Bearer token"
}
```
body:
```typescript
{
  "name": string,
  "description": string,
  "roles_id_array": string[]
}
```

<hr>

 - LIST

headers:
```typescript
{
  "url": "baseUrl/permissions",
  "method": "GET",
  "Authorization": "Bearer token"
}
```

<hr>

 - SHOW

headers:
```typescript
{
  "url": "baseUrl/permissions/:id",
  "method": "GET",
  "Authorization": "Bearer token"
}
```

<hr>

 - UPDATE

headers:
```typescript
{
  "url": "baseUrl/permissions/:id",
  "method": "PUT",
  "Content-type": "application/json",
  "Authorization": "Bearer token"
}
```
body:
```typescript
{
  "name": string,
  "description": string,
  "roles_id_array": string[]
}
```

<hr>

 - DELETE

headers:
```typescript
{
  "url": "baseUrl/permissions/:id",
  "method": "DELETE",
  "Authorization": "Bearer token"
}
```

<hr>

## Posts

 - CREATE

headers:
```typescript
{
  "url": "baseUrl/posts",
  "method": "POST",
  "Content-type": "application/json" | "multipart/form-data; boundary=something",
  "Authorization": "Bearer token"
}
```
body:
```typescript
{
  "title": string,
  "description": string,
  "image"?: File // only if "Content-type": "multipart/form-data; boundary=something"
}
```

<hr>

 - LIST

headers:
```typescript
{
  "url": "baseUrl/posts",
  "method": "GET"
}
```

<hr>

 - SHOW

headers:
```typescript
{
  "url": "baseUrl/posts/:id",
  "method": "GET"
}
```

<hr>

 - UPDATE

headers:
```typescript
{
  "url": "baseUrl/posts/:id",
  "method": "PUT",
  "Content-type": "application/json" | "multipart/form-data; boundary=something",
  "Authorization": "Bearer token"
}
```
body:
```typescript
{
  "title": string,
  "description": string,
  "image"?: File // only if "Content-type": "multipart/form-data; boundary=something"
}
```

<hr>

 - DELETE

headers:
```typescript
{
  "url": "baseUrl/posts/:id",
  "method": "DELETE",
  "Authorization": "Bearer token"
}
```

<hr>

## Comments

 - CREATE

headers:
```typescript
{
  "url": "baseUrl/comments",
  "method": "POST",
  "Content-type": "application/json",
  "Authorization": "Bearer token"
}
```
body:
```typescript
{
  "description": string,
  "post_id": string
}
```

<hr>

 - LIST

headers:
```typescript
{
  "url": "baseUrl/comments",
  "method": "GET",
  "Authorization": "Bearer token"
}
```

<hr>

 - SHOW

headers:
```typescript
{
  "url": "baseUrl/comments/:id",
  "method": "GET",
  "Authorization": "Bearer token"
}
```

<hr>

 - UPDATE

headers:
```typescript
{
  "url": "baseUrl/comments/:id",
  "method": "PUT",
  "Content-type": "application/json",
  "Authorization": "Bearer token"
}
```
body:
```typescript
{
  "description": string,
  "post_id": string
}
```

<hr>

 - DELETE

headers:
```typescript
{
  "url": "baseUrl/comments/:id",
  "method": "DELETE",
  "Authorization": "Bearer token"
}
```

<hr>

## Answers

 - CREATE

headers:
```typescript
{
  "url": "baseUrl/answers",
  "method": "POST",
  "Content-type": "application/json",
  "Authorization": "Bearer token"
}
```
body:
```typescript
{
  "description": string,
  "comment_id": string
}
```

<hr>

 - LIST

headers:
```typescript
{
  "url": "baseUrl/answers",
  "method": "GET",
  "Authorization": "Bearer token"
}
```

<hr>

 - SHOW

headers:
```typescript
{
  "url": "baseUrl/answers/:id",
  "method": "GET",
  "Authorization": "Bearer token"
}
```

<hr>

 - UPDATE

headers:
```typescript
{
  "url": "baseUrl/answers/:id",
  "method": "PUT",
  "Content-type": "application/json",
  "Authorization": "Bearer token"
}
```
body:
```typescript
{
  "description": string,
  "comment_id": string
}
```

<hr>

 - DELETE

headers:
```typescript
{
  "url": "baseUrl/answers/:id",
  "method": "DELETE",
  "Authorization": "Bearer token"
}
```

<hr>