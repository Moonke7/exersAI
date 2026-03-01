// ============================================================
// DOMAIN ERRORS — Errores tipados del dominio
// ============================================================

export class DomainError extends Error {
  constructor(message: string, public readonly statusCode: number = 500) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class NotFoundError extends DomainError {
  constructor(message: string = "Recurso no encontrado") {
    super(message, 404);
  }
}

export class ValidationError extends DomainError {
  constructor(message: string = "Datos inválidos") {
    super(message, 400);
  }
}

export class AuthenticationError extends DomainError {
  constructor(message: string = "No autorizado") {
    super(message, 401);
  }
}

export class ConflictError extends DomainError {
  constructor(message: string = "Conflicto: el recurso ya existe") {
    super(message, 409);
  }
}
