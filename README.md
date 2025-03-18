# Iterasjon-1-RESTful-API

## TASK: Fysisk Systemarkitektur

```mermaid
flowchart TB
    subgraph Frontend
        Client[Frontend Klient]
    end
    subgraph Backend
        Express[Express.js Server]
        Mongo[(MongoDB)]
        Validate{Validering}
    end
    Client -->|HTTP Request| Express
    Express -->|Validerer| Validate
    Validate -->|Lagrer| Mongo
```

## TASK: Flytdiagram Systemarkitektur

```mermaid
sequenceDiagram
    participant K as Klient
    participant E as Express
    participant V as Validator
    participant M as MongoDB

    K->>E: HTTP Request
    E->>V: Valider input
    V->>E: Validering OK/Feil
    E->>M: Database operasjon
    M->>E: Database respons
    E->>K: HTTP Response
```


## TASK: Flytdiagram Software

```mermaid
flowchart TD
    A[API Endepunkt] --> B{Valider Request}
    B -->|OK| C[Valider AFK Epost]
    B -->|Feil| D[Return 400]
    C -->|OK| E[Valider Dato]
    C -->|Feil| F[Return 401]
    E -->|OK| G[Lagre Data]
    E -->|Feil| H[Return 400]
    G --> I[Return 200]
```

## TASK: Funksjonell Beskrivelse

```mermaid
graph LR
    subgraph Endpoints
        POST[POST /api/data]
        GET1[GET /api/data/:id]
        GET2[GET /api/data/date/:date]
        GET3[GET /api/data/user/:email]
    end

    subgraph Responses
        Success[200 OK]
        Error[400/401/500]
    end

    POST --> Success
    POST --> Error
    GET1 --> Success
    GET1 --> Error
    GET2 --> Success
    GET2 --> Error
    GET3 --> Success
    GET3 --> Error
```

## TASK: Standard for Svar og Forespørsel

```mermaid
classDiagram
    class SuccessResponse{
        +String status
        +Object data
        +String message
    }
    class ErrorResponse{
        +String status
        +String code
        +String message
    }
    class Request{
        +String email
        +Date date
        +Object data
    }
```

## TASK: Testing

Skal bruke postman til å teste API-et. Node.js backend kjører på localhost port 3000 eller hva enn du oppgir i ENV filen. MongoDB er connected og tilgjengelig. Postman er installert og kan brukes.
### Brukervalidering
```javascript

// Test: Validere AFK Epost
POST http://localhost:3000/api/data
{
    "email": "test@afk.no",
    "date": "2024-03-18",
    "data": {"title": "Test"}
}

// Forventet resultat: 200 OK
// Test med ugyldig epost
{
    "email": "test@gmail.com",
    "date": "2024-03-18",
    "data": {"title": "Test"}
}
// Forventet resultat: 400 Bad Request
```

### Datovalidering
```javascript
// Test: Validere Datoinput
POST http://localhost:3000/api/data
{
    "email": "test@afk.no",
    "date": "2024-13-45",  // Ugyldig dato
    "data": {"title": "Test"}
}
// Forventet resultat: 400 Bad Request
```

### CRUD Operasjoner
```javascript
// Test Suite: CRUD
// 1. Opprett data
POST http://localhost:3000/api/data
{
    "email": "test@afk.no",
    "date": "2024-03-18",
    "data": {"title": "Test"}
}

// 2. Hent data
GET http://localhost:3000/api/data/date/2024-03-18

// 3. Hent brukerdata
GET http://localhost:3000/api/data/user/test@afk.no
```

## Testing with Postman

### Prerequisites
- Node.js server running on port 3000
- MongoDB running locally
- Postman installed

### Test Cases

#### 1. Create Data (POST)
```http
POST http://localhost:3000/api/data

Headers:
Content-Type: application/json

Body:
{
    "email": "test@afk.no",
    "date": "2024-03-18",
    "content": {"title": "Test", "description": "Any valid JSON works here"}
}
```

Expected Response (201):
```json
{
    "status": "success",
    "data": {
        "email": "test@afk.no",
        "date": "2024-03-18T00:00:00.000Z",
        "content": {
            "title": "Test",
            "description": "Any valid JSON works here"
        }
    }
}
```

#### 2. Get Data by Date (GET)
```http
GET http://localhost:3000/api/data/date/2024-03-18
```

Expected Response (200):
```json
{
    "status": "success",
    "data": [
        {
            "email": "test@afk.no",
            "date": "2024-03-18T00:00:00.000Z",
            "content": {
                "title": "Test",
                "description": "Any valid JSON works here"
            }
        }
    ]
}
```

### Validation Rules
- Email must end with @afk.no
- Date must be in ISO format (YYYY-MM-DD)
- Content must be valid JSON

### Common Errors
- 400: Invalid email format or domain
- 400: Invalid date format
- 400: Invalid JSON content
- 500: Database or server error

