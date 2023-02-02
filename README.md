# Contacts

## Endpoints

- [POST /contact](#create-contact)
- [GET /contacts](#get-all-contacts)
- [GET /contact/:id](#get-contact-by-id)
- [DELETE /contact/:id](#delete-contact-by-id)
- [PATCH /contact/:id](#update-contact-by-id)

### Create contact

POST /contact

#### Body

- name: string
- phone: string (optional)
- email: string (optional)

Body **must** contain phone **and/or** email.

##### Example body

```JSON
{
    "name": "Lars Larsson",
    "phone": "+46700000000",
    "email": "lars.larsson@example.com"
}
```

#### Returns

- id: string

##### Example return

```JSON
{
    "id": "507f1f77bcf86cd799439011"
}
```

##### Status Codes

- 201 Created
- 400 Bad Request
- 500 Server Error

### Get all contacts

GET /contacts

#### Returns

Array of contacts

Contact:

- id: string
- name: string
- phone: string || null
- email: string || null

##### Example return

```JSON
{
    "contacts": [
        {
            "name": "Lars Larsson",
            "phone": "+46700000000",
            "email": "lars.larsson@example.com"
        },
        {
            "name": "Bengt Bengtsson",
            "phone": "+46711111111",
            "email": "bengt.bengtsson@example.com"
        }
    ]
}
```

#### Status Codes

- 200 OK
- 500 Server Error

### Get contact by id

GET /contact/:id

#### Returns

- id: string
- name: string
- phone: string || null
- email: string || null

##### Example return

```JSON
{
    "id": "507f1f77bcf86cd799439011",
    "name": "Bengt Bengtsson",
    "phone": "+46711111111",
    "email": "bengt.bengtsson@example.com"
}
```

#### Status Codes

- 200 OK
- 404 Not Found
- 500 Server Error

### Delete contact by id

#### Status Codes

- 200 OK
- 404 Not Found
- 500 Server Error

### Update contact by id

#### Body

- name: string (optional)
- phone: string (optional)
- email: string (optional)

  Body cannot be empty.

##### Example body

```JSON
{
    "name": "Lars Larsson",
    "phone": "+46700000000",
    "email": "lars.larsson@example.com"
}
```

#### Status Codes

- 200 OK
- 400 Bad Request
- 404 Not Found
- 500 Server Error

## HTTP Status Code Summary

- 200 OK - Everything worked as expected.
- 201 Created - The request has been fulfilled, resulting in the creation of a new resource.
- 400 Bad Request - The reques was unacceptable, often due to missing a required parameter.
- 404 Not Found - The requested resource doesn't exist.
- 500 Server Error - Something went wrong on our end.
