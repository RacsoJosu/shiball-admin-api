interface ConstructorResponse<T> {
  statusCode: number;
  title: string;
  message: string;
  success?: boolean;
  data?: T;
};

export class ApiResponse<T = null> {
  statusCode: number;
  title: string;
  message: string;
  success: boolean;
  data: T;

  constructor({ statusCode, message, data, title, success = true }: ConstructorResponse<T>) {
    this.statusCode = statusCode;
    this.title = title
    this.message = message;
    this.success = success;

    if (typeof data === 'undefined') {
      this.data = null as T;
    } else {
      this.data = data;
    }
  }
}

interface ConstructorError<T> {
  statusCode: number;
  title: string;
  details: string;
  success?: boolean;
  data?: T ;
};

export class ApiError<T = null> extends Error {
  statusCode: number;
  details: string;
  title: string;
  success: false;
  data: T;

  constructor({ statusCode, details, data, title }: ConstructorError<T>) {
    super(details);
    this.statusCode = statusCode;
    this.details = details;
    this.success = false;
    this.title = title;

    if (typeof data === 'undefined') {
      this.data = null as T;
    } else {
      this.data = data;
    }
  }

  getResponse() {
    return {
      details: this.details,
      data: this.data,
      title: this.title,
      success: this.success,
      statuscode: this.statusCode,
      stack:  this.stack,
    };
  }
}