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

#### 1. Lag Data (POST)
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

#### 2. Fetch Data med Date (GET)
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

## Express Validator Implementation

### Overview
Express-validator er et middleware som validerer incoming requests før de reacher router handlersene dine. 

### Hvordan det funker i mitt prosjekt

1. Validation Chain in `utils/validateData.js`:
```javascript
// Email validation
body('email')
    .trim()                    // Remove whitespace
    .isEmail()                 // Check if valid email format
    .matches(/@afk\.no$/)     // Må ende med @afk.no

// Date validation
body('date')
    .isISO8601()              // Must be YYYY-MM-DD format
    .custom(value => {        // Custom validation
        const date = new Date(value);
        return !isNaN(date.getTime());
    })

// Content validation
body('content')
    .custom((value) => {      // Custom validation for JSON
        if (typeof value === 'object') return true;
        try {
            JSON.parse(value);
            return true;
        } catch (e) {
            throw new Error('Invalid JSON');
        }
    })
```

### Validation Flow
1. Request treffer endpoint `/api/data`
2. Express-validator middleware prosseserer denne requesten
3. Hvert field er validert i følge de reglene jeg har satt opp 
4. Resultetatene er da collecta
5. Og i controlleren så sjekker den validations resultatene
```javascript
const errors = validationResult(req);
if (!errors.isEmpty()) {
    return res.status(400).json({
        status: 'error',
        errors: errors.array()
    });
}
```

### Testing i Postman (eller Thunderclient, men jeg brukte Postman)
```http
POST http://localhost:3000/api/data
Content-Type: application/json

// Valid Request
{
    "email": "test@afk.no",          // Must end with @afk.no
    "date": "2024-03-18",            // Must be valid ISO date
    "content": {"title": "Test"}      // Must be valid JSON
}

// Common Validation Errors:
{
    "email": "test@gmail.com",        // Wrong domain
    "date": "2024-13-45",            // Invalid date
    "content": "{broken json}"        // Invalid JSON
}
```

### Validation Response Eksempler
```json
// Success (201)
{
    "status": "success",
    "data": {
        "email": "test@afk.no",
        "date": "2024-03-18T00:00:00.000Z",
        "content": {"title": "Test"}
    }
}

// Validation Error (400)
{
    "status": "error",
    "errors": [
        {
            "type": "field",
            "msg": "Must be an AFK email address",
            "path": "email",
            "location": "body"
        }
    ]
}
```

