# Cloud Environment Provisioning API Documentation

## Introduction

The Cloud Environment Provisioning API allows users to manage cloud environments, request environment provisioning, allocate and enforce quotas, and handle environment lifecycle tasks. This documentation provides details on the available endpoints and their usage.

**Base URL**: `http://localhost:3000` (for local development)

## Authentication

Some endpoints require authentication using JSON Web Tokens (JWT). To authenticate, include a valid JWT token in the request headers as follows:

```
Authorization: Bearer <JWT-Token>
```

Replace `<JWT-Token>` with a valid JWT token obtained from the `/auth/login` endpoint.

### Authentication Endpoint

#### POST `/auth/login`

Authenticate a user and obtain a JWT token.

**Request:**

```json
{
  "username": "user1",
  "password": "password1"
}
```

**Response:**

```json
{
  "token": "<JWT-Token>"
}
```

## Environment Provisioning

### Provisioning Endpoint

#### POST `/environments/provision`

Provision a new cloud environment.

**Request:**

```json
{
  "environmentType": "temporary",
  "numberOfNodes": 2,
  "instanceType": "t3.small"
}
```

- `environmentType` (string): Type of environment (temporary or permanent).
- `numberOfNodes` (number): Number of nodes in the environment.
- `instanceType` (string): EC2 instance type.

**Response:**

```json
{
  "status": "provisioned",
  "environmentType": "temporary",
  "numberOfNodes": 2,
  "instanceType": "t3.small",
  "createdAt": "<Timestamp>"
}
```

## Quota Management

### Quota Endpoint

#### GET `/quota`

Get the current quota status.

**Response:**

```json
{
  "temporary": {
    "available": 10,
    "used": 0
  },
  "permanent": {
    "available": 5,
    "used": 0
  }
}
```

### Allocate Quota Endpoint

#### POST `/quota/allocate`

Allocate and enforce quotas.

**Request:**

```json
{
  "environmentType": "temporary",
  "amount": 1
}
```

- `environmentType` (string): Type of environment (temporary or permanent).
- `amount` (number): Amount of quota to allocate.

**Response:**

```json
{
  "temporary": {
    "available": 10,
    "used": 1
  },
  "permanent": {
    "available": 5,
    "used": 0
  }
}
```

## Environment Lifecycle

### Request Environment Endpoint

#### POST `/environment/request`

Request a new cloud environment.

**Request:**

```json
{
  "environmentType": "temporary",
  "expirationTime": "<Timestamp>",
  "developerId": 1
}
```

- `environmentType` (string): Type of environment (temporary or permanent).
- `expirationTime` (string): Expiration time in ISO 8601 format.
- `developerId` (number): ID of the requesting developer.

**Response:**

```json
{
  "message": "Environment request received and pending approval"
}
```

## List Environments

### List Environments Endpoint

#### GET `/environments`

Get a list of all environments.

**Response:**

```json
[
  {
    "status": "provisioned",
    "environmentType": "temporary",
    "numberOfNodes": 2,
    "instanceType": "t3.small",
    "createdAt": "<Timestamp>"
  },
  {
    "status": "pending",
    "environmentType": "temporary",
    "expirationTime": "<Timestamp>",
    "developerId": 1
  }
]
```

## Extend Environment

### Extend Environment Endpoint

#### POST `/environment/extend/:environmentId`

Extend the expiration time of an environment (requires DevOps approval).

**Request:**

```json
{
  "extensionTime": "<Milliseconds>"
}
```

- `extensionTime` (number): Extension time in milliseconds.

**Response:**

```json
{
  "message": "Environment extension request received and approved"
}
```

## Purge Expired Environments

### Purge Environments Endpoint

#### POST `/environments/purge`

Purge expired environments and update quotas.

**Response:**

```json
{
  "message": "Expired environments purged"
}
```

---

This API documentation provides an overview of the available endpoints, their input parameters, and expected responses. Make sure to replace `<JWT-Token>` and `<Timestamp>` with actual values when testing the API.
